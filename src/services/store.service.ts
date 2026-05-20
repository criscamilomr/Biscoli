import { Injectable, signal, computed, inject } from '@angular/core';
import { APP_IMAGES } from '../assets/images';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc, setDoc, docData } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Flavor {
  id: string;
  name: string;
  description: string;
  price?: number; // Optional override price
  color: string;
  image?: string;
  hoverImage?: string;
  ingredients: string[];
  available?: boolean;
}

export interface BoxItem {
  id: string;
  size: number;
  flavors: Flavor[];
  price: number;
  quantity: number;
}

export type ViewState = 'HOME' | 'BUILDER' | 'CHECKOUT' | 'SUCCESS' | 'INGREDIENTS' | 'TERMS' | 'PRIVACY' | 'NOT_FOUND' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private firestore = inject(Firestore);

  // State
  readonly currentView = signal<ViewState>('HOME');
  readonly modalOpen = signal<boolean>(false);
  readonly selectedBoxSize = signal<number>(0);
  readonly cart = signal<BoxItem[]>([]);
  readonly currentBuilderFlavors = signal<Flavor[]>([]);

  // Firestore Collection
  private flavorsCollection = collection(this.firestore, 'flavors');

  // Data - Reactive from Firestore
  // We use toSignal to convert the Observable to a Signal. Initial value is empty array.
  readonly flavors = toSignal(
    collectionData(this.flavorsCollection, { idField: 'id' }).pipe(
      map(data => data as Flavor[]),
      // Sort or filter if needed, but for now raw data is fine
      map(flavors => flavors.sort((a, b) => a.name.localeCompare(b.name)))
    ),
    { initialValue: [] as Flavor[] }
  );

  readonly storeConfig = toSignal(
    docData(doc(this.firestore, 'config', 'store')).pipe(
      map(data => data as { isOpen: boolean; closedMessage: string } || { isOpen: true, closedMessage: '' })
    ),
    { initialValue: { isOpen: true, closedMessage: '' } }
  );

  readonly boxPrices: Record<number, number> = {
    1: 15900,
    2: 30900,
    4: 59900,
    6: 85900
  };

  // Base price for calculations (Standard individual cookie price)
  private readonly STANDARD_PRICE = 15900;

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

  calculateBoxPrice(size: number, flavors: Flavor[]): number {
    let basePrice = this.boxPrices[size] || 0;
    let surcharge = 0;

    for (const flavor of flavors) {
      if (flavor.price && flavor.price > this.STANDARD_PRICE) {
        surcharge += (flavor.price - this.STANDARD_PRICE);
      }
    }

    return basePrice + surcharge;
  }

  finishBox() {
    const size = this.selectedBoxSize();
    const flavors = this.currentBuilderFlavors();

    if (flavors.length === size) {
      const finalPrice = this.calculateBoxPrice(size, flavors);

      const newItem: BoxItem = {
        id: crypto.randomUUID(),
        size,
        flavors,
        price: finalPrice,
        quantity: 1
      };
      this.cart.update(c => [...c, newItem]);
      this.currentBuilderFlavors.set([]);
      // this.setView('HOME'); Removed to allow custom success state in builder
    }
  }

  addIndividualProduct(flavor: Flavor, count: number = 1) {
    // Individual product logic: Use flavor price if set, otherwise standard box 1 price
    const price = flavor.price && flavor.price > 0 ? flavor.price : this.boxPrices[1];

    const newItem: BoxItem = {
      id: crypto.randomUUID(),
      size: 1,
      flavors: [flavor],
      price: price,
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

  async toggleStock(flavorId: string, currentStatus: boolean) {
    const docRef = doc(this.firestore, 'flavors', flavorId);
    await updateDoc(docRef, { available: !currentStatus });
  }

  async updateFlavorPrice(flavorId: string, price: number) {
    const docRef = doc(this.firestore, 'flavors', flavorId);
    await updateDoc(docRef, { price });
  }

  async updateStoreStatus(isOpen: boolean, closedMessage: string) {
    const docRef = doc(this.firestore, 'config', 'store');
    // Use setDoc with merge to ensure document exists
    await setDoc(docRef, { isOpen, closedMessage }, { merge: true });
  }

  // One-time Use: Seed data to Firestore
  async seedData() {
    console.log('StoreService: seedData() invocado.');

    // Check if firestore is initialized
    if (!this.firestore) {
      console.error('StoreService: CRÍTICO - Firestore no está inyectado correctamente.');
      throw new Error('Firestore no disponible');
    }

    const initialFlavors: Flavor[] = [
      {
        id: 'chocochip',
        name: 'Trozos de chocolate con pecanas',
        description: 'La favorita de todos con chips de chocolate 70% y nueces pecanas.',
        color: 'bg-amber-800',
        image: APP_IMAGES.chocochip,
        hoverImage: APP_IMAGES.chocochipHover,
        ingredients: ['Harina de almendra', 'Chips de chocolate 70%', 'Alulosa', 'Aceite de coco', 'Extracto de vainilla', 'Polvo de hornear', 'Sal marina'],
        available: true,
        price: 15900
      },
      {
        id: 'hazelnut',
        name: 'Choco avellana ft. Paranice',
        description: 'Suave, con un relleno cremoso de Paranice.',
        color: 'bg-red-700',
        image: APP_IMAGES.redvelvet, // Image name remains redvelvet for now unless user wants to rename asset
        hoverImage: APP_IMAGES.redvelvetHover,
        ingredients: ['Harina de almendra', 'Cacao en polvo', 'Remolacha en polvo (color natural)', 'Alulosa', 'Chips de chocolate blanco vegano', 'Aceite de coco'],
        available: true,
        price: 15900
      },
      {
        id: 'carrotcake',
        name: 'Carrot Cake con queso crema ft. Krima',
        description: 'Suave galleta de zanahoria con especias, trozos de nuez pecana y un delicioso centro de queso crema vegano Krima.',
        color: 'bg-orange-200',
        image: APP_IMAGES.carrotcake,
        hoverImage: APP_IMAGES.carrotcakeHover,
        ingredients: ['Harina de almendra', 'Zanahoria', 'Nueces pecanas', 'Queso crema vegano (Krima)', 'Alulosa', 'Especias', 'Aceite de coco'],
        available: true, // Reset to true for DB, we control it there now
        price: 15900
      }
    ];

    console.log('StoreService: Iniciando bucle para guardar 3 sabores...');
    for (const flavor of initialFlavors) {
      console.log(`StoreService: Guardando sabor ${flavor.id}...`);
      // Use setDoc with merge to avoid overwriting if exists but update fields
      const docRef = doc(this.firestore, 'flavors', flavor.id);
      await setDoc(docRef, flavor, { merge: true });
      console.log(`StoreService: Sabor ${flavor.id} guardado OK.`);
    }
    console.log('StoreService: Seeding complete! Todos los datos guardados.');
  }
}
