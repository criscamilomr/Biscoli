
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StoreService, Flavor } from '../services/store.service';
import { FooterComponent } from './footer.component';
import { MarqueeComponent } from './marquee.component';
import { LogoComponent } from './logo.component';
import { FlavorModalComponent } from './flavor-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, LogoComponent, FlavorModalComponent, MarqueeComponent],
  template: `
    <!-- Flavor Modal -->
    @if (selectedFlavor()) {
      <app-flavor-modal 
        [flavor]="selectedFlavor()!" 
        (close)="closeModal()"
        (addToCart)="addFlavorToBoxAndClose(selectedFlavor()!, $event)">
      </app-flavor-modal>
    }

    <!-- Hero Section -->
    <section id="inicio" class="relative min-h-[45vh] flex flex-col items-center justify-center text-center p-6 pb-6 pt-10">
      
      <!-- Logo Container -->
      <div class="relative w-72 h-32 md:w-96 md:h-48 mb-4 animate-bounce-slow">
        <app-logo width="100%" height="100%"></app-logo>
      </div>
      
      <p class="text-2xl md:text-3xl text-brown-900 font-bold max-w-3xl mb-8 leading-relaxed mt-4 tracking-tight">
        El placer de lo dulce, <br class="md:hidden"> sin la culpa. <br>
        <span class="text-[#72c3fa] font-black drop-shadow-sm">Sin Gluten. Sin Azúcar. Veganas.</span>
      </p>

      <button (click)="scrollToSection('menu')" class="bg-[#1a1a1a] text-white px-10 py-5 rounded-full text-xl font-black shadow-2xl hover:bg-black hover:scale-105 transition-all transform flex items-center gap-2 ring-4 ring-[#72c3fa]/30 tracking-wide uppercase">
        <span>Pedir Ahora</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>


    <!-- Marquee Banner -->
    <app-marquee></app-marquee>

    <!-- Why Us Section (Ingredients Context) -->
    <section id="ingredientes" class="mt-12 md:mt-24 py-16 px-4 bg-[#72c3fa]/5 backdrop-blur-sm rounded-[2.5rem] mx-4 md:mx-auto max-w-6xl shadow-sm border border-[#72c3fa]/10 mb-16 scroll-mt-24">
      <h2 class="text-5xl md:text-6xl text-center text-brown-900 mb-16 font-black tracking-tight">Ingredientes Reales</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <!-- Feature 1 -->
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-blue-50">
          <div class="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
            🌾
          </div>
          <h3 class="text-2xl font-black text-brown-900 mb-3">Sin Gluten</h3>
          <p class="text-gray-600 text-lg font-medium leading-relaxed">Aptas para celíacos. Utilizamos harinas de almendra y avena sin gluten de primera calidad.</p>
        </div>

        <!-- Feature 2 -->
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-blue-50">
          <div class="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
            🌱
          </div>
          <h3 class="text-2xl font-black text-brown-900 mb-3">100% Veganas</h3>
          <p class="text-gray-600 text-lg font-medium leading-relaxed">Sin huevos ni lácteos. Pura magia vegetal con el sabor de siempre.</p>
        </div>

        <!-- Feature 3 -->
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-blue-50">
          <div class="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
            🍬
          </div>
          <h3 class="text-2xl font-black text-brown-900 mb-3">Sin Azúcar</h3>
          <p class="text-gray-600 text-lg font-medium leading-relaxed">Endulzadas con alulosa. Disfruta sin picos de glucosa.</p>
        </div>
      </div>
    </section>


    <!-- Menu / Flavors Preview -->
    <section id="menu" class="py-16 px-4 max-w-7xl mx-auto mb-16 scroll-mt-24">
      <h2 class="text-5xl md:text-6xl text-center text-brown-900 mb-4 font-black tracking-tighter">Nuestros Sabores</h2>
      <p class="text-center text-gray-500 mb-16 text-xl font-medium max-w-2xl mx-auto">Elige tus favoritos al armar tu caja. Diseñados para satisfacer sin comprometer tu salud.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
        @for (flavor of store.flavors; track flavor.id) {
          <div (click)="openModal(flavor)" class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full cursor-pointer ring-1 ring-black/5 hover:ring-black/10">
            
            <!-- Image Area -->
            <div class="aspect-square w-full flex items-center justify-center relative overflow-hidden bg-stone-50">
              @if (flavor.image) {
                <!-- Custom Image from Assets -->
                <img [src]="flavor.image" [alt]="flavor.name" class="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700">
              } @else {
                <!-- CSS Fallback Cookie -->
                <div class="w-28 h-28 rounded-full bg-[#D7CCC8] shadow-inner border-4 border-black/5 relative group-hover:scale-110 transition-transform">
                  <div class="absolute top-4 left-4 w-3 h-3 rounded-full bg-black/20"></div>
                  <div class="absolute bottom-6 right-5 w-4 h-4 rounded-full bg-black/20"></div>
                  <div class="absolute top-8 right-6 w-2 h-2 rounded-full bg-black/20"></div>
                </div>
              }
            </div>

            <div class="p-5 md:p-6 flex-1 flex flex-col">
              <h3 class="font-black text-xl md:text-2xl text-brown-900 leading-tight mb-2 tracking-tight">{{flavor.name}}</h3>
              <p class="text-base text-gray-500 leading-relaxed line-clamp-3 font-medium mb-4">{{flavor.description}}</p>
              
              <div class="mt-auto pt-4 flex flex-col gap-3 border-t border-gray-100" (click)="$event.stopPropagation()">
                <div class="flex items-center justify-between">
                  <span class="font-black text-xl text-brown-900">{{ store.boxPrices[1] | currency:'$':'symbol':'1.0-0' }}</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <div class="flex items-center bg-gray-100 rounded-lg p-1">
                    <button (click)="decQty(flavor.id, $event)" class="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center font-bold text-lg hover:bg-gray-200 transition-colors text-brown-900 disabled:opacity-50">-</button>
                    <span class="w-8 text-center font-bold text-brown-900">{{ getQty(flavor.id) }}</span>
                    <button (click)="incQty(flavor.id, $event)" class="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center font-bold text-lg hover:bg-gray-200 transition-colors text-brown-900">+</button>
                  </div>
                  <button (click)="addFromCard(flavor, $event)" class="flex-1 bg-brown-900 text-amber-50 py-2 rounded-lg font-bold shadow-md hover:bg-black transition-all text-sm flex items-center justify-center gap-1 active:scale-95">
                    <span>Agregar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Box Selection (CTA) -->
    <section id="cajas" class="py-24 px-4 bg-brown-900 relative overflow-hidden scroll-mt-24">
      
      <!-- Background Decor -->
      <div class="absolute top-0 w-full h-full left-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/40 via-brown-900 to-brown-900"></div>

      <div class="max-w-7xl mx-auto text-center relative z-10">
        <span class="text-amber-400 font-extrabold tracking-[0.2em] text-sm uppercase mb-3 block">La Experiencia Biscoli</span>
        <h2 class="text-5xl md:text-7xl mb-8 text-white font-black tracking-tight">Arma tu Caja</h2>
        <p class="mb-20 text-amber-100/80 text-xl font-medium max-w-2xl mx-auto">Elige el tamaño perfecto para ti o para regalar. Personaliza cada espacio con tus sabores favoritos.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          
          <!-- Box x2 -->
          <div (click)="store.startBuildingBox(2)" class="group bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/50 flex flex-col items-center">
            <div class="w-24 h-24 mb-6 bg-white/10 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner font-black text-amber-100">2🍪</div>
            <h3 class="text-3xl font-black text-white mb-2 tracking-tight">Caja Personal</h3>
            <p class="text-amber-200/60 mb-6 text-sm font-medium uppercase tracking-wide">Perfecta para un antojo</p>
            <p class="text-4xl font-black text-amber-400 mb-8">{{ store.boxPrices[2] | currency:'$':'symbol':'1.0-0' }}</p>
            <button class="w-full bg-transparent border-2 border-amber-500 text-amber-500 py-4 rounded-xl font-black hover:bg-amber-500 hover:text-brown-900 transition-all uppercase tracking-wider text-sm">Comenzar</button>
          </div>

          <!-- Box x4 (Featured) -->
          <div (click)="store.startBuildingBox(4)" class="group bg-gradient-to-br from-amber-500/20 to-brown-900/80 backdrop-blur-md border border-amber-500/40 rounded-[2.5rem] p-12 relative transform md:scale-110 shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-amber-500/20 flex flex-col items-center z-10">
            <div class="absolute top-0 right-0 bg-amber-500 text-brown-900 text-xs font-black px-5 py-2 rounded-bl-2xl rounded-tr-[2.3rem] uppercase tracking-widest">Más Popular</div>
            <div class="w-32 h-32 mb-8 bg-amber-500 rounded-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-lg text-brown-900 font-black">4🍪</div>
            <h3 class="text-4xl font-black text-white mb-2 tracking-tight">Caja Compartir</h3>
            <p class="text-amber-100/90 mb-8 font-bold text-lg">La dosis ideal de felicidad</p>
            <p class="text-5xl font-black text-white mb-10 drop-shadow-lg">{{ store.boxPrices[4] | currency:'$':'symbol':'1.0-0' }}</p>
            <button class="w-full bg-amber-500 text-brown-900 py-5 rounded-2xl font-black hover:bg-amber-400 transition-all shadow-xl hover:shadow-amber-500/50 uppercase tracking-widest text-lg">Elegir esta Caja</button>
          </div>

          <!-- Box x6 -->
          <div (click)="store.startBuildingBox(6)" class="group bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/50 flex flex-col items-center relative overflow-hidden">
            <!-- Free Shipping Badge -->
            <div class="absolute top-0 right-0 bg-green-500 text-white text-xs font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-lg z-20">Envío Gratis</div>
            
            <div class="w-24 h-24 mb-6 bg-white/10 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner font-black text-amber-100">6🍪</div>
            <h3 class="text-3xl font-black text-white mb-2 tracking-tight">Caja Familia</h3>
            <p class="text-amber-200/60 mb-6 text-sm font-medium uppercase tracking-wide">Para que todos prueben</p>
            <p class="text-4xl font-black text-amber-400 mb-8">{{ store.boxPrices[6] | currency:'$':'symbol':'1.0-0' }}</p>
            <button class="w-full bg-transparent border-2 border-amber-500 text-amber-500 py-4 rounded-xl font-black hover:bg-amber-500 hover:text-brown-900 transition-all uppercase tracking-wider text-sm">Comenzar</button>
          </div>

        </div>
      </div>
    </section>

    <!-- FAQ Section (New) -->
    <section id="faq" class="py-24 px-4 bg-brown-900 text-white pb-32 border-t border-white/5">
       <div class="max-w-5xl mx-auto">
         <h2 class="text-5xl md:text-6xl text-center text-amber-100 mb-16 font-black tracking-tight">Preguntas Frecuentes</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           <div class="bg-white/5 rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors cursor-help">
             <h3 class="text-2xl font-bold text-amber-100 mb-3">¿Cuánto duran las galletas?</h3>
             <p class="text-amber-100/70 text-lg leading-relaxed">Nuestras galletas son 100% naturales, sin conservantes. Recomendamos consumirlas dentro de los primeros 5 días. Si las refrigeras, pueden durar hasta 10 días.</p>
           </div>

           <div class="bg-white/5 rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors cursor-help">
             <h3 class="text-2xl font-bold text-amber-100 mb-3">¿Cómo debo calentarlas?</h3>
             <p class="text-amber-100/70 text-lg leading-relaxed">Para vivir la experiencia completa, caliéntalas entre 15 y 20 segundos en el microondas. ¡El chocolate se derretirá y quedarán increíbles!</p>
           </div>

           <div class="bg-white/5 rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors cursor-help md:col-span-2">
             <h3 class="text-2xl font-bold text-amber-100 mb-3">¿Hacen envíos a todo el país?</h3>
             <p class="text-amber-100/70 text-lg leading-relaxed">Por el momento hacemos entregas locales para garantizar la frescura. Contáctanos por WhatsApp para consultar tu zona.</p>
           </div>

         </div>
       </div>
    </section>
  `,
  styles: [`
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(-3%); }
      50% { transform: translateY(3%); }
    }
    .animate-bounce-slow {
      animation: bounce-slow 4s infinite ease-in-out;
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    .group-hover\\:animate-wiggle:hover {
      animation: wiggle 0.3s ease-in-out infinite;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  store = inject(StoreService);
  selectedFlavor = signal<Flavor | null>(null);

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  cardQuantities = signal<Record<string, number>>({});

  getQty(id: string): number {
    return this.cardQuantities()[id] || 1;
  }

  incQty(id: string, event?: Event) {
    if (event) event.stopPropagation();
    this.cardQuantities.update(record => ({
      ...record,
      [id]: (record[id] || 1) + 1
    }));
  }

  decQty(id: string, event?: Event) {
    if (event) event.stopPropagation();
    this.cardQuantities.update(record => {
      const current = record[id] || 1;
      return {
        ...record,
        [id]: current > 1 ? current - 1 : 1
      };
    });
  }

  addFromCard(flavor: Flavor, event: Event) {
    event.stopPropagation();
    const qty = this.getQty(flavor.id);
    this.addFlavorToBoxAndClose(flavor, qty);
  }

  openModal(flavor: Flavor) {
    this.selectedFlavor.set(flavor);
  }

  closeModal() {
    this.selectedFlavor.set(null);
  }

  addFlavorToBoxAndClose(flavor: Flavor, qty: number = 1) {
    if (this.store.currentView() === 'BUILDER') {
      // Add 'qty' times
      for (let i = 0; i < qty; i++) {
        this.store.addFlavorToBox(flavor);
      }
      this.closeModal();
    } else {
      // Logic for individual purchase flow
      this.store.addIndividualProduct(flavor, qty);
      // Stay on page
      this.closeModal();
    }
  }
}
