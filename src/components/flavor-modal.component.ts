import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Flavor, StoreService } from '../services/store.service';

@Component({
  selector: 'app-flavor-modal',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-all animate-fade-in" (click)="close.emit()">
      <!-- Modal Content -->
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col md:flex-row md:max-w-3xl transform transition-all animate-scale-up" (click)="$event.stopPropagation()">
        
        <!-- Close Button -->
        <button (click)="close.emit()" class="absolute top-4 right-4 z-20 bg-white/50 hover:bg-white backdrop-blur-md rounded-full p-2 text-stone-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image Section -->
        <div [class]="'relative h-64 md:h-auto md:w-1/2 flex items-center justify-center ' + flavor.color">
          @if (flavor.image) {
            <img [src]="flavor.image" [alt]="flavor.name" class="w-full h-full object-cover">
          } @else {
            <div class="w-32 h-32 rounded-full bg-[#D7CCC8]/50 shadow-inner border-4 border-black/5"></div>
          }
        </div>

        <!-- Info Section -->
        <div class="p-8 md:w-1/2 flex flex-col relative">
          <h2 class="text-4xl font-black text-stone-900 mb-4 leading-tight tracking-tight">{{ flavor.name }}</h2>
          <p class="text-stone-600 mb-6 leading-relaxed">{{ flavor.description }}</p>

          <!-- Ingredients Toggle -->
          <div class="mb-8">
            <button (click)="toggleIngredients()" class="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wide hover:text-amber-700 transition-colors">
              <span>{{ showIngredients() ? 'Ocultar Ingredientes' : 'Ver ingredientes completos' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" [class]="'h-4 w-4 transition-transform duration-300 ' + (showIngredients() ? 'rotate-180' : '')" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            @if (showIngredients()) {
              <div class="mt-4 p-4 bg-stone-50 rounded-xl animate-fade-in border border-stone-100">
                <ul class="text-sm text-stone-600 space-y-1 list-disc list-inside marker:text-amber-500">
                  @for (ing of flavor.ingredients; track ing) {
                    <li>{{ ing }}</li>
                  }
                </ul>
              </div>
            }
          </div>

          <div class="mt-auto">
            <!-- Price & Quantity Row -->
            <div class="flex items-center justify-between mb-6">
               <div>
                  <p class="text-sm text-stone-500 font-bold uppercase tracking-wider mb-1">Precio Unitario</p>
                  <p class="text-3xl font-black text-stone-900">{{ unitPrice | currency:'$':'symbol':'1.0-0' }}</p>
               </div>

               <div class="flex items-center bg-stone-100 rounded-full p-2 border border-stone-200">
                  <button (click)="decrease()" class="w-10 h-10 rounded-full bg-white text-stone-900 shadow-sm flex items-center justify-center font-bold text-xl hover:bg-amber-100 transition-colors disabled:opacity-50">-</button>
                  <span class="w-12 text-center font-black text-xl text-stone-900">{{ quantity() }}</span>
                  <button (click)="increase()" class="w-10 h-10 rounded-full bg-stone-900 text-white shadow-sm flex items-center justify-center font-bold text-xl hover:bg-stone-800 transition-colors">+</button>
               </div>
            </div>

            <button (click)="addToCart.emit(quantity())" class="w-full bg-amber-500 text-brown-900 py-4 px-8 rounded-full font-black text-lg hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-between group">
              <span class="flex items-center gap-2">
                <span>Agregar al Carrito</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span class="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">{{ (unitPrice * quantity()) | currency:'$':'symbol':'1.0-0' }}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scale-up {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in { animation: fade-in 0.3s ease-out; }
    .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class FlavorModalComponent {
  @Input({ required: true }) flavor!: Flavor;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<number>(); // Emits quantity

  store = inject(StoreService);
  showIngredients = signal(false);
  quantity = signal(1);

  // Computed property for unit price based on store configuration
  get unitPrice() {
    return this.store.boxPrices[1];
  }

  toggleIngredients() {
    this.showIngredients.update(v => !v);
  }

  increase() {
    this.quantity.update(q => q + 1);
  }

  decrease() {
    this.quantity.update(q => q > 1 ? q - 1 : 1);
  }
}
