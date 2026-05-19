import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-box-builder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-24 pb-32 px-4 max-w-6xl mx-auto font-sans">
      
      <!-- Sticky Header / Navigation -->
      <div class="text-center mb-8 sticky top-0 z-30 pt-4 bg-[#f0f5ee]/95 backdrop-blur-sm pb-4 border-b border-[#5C2E35]/10 mb-8">
        <div class="flex items-center justify-between max-w-4xl mx-auto px-4">
           <button (click)="store.setView('HOME')" class="text-[#5C2E35] hover:text-[#B5686F] transition-colors flex items-center gap-2 font-bold text-sm md:text-base tracking-wide uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
            Volver
          </button>
          <div class="text-center">
            <h2 class="text-3xl md:text-4xl font-black text-[#3A4A3A] tracking-tight">Caja de {{store.selectedBoxSize()}}</h2>
            <p class="text-[#C4735B] text-xs md:text-sm font-medium">
              @if (!isFull()) {
                Elige {{ store.selectedBoxSize() - store.currentBuilderFlavors().length }} sabores más
              } @else {
                ¡Caja completa!
              }
            </p>
          </div>
           @if (isSuccess()) {
             <button (click)="goToCart()" class="bg-[#5C2E35] text-white px-5 py-2 rounded-full font-black shadow-lg hover:bg-[#7A3B44] transition-all text-sm flex items-center gap-2 tracking-wide uppercase">
              <span>Ir al carrito 🛒</span>
             </button>
           } @else {
             <button [disabled]="!isFull()" (click)="addToCart()" class="bg-[#5C2E35] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full font-black shadow-lg hover:bg-[#7A3B44] transition-all text-sm flex items-center gap-2 tracking-wide uppercase">
              <span>{{ currentPrice() | currency:'$':'symbol':'1.0-0' }}</span>
              <span class="hidden md:inline">| Agregar</span>
             </button>
           }
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-12 items-start justify-center">
        
        <!-- LEFT COLUMN: The Box (Sticky on Desktop) -->
        <div class="w-full lg:w-1/3 lg:sticky lg:top-32 z-20 order-1">
          <div class="bg-[#4A5D4A] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden border-4 border-[#3A4A3A] transition-all duration-300 ease-out" [class.scale-[1.03]]="isSuccess()">
              <!-- Box Texture/Decor -->
              <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>
              
              <div class="relative z-10">
                <div class="flex justify-between items-center mb-6 border-b border-[#C4735B]/20 pb-4">
                  <span class="text-[#F5EDE2] font-bold text-lg">Tu Selección</span>
                  <span class="bg-[#C4735B] text-white px-3 py-1 rounded-full text-sm font-black shadow-sm">
                    {{store.currentBuilderFlavors().length}} / {{store.selectedBoxSize()}}
                  </span>
                </div>

                <!-- Box Slots Grid -->
                <div class="grid grid-cols-2 gap-4">
                  @for (slot of slots(); track $index) {
                    <div 
                      class="aspect-square rounded-full border-2 border-dashed border-[#F5EDE2]/30 flex items-center justify-center relative overflow-hidden transition-all duration-300 group"
                      [class.bg-white_10]="!slot.filled"
                      [class.border-transparent]="slot.filled"
                      [class.bg-white]="slot.filled"
                      [class.shadow-inner]="!slot.filled"
                      [class.shadow-lg]="slot.filled"
                      (click)="slot.filled ? store.removeFlavorFromBox($index) : null"
                    >
                      @if (slot.filled && slot.flavor) {
                         @if (slot.flavor.image) {
                            <img [src]="slot.flavor.image" class="w-full h-full object-cover scale-110 group-hover:scale-105 transition-all duration-300 absolute inset-0 z-10" [class.group-hover:opacity-0]="slot.flavor.hoverImage">
                            @if (slot.flavor.hoverImage) {
                              <img [src]="slot.flavor.hoverImage" class="w-full h-full object-cover scale-110 group-hover:scale-105 transition-all duration-300 absolute inset-0 z-20 opacity-0 group-hover:opacity-100">
                            }
                         } @else {
                            <div [class]="'w-full h-full absolute inset-0 z-10 ' + slot.flavor.color"></div>
                         }
                         <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                         </div>
                      } @else {
                        <span class="text-[#F5EDE2]/30 text-4xl font-light">+</span>
                      }
                    </div>
                  }
                </div>

                @if (isSuccess()) {
                  <div class="mt-6 p-4 bg-[#e0eadc] border-2 border-[#8FA67A] rounded-xl text-center shadow-inner animate-pop-in">
                    <p class="text-[#3A4A3A] font-black mb-3">¡Agregado al carrito con éxito! 🎉</p>
                    <div class="flex gap-2">
                      <button (click)="continueShopping()" class="flex-1 bg-white text-[#4A5D4A] py-2 rounded-lg font-bold text-sm border border-[#8FA67A] hover:bg-[#f0f5ed] transition-colors">Seguir comprando</button>
                      <button (click)="goToCart()" class="flex-1 bg-[#4A5D4A] text-white py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#3A4A3A] transition-colors">Ir al carrito</button>
                    </div>
                  </div>
                } @else {
                  <button [disabled]="!isFull()" (click)="addToCart()" class="w-full mt-6 bg-[#C4735B] disabled:bg-gray-400 disabled:text-gray-200 text-white py-4 rounded-xl font-black shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group uppercase tracking-wide">
                    @if (isFull()) {
                      <span>¡Listo! Agregar al Carrito</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    } @else {
                      <span>Completa tu caja</span>
                    }
                  </button>
                }
              </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Flavor Selection -->
        <div class="w-full lg:w-2/3 order-2">
           <h3 class="text-3xl font-black text-[#3A4A3A] mb-6 pl-4 border-l-8 border-[#C4735B] tracking-tight">Nuestros Sabores</h3>
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (flavor of store.flavors(); track flavor.id) {
                <div class="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl transition-all border border-[#E8D5C0]/50 flex gap-5 h-40 group relative overflow-hidden" [class.grayscale]="flavor.available === false" [class.opacity-75]="flavor.available === false">
                   <div class="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden relative self-center shadow-md">
                     @if (flavor.image) {
                       <img [src]="flavor.image" class="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500 absolute inset-0 z-10" [class.group-hover:opacity-0]="flavor.hoverImage">
                       @if (flavor.hoverImage) {
                         <img [src]="flavor.hoverImage" class="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500 absolute inset-0 z-20 opacity-0 group-hover:opacity-100">
                       }
                     } @else {
                       <div [class]="'w-full h-full absolute inset-0 z-10 ' + flavor.color"></div>
                     }
                     @if (countInBox(flavor.id) > 0) {
                        <div class="absolute top-2 right-2 bg-[#5C2E35] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg text-sm animate-bounce-short z-20">
                          {{countInBox(flavor.id)}}
                        </div>
                     }
                     @if (flavor.available === false) {
                       <div class="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                         <span class="text-white font-black text-xs uppercase tracking-widest border border-white/50 px-2 py-1 rounded bg-black/20 backdrop-blur-sm transform -rotate-12">Agotado</span>
                       </div>
                     }
                   </div>
                   <div class="flex flex-col justify-center flex-1 z-10">
                      <h4 class="font-black text-xl text-[#3A4A3A] leading-tight mb-2 tracking-tight">{{flavor.name}}</h4>
                      <p class="text-sm text-gray-500 leading-snug mb-3 line-clamp-2 font-medium">{{flavor.description}}</p>
                        @if (flavor.price && flavor.price > store.boxPrices[1]) {
                          <div class="mb-2">
                              <span class="bg-[#F5EDE2] text-[#C4735B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E8D5C0]">
                               +{{ (flavor.price - store.boxPrices[1]) | currency:'$':'symbol':'1.0-0' }} / ud
                             </span>
                          </div>
                        }
                      <div class="mt-auto">
                        <button (click)="store.addFlavorToBox(flavor)" [disabled]="isFull() || flavor.available === false" class="bg-[#5C2E35] hover:bg-[#7A3B44] text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-fit">
                          @if (flavor.available === false) {
                            <span>No disponible</span>
                          } @else {
                            <span>Agregar</span>
                            <span class="text-lg leading-none">+</span>
                          }
                        </button>
                      </div>
                   </div>
                   <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-[#F5EDE2] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
                </div>
              }
           </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .bg-white_10 { background-color: rgba(255,255,255,0.1); }
    @keyframes bounce-short {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-25%); }
    }
    .animate-bounce-short {
      animation: bounce-short 0.3s ease-in-out;
    }
    @keyframes pop-in {
      0% { transform: scale(0.9) translateY(10px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    .animate-pop-in {
      animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxBuilderComponent {
  store = inject(StoreService);

  isSuccess = signal(false);

  isFull = computed(() => this.store.currentBuilderFlavors().length >= this.store.selectedBoxSize());

  currentPrice = computed(() => {
    return this.store.calculateBoxPrice(
      this.store.selectedBoxSize(),
      this.store.currentBuilderFlavors()
    );
  });

  slots = computed(() => {
    const size = this.store.selectedBoxSize();
    const current = this.store.currentBuilderFlavors();
    const result = [];
    for (let i = 0; i < size; i++) {
      if (i < current.length) {
        result.push({ filled: true, flavor: current[i] });
      } else {
        result.push({ filled: false, flavor: null });
      }
    }
    return result;
  });

  countInBox(flavorId: string): number {
    return this.store.currentBuilderFlavors().filter(f => f.id === flavorId).length;
  }

  addToCart() {
    this.store.finishBox();
    this.isSuccess.set(true);
  }

  continueShopping() {
    this.isSuccess.set(false);
    this.store.setView('HOME');
  }

  goToCart() {
    this.store.setView('CHECKOUT');
  }
}
