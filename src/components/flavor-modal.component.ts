import { Component, EventEmitter, Input, Output, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Flavor, StoreService } from '../services/store.service';

@Component({
  selector: 'app-flavor-modal',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-all animate-fade-in" (click)="close.emit()">
      <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden relative flex flex-col md:flex-row md:max-w-3xl transform transition-all animate-scale-up" (click)="$event.stopPropagation()">
        
        <button (click)="close.emit()" class="absolute top-4 right-4 z-30 bg-white/50 hover:bg-white backdrop-blur-md rounded-full p-2 text-stone-800 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div class="overflow-y-auto flex-1 flex flex-col md:flex-row w-full overscroll-contain">
          
          <div [class]="'relative aspect-square md:aspect-auto md:h-auto md:w-1/2 flex-shrink-0 flex items-center justify-center overflow-hidden ' + flavor.color">
            @if (flavor.image) {
              <img [src]="flavor.image" [alt]="flavor.name" class="w-full h-full object-contain absolute inset-0 z-10 transition-opacity duration-1000" [class.opacity-0]="showHoverImage()">
              @if (flavor.hoverImage) {
                <img [src]="flavor.hoverImage" [alt]="flavor.name" class="w-full h-full object-contain absolute inset-0 z-20 transition-opacity duration-1000 opacity-0" [class.opacity-100]="showHoverImage()">
              }
            } @else {
              <div class="w-32 h-32 rounded-full bg-[#D7CCC8]/50 shadow-inner border-4 border-black/5"></div>
            }
          </div>

          <div class="p-6 md:p-8 md:w-1/2 flex flex-col relative">
            <h2 class="text-3xl md:text-4xl font-black text-stone-900 mb-4 leading-tight tracking-tight">{{ flavor.name }}</h2>
            <p class="text-stone-600 mb-6 leading-relaxed">{{ flavor.description }}</p>

            <div class="mb-6">
              <button (click)="toggleIngredients()" class="flex items-center gap-2 text-[#8FA67A] font-bold text-sm uppercase tracking-wide hover:text-[#4A5D4A] transition-colors">
                <span>{{ showIngredients() ? 'Ocultar Ingredientes' : 'Ver ingredientes completos' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" [class]="'h-4 w-4 transition-transform duration-300 ' + (showIngredients() ? 'rotate-180' : '')" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              @if (showIngredients()) {
                <div class="mt-4 p-4 bg-stone-50 rounded-xl animate-fade-in border border-stone-100">
                  <ul class="text-sm text-stone-600 space-y-1 list-disc list-inside marker:text-[#8FA67A]">
                    @for (ing of flavor.ingredients; track ing) {
                      <li>{{ ing }}</li>
                    }
                  </ul>
                </div>
              }
            </div>

            <div class="mt-auto">
              @if (flavor.available === false) {
                 <div class="bg-stone-100 rounded-xl p-4 text-center border-2 border-stone-200">
                   <p class="text-stone-500 font-bold uppercase tracking-wider text-sm mb-1">Estado</p>
                   <p class="text-2xl font-black text-stone-400">Agotado Temporalmente</p>
                 </div>
              } @else {
                 <div class="bg-[#f0f5ee] rounded-xl p-4 text-center border border-[#8FA67A]/20">
                   <p class="text-[#4A5D4A] font-bold uppercase tracking-wider text-sm mb-1">Precio Unitario</p>
                   <p class="text-3xl font-black text-[#3A4A3A]">{{ unitPrice | currency:'$':'symbol':'1.0-0' }}</p>
                 </div>
              }
            </div>

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
export class FlavorModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) flavor!: Flavor;
  @Output() close = new EventEmitter<void>();

  store = inject(StoreService);
  showIngredients = signal(false);
  showHoverImage = signal(false);
  private intervalId: any;

  // Computed property for unit price based on store configuration
  get unitPrice() {
    return (this.flavor.price && this.flavor.price > 0) ? this.flavor.price : this.store.boxPrices[1];
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (this.flavor.hoverImage) {
        this.showHoverImage.update(v => !v);
      }
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleIngredients() {
    this.showIngredients.update(v => !v);
  }
}
