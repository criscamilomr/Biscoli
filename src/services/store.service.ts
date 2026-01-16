
import { Injectable, signal, computed } from '@angular/core';
import { APP_IMAGES } from '../assets/images';

export interface Flavor {
  id: string;
  name: string;
  description: string;
  color: string;
  image?: string; // Optional: If present, overrides CSS art
  ingredients: string[]; // Lista de ingredientes
}

export interface BoxItem {
  id: string;
  size: number; // 2, 4, 6
  flavors: Flavor[];
  price: number;
  quantity: number;
}

export type ViewState = 'HOME' | 'BUILDER' | 'CHECKOUT' | 'SUCCESS' | 'INGREDIENTS' | 'TERMS' | 'PRIVACY' | 'NOT_FOUND';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // State
  readonly currentView = signal<ViewState>('HOME');
  readonly selectedBoxSize = signal<number>(0);
  readonly cart = signal<BoxItem[]>([]);
  readonly currentBuilderFlavors = signal<Flavor[]>([]);

  // Data - Linked to APP_IMAGES
  readonly flavors: Flavor[] = [
    {
      id: 'chocochip',
      name: 'Trozos de chocolate con pecanas',
      description: 'La favorita de todos con chips de chocolate 70% y nueces pecanas.',
      color: 'bg-amber-800',
      image: APP_IMAGES.chocochip,
      ingredients: ['Harina de almendra', 'Chips de chocolate 70%', 'Alulosa', 'Aceite de coco', 'Extracto de vainilla', 'Polvo de hornear', 'Sal marina']
    },
    {
      id: 'redvelvet',
      name: 'Choco avellana ft. Paranice',
      description: 'Suave, con un relleno cremoso de Paranice.',
      color: 'bg-red-700',
      image: APP_IMAGES.redvelvet,
      ingredients: ['Harina de almendra', 'Cacao en polvo', 'Remolacha en polvo (color natural)', 'Alulosa', 'Chips de chocolate blanco vegano', 'Aceite de coco']
    },
    {
      id: 'macadamia',
      name: 'Macadamia White',
      description: 'Crocante macadamia con chocolate blanco vegano.',
      color: 'bg-yellow-200',
      image: APP_IMAGES.macadamia,
      ingredients: ['Harina de almendra', 'Nueces de macadamia', 'Chocolate blanco vegano', 'Alulosa', 'Aceite de coco', 'Vainilla natural']
    },

  ];

  readonly boxPrices: Record<number, number> = {
    1: 15900,
    2: 30900,
    4: 59900,
    6: 85900
  };

  // Computed
  readonly subtotal = computed(() => {
    return this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  readonly hasFreeShipping = computed(() => {
    return this.cart().some(item => item.size === 6);
  });

  readonly shippingFee = computed(() => {
    return this.hasFreeShipping() ? 0 : 9900;
  });

  readonly cartTotal = computed(() => {
    const sub = this.subtotal();
    return sub > 0 ? sub + this.shippingFee() : 0;
  });

  readonly cartCount = computed(() => {
    return this.cart().reduce((acc, item) => acc + item.quantity, 0);
  });

  // Actions
  setView(view: ViewState) {
    this.currentView.set(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startBuildingBox(size: number) {
    this.selectedBoxSize.set(size);
    this.currentBuilderFlavors.set([]);
    this.setView('BUILDER');
  }

  addFlavorToBox(flavor: Flavor) {
    const current = this.currentBuilderFlavors();
    if (current.length < this.selectedBoxSize()) {
      this.currentBuilderFlavors.update(f => [...f, flavor]);
    }
  }

  removeFlavorFromBox(index: number) {
    this.currentBuilderFlavors.update(f => {
      const newF = [...f];
      newF.splice(index, 1);
      return newF;
    });
  }

  finishBox() {
    const size = this.selectedBoxSize();
    const flavors = this.currentBuilderFlavors();

    if (flavors.length === size) {
      const newItem: BoxItem = {
        id: crypto.randomUUID(),
        size,
        flavors,
        price: this.boxPrices[size],
        quantity: 1
      };
      this.cart.update(c => [...c, newItem]);
      this.currentBuilderFlavors.set([]);
      this.setView('HOME');
    }
  }

  addIndividualProduct(flavor: Flavor, count: number = 1) {
    const newItem: BoxItem = {
      id: crypto.randomUUID(),
      size: 1,
      flavors: [flavor],
      price: this.boxPrices[1],
      quantity: count
    };
    this.cart.update(c => [...c, newItem]);
  }

  removeFromCart(itemId: string) {
    this.cart.update(c => c.filter(i => i.id !== itemId));
  }

  clearCart() {
    this.cart.set([]);
  }
}
