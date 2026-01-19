import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto">
      
      <button (click)="store.setView('HOME')" class="mb-6 text-brown-900 hover:text-black transition-colors flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Seguir comprando
      </button>

      <h2 class="text-4xl font-black text-brown-900 mb-8 tracking-tight">Tu Carrito</h2>

      <!-- Empty State -->
      @if (store.cart().length === 0) {
        <div class="bg-white/80 rounded-[2rem] p-10 text-center shadow-lg border border-white">
          <div class="text-7xl mb-6">🍪</div>
          <p class="text-2xl text-brown-900 font-black mb-2">Tu carrito está vacío</p>
          <p class="text-brown-800 mb-8 text-lg">¡Corre a llenarlo de galletas!</p>
          <button (click)="store.setView('HOME')" class="bg-brown-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-all">Ver Menú</button>
        </div>
      } @else {
        <!-- Cart Items -->
        <div class="space-y-4 mb-8">
          @for (item of store.cart(); track item.id) {
            <div class="bg-white rounded-2xl p-5 shadow-md flex justify-between items-start relative overflow-hidden group border border-gray-50">
              <!-- Delete Btn -->
              <button (click)="store.removeFromCart(item.id)" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 z-10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>

              <div>
                <h3 class="font-black text-xl text-brown-900 mb-2">
                  <span *ngIf="item.quantity > 1" class="text-amber-600 mr-1">{{item.quantity}}x</span>
                  {{ item.size === 1 ? 'Galleta Individual' : 'Caja x' + item.size }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  @for (flavor of item.flavors; track $index) {
                    <span class="text-xs bg-amber-50 text-brown-900 px-3 py-1.5 rounded-lg border border-amber-100 font-bold">{{flavor.name}}</span>
                  }
                </div>
              </div>
              <div class="text-right flex flex-col justify-end h-full pt-8">
                <span class="font-black text-2xl text-brown-900">{{ (item.price * item.quantity) | currency:'$':'symbol':'1.0-0' }}</span>
                @if (item.quantity > 1) {
                   <span class="text-xs text-gray-400 font-medium">{{ item.price | currency:'$':'symbol':'1.0-0' }} c/u</span>
                }
              </div>
            </div>
          }
          
          <div class="bg-white/60 p-6 rounded-2xl border border-white/50 backdrop-blur-sm space-y-2">
            <div class="flex justify-between items-center text-gray-600">
              <span class="font-bold">Subtotal</span>
              <span class="font-bold">{{ store.subtotal() | currency:'$':'symbol':'1.0-0' }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-600">
              <span class="font-bold">Envío</span>
              <span class="font-bold">{{ store.shippingFee() | currency:'$':'symbol':'1.0-0' }}</span>
            </div>
            <div class="h-px bg-gray-200 my-2"></div>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-black text-brown-900">Total</span>
              <span class="text-3xl font-black text-brown-900">{{ store.cartTotal() | currency:'$':'symbol':'1.0-0' }}</span>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <!-- Checkout Form -->
        @if (store.storeConfig().isOpen) {
          <div class="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <h3 class="text-2xl font-black text-brown-900 mb-6 flex items-center gap-2">
              <span>📦</span> Datos de Envío
            </h3>
            
            <form [formGroup]="checkoutForm" (ngSubmit)="submitOrder()" class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                <input type="text" formControlName="name" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/50" placeholder="Tu nombre">
                @if (checkoutForm.get('name')?.touched && checkoutForm.get('name')?.invalid) {
                  <span class="text-red-500 text-xs">Requerido</span>
                }
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                <input type="tel" formControlName="phone" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/50" placeholder="300 123 4567">
                @if (checkoutForm.get('phone')?.touched && checkoutForm.get('phone')?.invalid) {
                  <span class="text-red-500 text-xs">Teléfono válido requerido (10 dígitos)</span>
                }
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
                  <input type="text" formControlName="address" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/50" placeholder="Calle 123 # 45-67">
                  @if (checkoutForm.get('address')?.touched && checkoutForm.get('address')?.invalid) {
                    <span class="text-red-500 text-xs">Requerido</span>
                  }
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Barrio</label>
                  <input type="text" formControlName="neighborhood" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/50" placeholder="Ej: Ciudad Jardín">
                  @if (checkoutForm.get('neighborhood')?.touched && checkoutForm.get('neighborhood')?.invalid) {
                    <span class="text-red-500 text-xs">Requerido</span>
                  }
                </div>
              </div>
              
              <!-- Automatic Payment Info -->
              <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <span class="text-2xl">ℹ️</span>
                <div>
                   <p class="font-bold text-blue-900 text-sm">Método de Pago</p>
                   <p class="text-xs text-blue-800">Por ahora solo aceptamos transferencias. Te enviaremos los datos por WhatsApp al confirmar tu pedido.</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Notas (Opcional)</label>
                <textarea formControlName="notes" rows="2" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/50" placeholder="Ej: Dejar en portería"></textarea>
              </div>

              <button type="submit" [disabled]="checkoutForm.invalid" class="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <span class="text-2xl">📱</span>
                Pedir por WhatsApp
              </button>
              <p class="text-xs text-center text-gray-500 mt-2">Serás redirigido a WhatsApp para enviar tu pedido.</p>
            </form>
          </div>
        } @else {
          <!-- STORE CLOSED STATE -->
          <div class="bg-red-50 rounded-[2rem] p-10 text-center shadow-lg border border-red-100">
             <div class="text-7xl mb-6">🔒</div>
             <h3 class="text-3xl font-black text-brown-900 mb-4">Tienda Cerrada</h3>
             <p class="text-xl text-brown-800 mb-8 max-w-lg mx-auto">
               {{ store.storeConfig().closedMessage || 'Estamos descansando. Volvemos pronto.' }}
             </p>
             <button (click)="store.setView('HOME')" class="bg-brown-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-all">
                Volver al Menú
             </button>
          </div>
        }
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  store = inject(StoreService);
  private fb: FormBuilder = inject(FormBuilder);

  checkoutForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: ['', Validators.required],
    neighborhood: ['', Validators.required],
    notes: ['']
  });

  submitOrder() {
    if (this.checkoutForm.invalid) return;

    const { name, phone, address, neighborhood, notes } = this.checkoutForm.value;
    const cart = this.store.cart();

    let message = `*¡Hola Biscoli! Quiero realizar el siguiente pedido:*\n\n`;

    cart.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      message += `*${item.quantity}x ${item.size === 1 ? 'Galleta Individual' : 'Caja x' + item.size}* - $${lineTotal.toLocaleString()}\n`;
      const flavorsCounts: Record<string, number> = {};
      item.flavors.forEach(f => {
        flavorsCounts[f.name] = (flavorsCounts[f.name] || 0) + 1;
      });

      Object.entries(flavorsCounts).forEach(([flavorName, count]) => {
        message += `   - ${count}x ${flavorName}\n`;
      });
      message += `\n`;
    });

    message += `_Subtotal: $${this.store.subtotal().toLocaleString()}_\n`;
    message += `_Envío: $${this.store.shippingFee().toLocaleString()}_\n`;
    message += `*Total: $${this.store.cartTotal().toLocaleString()}*\n\n`;

    message += `*Datos de Entrega:*\n`;
    message += `Nombre: ${name}\n`;
    message += `Teléfono: ${phone}\n`;
    message += `Dirección: ${address}\n`;
    message += `Barrio: ${neighborhood}\n`;
    message += `Método de Pago: TRANSFERENCIA (Único medio)\n`; // Hardcoded as requested

    if (notes) message += `Notas: ${notes}`;

    const phoneNumber = '573009017621';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
    this.store.clearCart();
    this.store.setView('HOME');
  }
}
