import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-box-builder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-24 pb-32 px-4 max-w-6xl mx-auto font-sans">
      
      <!-- Sticky Header / Navigation -->
      <div class="text-center mb-8 sticky top-0 z-30 pt-4 bg-[#FFF8E1]/95 backdrop-blur-sm pb-4 border-b border-brown-900/10 mb-8">
        <div class="flex items-center justify-between max-w-4xl mx-auto px-4">
           <button (click)="store.setView('HOME')" class="text-brown-900 hover:text-[#72c3fa] transition-colors flex items-center gap-2 font-bold text-sm md:text-base tracking-wide uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Volver
          </button>
          
          <div class="text-center">
            <h2 class="text-3xl md:text-4xl font-black text-brown-900 tracking-tight">Caja de {{store.selectedBoxSize()}}</h2>
            <p class="text-brown-800 text-xs md:text-sm font-medium">
              @if (!isFull()) {
                Elige {{ store.selectedBoxSize() - store.currentBuilderFlavors().length }} sabores más
              } @else {
                ¡Caja completa!
              }
            </p>
          </div>

          <!-- Checkout Button (Mini) -->
           <button 
            [disabled]="!isFull()"
            (click)="store.finishBox()"
            class="bg-brown-900 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full font-black shadow-lg hover:bg-black transition-all text-sm flex items-center gap-2 tracking-wide uppercase"
          >
            <span>{{ store.boxPrices[store.selectedBoxSize()] | currency:'$':'symbol':'1.0-0' }}</span>
            <span class="hidden md:inline">| Agregar</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-12 items-start justify-center">
        
        <!-- LEFT COLUMN: The Box (Sticky on Desktop) -->
        <div class="w-full lg:w-1/3 lg:sticky lg:top-32 z-20 order-1">
          <div class="bg-[#5D4037] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden border-4 border-[#3E2723]">
              <!-- Box Texture/Decor -->
              <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>
              
              <div class="relative z-10">
                <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <span class="text-amber-100 font-bold text-lg">Tu Selección</span>
                  <span class="bg-amber-100 text-brown-900 px-3 py-1 rounded-full text-sm font-black shadow-sm">
                    {{store.currentBuilderFlavors().length}} / {{store.selectedBoxSize()}}
                  </span>
                </div>

                <!-- Box Slots Grid -->
                <div class="grid grid-cols-2 gap-4">
                  @for (slot of slots(); track $index) {
                    <div 
                      class="aspect-square rounded-full border-2 border-dashed border-amber-100/30 flex items-center justify-center relative overflow-hidden transition-all duration-300 group"
                      [class.bg-white_10]="!slot.filled"
                      [class.border-transparent]="slot.filled"
                      [class.bg-white]="slot.filled"
                      [class.shadow-inner]="!slot.filled"
                      [class.shadow-lg]="slot.filled"
                      (click)="slot.filled ? store.removeFlavorFromBox($index) : null"
                    >
                      @if (slot.filled && slot.flavor) {
                         <!-- Cookie Image -->
                         @if (slot.flavor.image) {
                            <img [src]="slot.flavor.image" class="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform">
                         } @else {
                            <div [class]="'w-full h-full ' + slot.flavor.color"></div>
                         }
                         
                         <!-- Remove Overlay -->
                         <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </div>
                      } @else {
                        <!-- Empty State -->
                        <span class="text-amber-100/30 text-4xl font-light">+</span>
                      }
                    </div>
                  }
                </div>

                <!-- Action Button (Mobile/Desktop Bottom of Box) -->
                <button 
                  [disabled]="!isFull()"
                  (click)="store.finishBox()"
                  class="w-full mt-6 bg-amber-500 disabled:bg-gray-400 disabled:text-gray-200 text-brown-900 py-4 rounded-xl font-black shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group uppercase tracking-wide"
                >
                  @if (isFull()) {
                    <span>¡Listo! Agregar al Carrito</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  } @else {
                    <span>Completa tu caja</span>
                  }
                </button>
              </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Flavor Selection -->
        <div class="w-full lg:w-2/3 order-2">
           <h3 class="text-3xl font-black text-brown-900 mb-6 pl-4 border-l-8 border-amber-500 tracking-tight">Nuestros Sabores</h3>
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (flavor of store.flavors(); track flavor.id) {
                <div class="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex gap-5 h-40 group relative overflow-hidden"
                [class.grayscale]="flavor.available === false" [class.opacity-75]="flavor.available === false">
                   
                   <!-- Image Side -->
                   <div class="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden relative self-center shadow-md">
                     @if (flavor.image) {
                       <img [src]="flavor.image" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                     } @else {
                       <div [class]="'w-full h-full ' + flavor.color"></div>
                     }
                     
                     <!-- Count Badge -->
                     @if (countInBox(flavor.id) > 0) {
                        <div class="absolute top-2 right-2 bg-brown-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg text-sm animate-bounce-short z-20">
                          {{countInBox(flavor.id)}}
                        </div>
                     }

                     <!-- OOS Badge -->
                     @if (flavor.available === false) {
                       <div class="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                         <span class="text-white font-black text-xs uppercase tracking-widest border border-white/50 px-2 py-1 rounded bg-black/20 backdrop-blur-sm transform -rotate-12">Agotado</span>
                       </div>
                     }
                   </div>

                   <!-- Content Side -->
                   <div class="flex flex-col justify-center flex-1 z-10">
                      <h4 class="font-black text-xl text-brown-900 leading-tight mb-2 tracking-tight">{{flavor.name}}</h4>
                      <p class="text-sm text-gray-500 leading-snug mb-3 line-clamp-2 font-medium">{{flavor.description}}</p>
                      
                      
                      <div class="mt-auto">
                        <button 
                          (click)="store.addFlavorToBox(flavor)"
                          [disabled]="isFull() || flavor.available === false"
                          class="bg-amber-100 hover:bg-amber-200 text-[#3E2723] px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                        >
                          @if (flavor.available === false) {
                            <span>No disponible</span>
                          } @else {
                            <span>Agregar</span>
                            <span class="text-lg leading-none">+</span>
                          }
                        </button>
                      </div>
                   </div>

                   <!-- Decor Circle -->
                   <div class="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxBuilderComponent {
  store = inject(StoreService);

  isFull = computed(() => this.store.currentBuilderFlavors().length >= this.store.selectedBoxSize());

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
}
