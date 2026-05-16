
import { Component, ChangeDetectionStrategy, inject, signal, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
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
    @if (selectedFlavor()) {
      <app-flavor-modal [flavor]="selectedFlavor()!" (close)="closeModal()"></app-flavor-modal>
    }

    <!-- Video Header Section -->
    <section id="inicio" class="video-header-section">
      <div class="video-container">
        <!-- Desktop Video -->
        <video
          #headerVideo
          class="header-video desktop-video"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          [muted]="true"
        >
          <source src="assets/Video header wide.mp4" type="video/mp4">
        </video>
        <!-- Mobile Video -->
        <video
          #headerVideo
          class="header-video mobile-video"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          [muted]="true"
        >
          <source src="assets/Video header vertical.mp4" type="video/mp4">
        </video>

        <!-- Gradient overlay at bottom of video -->
        <div class="video-bottom-gradient"></div>

        <!-- Pedir Ahora button INSIDE the video frame -->
        <div class="video-cta-wrapper">
          <button (click)="scrollToSection('menu')" class="video-cta-button">
            <span>Pedir Ahora</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Logo & tagline OUTSIDE video, below the video container -->
    <section class="post-video-hero">
      <div class="relative w-52 h-24 md:w-72 md:h-32 mb-4 animate-bounce-slow">
        <app-logo width="100%" height="100%"></app-logo>
      </div>
      <p class="text-xl md:text-2xl text-[#3A4A3A] font-bold max-w-3xl mb-4 leading-relaxed tracking-tight text-center px-6">
        El placer de lo dulce, <br class="md:hidden"> sin la culpa. <br>
        <span class="text-[#8FA67A] font-black drop-shadow-sm">Sin Gluten. Sin Azúcar. Veganas.</span>
      </p>
      <div class="flex items-center gap-2 mb-6 bg-white/70 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm border border-[#8FA67A]/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#8FA67A]" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
        <span class="text-sm font-bold text-[#4A5D4A] tracking-wide">Envíos solo en Cali</span>
      </div>
    </section>

    <app-marquee></app-marquee>

    <section id="ingredientes" class="mt-12 md:mt-24 py-16 px-4 bg-[#8FA67A]/5 backdrop-blur-sm rounded-[2.5rem] mx-4 md:mx-auto max-w-6xl shadow-sm border border-[#8FA67A]/10 mb-16 scroll-mt-24">
      <h2 class="text-5xl md:text-6xl text-center text-[#3A4A3A] mb-16 font-black tracking-tight">Ingredientes Reales</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-[#e0eadc]">
          <div class="w-20 h-20 bg-[#f0f5ee] text-[#8FA67A] rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">🌾</div>
          <h3 class="text-2xl font-black text-[#3A4A3A] mb-3">Sin Gluten</h3>
          <p class="text-gray-600 text-lg font-medium leading-relaxed">Aptas para celíacos. Utilizamos harinas de almendra y avena sin gluten de primera calidad.</p>
        </div>
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-[#e0eadc]">
          <div class="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">🌱</div>
          <h3 class="text-2xl font-black text-[#3A4A3A] mb-3">100% Veganas</h3>
          <p class="text-gray-600 text-lg font-medium leading-relaxed">Sin huevos ni lácteos. Pura magia vegetal con el sabor de siempre.</p>
        </div>
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-[#e0eadc]">
          <div class="w-20 h-20 bg-[#e0eadc] text-[#4A5D4A] rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">🍬</div>
          <h3 class="text-2xl font-black text-[#3A4A3A] mb-3">Sin Azúcar</h3>
          <p class="text-gray-600 text-lg font-medium leading-relaxed">Endulzadas con alulosa. Disfruta sin picos de glucosa.</p>
        </div>
      </div>
      <div class="mt-12 text-center">
        <button (click)="store.setView('INGREDIENTS')" class="inline-flex items-center gap-2 bg-white text-[#8FA67A] border-2 border-[#8FA67A] px-8 py-3 rounded-full font-black text-lg hover:bg-[#8FA67A] hover:text-white transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-1">
          <span>Ver Información Nutricional</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </button>
      </div>
    </section>

    <section id="menu" class="py-16 px-4 max-w-7xl mx-auto mb-16 scroll-mt-24">
      <h2 class="text-5xl md:text-6xl text-center text-[#3A4A3A] mb-4 font-black tracking-tighter">Nuestros Sabores</h2>
      <p class="text-center text-gray-500 mb-16 text-xl font-medium max-w-2xl mx-auto">Elige tus favoritos al armar tu caja. Diseñados para satisfacer sin comprometer tu salud.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
        @for (flavor of store.flavors(); track flavor.id) {
          <div (click)="openModal(flavor)" class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full cursor-pointer ring-1 ring-black/5 hover:ring-black/10 relative" [class.grayscale]="flavor.available === false" [class.opacity-90]="flavor.available === false">
            @if (flavor.available === false) {
              <div class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div class="bg-stone-900/90 text-white px-6 py-3 rounded-xl font-black text-xl uppercase tracking-widest shadow-2xl border-2 border-white/20 transform -rotate-12 backdrop-blur-sm">Agotado</div>
              </div>
            }
            <div class="aspect-square w-full flex items-center justify-center relative overflow-hidden bg-stone-50">
              @if (flavor.image) {
                <img [src]="flavor.image" [alt]="flavor.name" class="w-full h-full object-contain p-4 transition-all duration-700 group-hover:scale-110 absolute inset-0 z-10" [class.group-hover:opacity-0]="flavor.hoverImage">
                @if (flavor.hoverImage) {
                  <img [src]="flavor.hoverImage" [alt]="flavor.name" class="w-full h-full object-contain p-4 transition-all duration-700 group-hover:scale-110 absolute inset-0 z-20 opacity-0 group-hover:opacity-100">
                }
              } @else {
                <div class="w-28 h-28 rounded-full bg-[#D7CCC8] shadow-inner border-4 border-black/5 relative group-hover:scale-110 transition-transform">
                  <div class="absolute top-4 left-4 w-3 h-3 rounded-full bg-black/20"></div>
                  <div class="absolute bottom-6 right-5 w-4 h-4 rounded-full bg-black/20"></div>
                  <div class="absolute top-8 right-6 w-2 h-2 rounded-full bg-black/20"></div>
                </div>
              }
            </div>
            <div class="p-5 md:p-6 flex-1 flex flex-col">
              <h3 class="font-black text-xl md:text-2xl text-[#3A4A3A] leading-tight mb-2 tracking-tight">{{flavor.name}}</h3>
              <p class="text-base text-gray-500 leading-relaxed line-clamp-3 font-medium mb-4">{{flavor.description}}</p>
              <div class="mt-auto pt-4 border-t border-gray-100">
                <button class="w-full inline-flex items-center justify-center gap-2 text-[#8FA67A] border-2 border-[#8FA67A] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#8FA67A] hover:text-white transition-all">
                  <span>Ver más</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <section id="cajas" class="py-24 px-4 bg-[#3A4A3A] relative overflow-hidden scroll-mt-24">
      <div class="absolute top-0 w-full h-full left-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#8FA67A]/40 via-[#3A4A3A] to-[#3A4A3A]"></div>
      <div class="max-w-7xl mx-auto text-center relative z-10">
        <span class="text-[#A3B88C] font-extrabold tracking-[0.2em] text-sm uppercase mb-3 block">La Experiencia Biscoli</span>
        <h2 class="text-5xl md:text-7xl mb-8 text-white font-black tracking-tight">Arma tu Caja</h2>
        <p class="mb-20 text-[#dde8d5]/80 text-xl font-medium max-w-2xl mx-auto">Elige el tamaño perfecto para ti o para regalar. Personaliza cada espacio con tus sabores favoritos.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <div (click)="store.startBuildingBox(2)" class="group bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/50 flex flex-col items-center">
            <div class="w-24 h-24 mb-6 bg-white/10 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner font-black text-[#dde8d5]">2🍪</div>
            <h3 class="text-3xl font-black text-white mb-2 tracking-tight">Caja Personal</h3>
            <p class="text-[#c5d6be]/60 mb-6 text-sm font-medium uppercase tracking-wide">Perfecta para un antojo</p>
            <span class="text-xs text-[#A3B88C]/80 font-bold uppercase tracking-wider mb-1">Desde</span>
            <p class="text-4xl font-black text-[#A3B88C] mb-8">{{ store.boxPrices[2] | currency:'$':'symbol':'1.0-0' }}</p>
            <button class="w-full bg-transparent border-2 border-[#8FA67A] text-[#8FA67A] py-4 rounded-xl font-black hover:bg-[#8FA67A] hover:text-[#3A4A3A] transition-all uppercase tracking-wider text-sm">Comenzar</button>
          </div>
          <div (click)="store.startBuildingBox(4)" class="group bg-gradient-to-br from-[#8FA67A]/20 to-[#3A4A3A]/80 backdrop-blur-md border border-[#8FA67A]/40 rounded-[2.5rem] p-12 relative transform md:scale-110 shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-[#8FA67A]/20 flex flex-col items-center z-10">
            <div class="absolute top-0 right-0 bg-[#8FA67A] text-[#3A4A3A] text-xs font-black px-5 py-2 rounded-bl-2xl rounded-tr-[2.3rem] uppercase tracking-widest">Más Popular</div>
            <div class="w-32 h-32 mb-8 bg-[#8FA67A] rounded-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-lg text-[#3A4A3A] font-black">4🍪</div>
            <h3 class="text-4xl font-black text-white mb-2 tracking-tight">Caja Compartir</h3>
            <p class="text-[#dde8d5]/90 mb-8 font-bold text-lg">La dosis ideal de felicidad</p>
            <span class="text-xs text-[#dde8d5]/80 font-bold uppercase tracking-wider mb-1">Desde</span>
            <p class="text-5xl font-black text-white mb-10 drop-shadow-lg">{{ store.boxPrices[4] | currency:'$':'symbol':'1.0-0' }}</p>
            <button class="w-full bg-[#8FA67A] text-[#3A4A3A] py-5 rounded-2xl font-black hover:bg-[#A3B88C] transition-all shadow-xl hover:shadow-[#8FA67A]/50 uppercase tracking-widest text-lg">Elegir esta Caja</button>
          </div>
          <div (click)="store.startBuildingBox(6)" class="group bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/50 flex flex-col items-center relative overflow-hidden">
            <div class="absolute top-0 right-0 bg-green-500 text-white text-xs font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-lg z-20">Envío Gratis</div>
            <div class="w-24 h-24 mb-6 bg-white/10 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner font-black text-[#dde8d5]">6🍪</div>
            <h3 class="text-3xl font-black text-white mb-2 tracking-tight">Caja Familia</h3>
            <p class="text-[#c5d6be]/60 mb-6 text-sm font-medium uppercase tracking-wide">Para que todos prueben</p>
            <span class="text-xs text-[#A3B88C]/80 font-bold uppercase tracking-wider mb-1">Desde</span>
            <p class="text-4xl font-black text-[#A3B88C] mb-8">{{ store.boxPrices[6] | currency:'$':'symbol':'1.0-0' }}</p>
            <button class="w-full bg-transparent border-2 border-[#8FA67A] text-[#8FA67A] py-4 rounded-xl font-black hover:bg-[#8FA67A] hover:text-[#3A4A3A] transition-all uppercase tracking-wider text-sm">Comenzar</button>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="py-24 px-4 bg-[#dde8d5] text-[#3A4A3A] pb-32 border-t border-[#3A4A3A]/5">
       <div class="max-w-5xl mx-auto">
         <h2 class="text-5xl md:text-6xl text-center text-[#3A4A3A] mb-16 font-black tracking-tight">Preguntas Frecuentes</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="bg-[#3A4A3A]/5 rounded-3xl p-8 border border-[#3A4A3A]/10 hover:bg-[#3A4A3A]/10 transition-colors cursor-help">
             <h3 class="text-2xl font-bold text-[#3A4A3A] mb-3">¿Cuánto duran las galletas?</h3>
             <p class="text-[#3A4A3A]/80 text-lg leading-relaxed">Nuestras galletas son 100% naturales, sin conservantes. Recomendamos consumirlas dentro de los primeros 5 días. Si las refrigeras, pueden durar hasta 10 días.</p>
           </div>
           <div class="bg-[#3A4A3A]/5 rounded-3xl p-8 border border-[#3A4A3A]/10 hover:bg-[#3A4A3A]/10 transition-colors cursor-help">
             <h3 class="text-2xl font-bold text-[#3A4A3A] mb-3">¿Cómo debo calentarlas?</h3>
             <p class="text-[#3A4A3A]/80 text-lg leading-relaxed">Para vivir la experiencia completa, caliéntalas entre 15 y 20 segundos en el microondas. ¡El chocolate se derretirá y quedarán increíbles!</p>
           </div>
           <div class="bg-[#3A4A3A]/5 rounded-3xl p-8 border border-[#3A4A3A]/10 hover:bg-[#3A4A3A]/10 transition-colors cursor-help md:col-span-2">
             <h3 class="text-2xl font-bold text-[#3A4A3A] mb-3">¿Hacen envíos a todo el país?</h3>
             <p class="text-[#3A4A3A]/80 text-lg leading-relaxed">Por el momento solo realizamos envíos dentro de la ciudad de <strong>Cali</strong> para garantizar la frescura de nuestras galletas. ¡Esperamos expandirnos pronto a más ciudades!</p>
           </div>
         </div>
       </div>
    </section>
  `,
  styles: [`
    /* === Video Header === */
    .video-header-section {
      width: 100%;
      margin-top: -80px; /* Pull up behind the toolbar */
    }
    .video-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      max-height: 90vh;
    }
    .header-video {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
    /* Desktop: show wide, hide vertical */
    .desktop-video {
      display: block;
    }
    .mobile-video {
      display: none;
    }
    @media (max-width: 768px) {
      .desktop-video {
        display: none;
      }
      .mobile-video {
        display: block;
      }
    }

    /* Gradient overlay at bottom of video */

    /* CTA button inside video */
    .video-cta-wrapper {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }
    @media (max-width: 768px) {
      .video-cta-wrapper {
        bottom: 1.5rem;
      }
    }
    .video-cta-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #4A5D4A;
      color: white;
      padding: 1rem 2.5rem;
      border-radius: 9999px;
      font-size: 1.25rem;
      font-weight: 900;
      box-shadow: 0 0 0 4px rgba(143, 166, 122, 0.3), 0 20px 60px rgba(0,0,0,0.4);
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.3s ease;
      white-space: nowrap;
    }
    .video-cta-button:hover {
      background-color: #3A4A3A;
      transform: scale(1.05);
    }
    @media (max-width: 768px) {
      .video-cta-button {
        padding: 0.875rem 2rem;
        font-size: 1.1rem;
      }
    }

    /* Post-video hero (logo + tagline) */
    .post-video-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2.5rem 1.5rem 1rem;
    }

    /* === Animations === */
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
export class HomeComponent implements AfterViewInit {
  store = inject(StoreService);
  selectedFlavor = signal<Flavor | null>(null);

  @ViewChildren('headerVideo') headerVideos!: QueryList<ElementRef<HTMLVideoElement>>;

  ngAfterViewInit() {
    this.forcePlayVideos();
    // Also retry on user interaction in case autoplay was blocked
    if (typeof document !== 'undefined') {
      const handler = () => {
        this.forcePlayVideos();
        document.removeEventListener('click', handler);
        document.removeEventListener('touchstart', handler);
      };
      document.addEventListener('click', handler, { once: true });
      document.addEventListener('touchstart', handler, { once: true });
    }
  }

  private forcePlayVideos() {
    this.headerVideos?.forEach(ref => {
      const video = ref.nativeElement;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked, will retry on user interaction
        });
      }
    });
  }

  scrollToSection(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  openModal(flavor: Flavor) {
    this.selectedFlavor.set(flavor);
    this.store.modalOpen.set(true);
  }

  closeModal() {
    this.selectedFlavor.set(null);
    this.store.modalOpen.set(false);
  }
}
