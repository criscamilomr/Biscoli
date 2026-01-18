import { Component, ChangeDetectionStrategy, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { StoreService } from './services/store.service';
import { BackgroundEffectsComponent } from './components/background-effects.component';
import { HomeComponent } from './components/home.component';
import { BoxBuilderComponent } from './components/box-builder.component';
import { CheckoutComponent } from './components/checkout.component';
import { LogoComponent } from './components/logo.component';
import { IngredientsViewComponent } from './components/ingredients-view.component';
import { FooterComponent } from './components/footer.component';
import { TermsComponent } from './components/terms.component';
import { PrivacyComponent } from './components/privacy.component';
import { NotFoundComponent } from './components/not-found.component';
import { AdminLoginComponent } from './components/admin/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BackgroundEffectsComponent,
    HomeComponent,
    BoxBuilderComponent,
    CheckoutComponent,
    LogoComponent,
    IngredientsViewComponent,
    FooterComponent,
    TermsComponent,
    PrivacyComponent,
    NotFoundComponent,
    AdminLoginComponent,
    AdminDashboardComponent
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.8s cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <app-background-effects />
    
    <!-- Functional Topbar -->
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.bg-white_95]="scrolled() || mobileMenuOpen()"
      [class.backdrop-blur-md]="scrolled() || mobileMenuOpen()"
      [class.shadow-md]="scrolled() || mobileMenuOpen()"
      [class.py-2]="scrolled()"
      [class.py-8]="!scrolled()"
      [class.opacity-0]="store.modalOpen()"
      [class.pointer-events-none]="store.modalOpen()">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          
          <!-- Logo -->
          <div (click)="navigate('inicio')" class="cursor-pointer transition-transform hover:scale-105 flex items-center relative z-50">
            <app-logo width="120px" height="40px"></app-logo>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <button (click)="navigate('inicio')" class="text-[#3E2723] hover:text-[#72c3fa] font-bold tracking-wide transition-colors">INICIO</button>
            <button (click)="navigate('cajas')" class="text-[#3E2723] hover:text-[#72c3fa] font-bold tracking-wide transition-colors">ARMA TU CAJA</button>
            <button (click)="navigate('ingredientes')" class="text-[#3E2723] hover:text-[#72c3fa] font-bold tracking-wide transition-colors">INGREDIENTES</button>
            <button (click)="navigate('faq')" class="text-[#3E2723] hover:text-[#72c3fa] font-bold tracking-wide transition-colors">FAQ</button>
          </nav>
          
          <!-- Actions (Cart & Mobile Menu) -->
          <div class="flex items-center gap-4 relative z-50">
            <!-- Cart Button -->
            <button (click)="store.setView('CHECKOUT')" 
              [class.animate-bump]="cartBump()"
              class="relative group bg-[#3E2723] text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-[#5D4037] flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
              <span>🛒</span>
              @if (store.cartCount() > 0) {
                 <span class="bg-red-500 text-white text-[10px] absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{{store.cartCount()}}</span>
              }
              <span class="hidden md:inline text-sm">{{store.cartTotal() | currency:'$':'symbol':'1.0-0'}}</span>
            </button>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMenu()" class="md:hidden text-[#3E2723] p-2 focus:outline-none transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                @if (mobileMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div 
        class="absolute top-full left-0 w-full bg-white_95 backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out overflow-hidden md:hidden flex flex-col items-center gap-2 rounded-b-[2.5rem] border-t border-gray-100"
        [class.max-h-0]="!mobileMenuOpen()"
        [class.max-h-[500px]]="mobileMenuOpen()"
        [class.opacity-0]="!mobileMenuOpen()"
        [class.opacity-100]="mobileMenuOpen()"
        [class.py-0]="!mobileMenuOpen()"
        [class.py-8]="mobileMenuOpen()"
      >
        <button (click)="navigate('inicio')" class="w-full py-3 text-lg text-[#3E2723] font-black tracking-widest hover:bg-amber-500/10 transition-colors uppercase">Inicio</button>
        <button (click)="navigate('cajas')" class="w-full py-3 text-lg text-[#3E2723] font-black tracking-widest hover:bg-amber-500/10 transition-colors uppercase">Arma tu Caja</button>
        <button (click)="navigate('ingredientes')" class="w-full py-3 text-lg text-[#3E2723] font-black tracking-widest hover:bg-amber-500/10 transition-colors uppercase">Ingredientes</button>
        <button (click)="navigate('faq')" class="w-full py-3 text-lg text-[#3E2723] font-black tracking-widest hover:bg-amber-500/10 transition-colors uppercase">FAQ</button>
      </div>
    </header>

    <main class="relative z-10 min-h-screen">
      @switch (store.currentView()) {
        @case ('HOME') { <div @fadeIn class="w-full"><app-home /></div> }
        @case ('BUILDER') { <div @fadeIn class="w-full"><app-box-builder /></div> }
        @case ('INGREDIENTS') { <div @fadeIn class="w-full"><app-ingredients-view /></div> }
        @case ('CHECKOUT') { <div @fadeIn class="w-full"><app-checkout /></div> }
        @case ('SUCCESS') { 
          <div @fadeIn class="h-screen flex items-center justify-center w-full">
            <h1 class="text-4xl text-[#3E2723]">Success!</h1>
          </div>
        }
        @case ('TERMS') { <div @fadeIn class="w-full"><app-terms /></div> }
        @case ('PRIVACY') { <div @fadeIn class="w-full"><app-privacy /></div> }
        @case ('ADMIN_LOGIN') { <div @fadeIn class="w-full"><app-admin-login /></div> }
        @case ('ADMIN_DASHBOARD') { <div @fadeIn class="w-full"><app-admin-dashboard /></div> }
        @case ('NOT_FOUND') { <div @fadeIn class="w-full"><app-not-found /></div> }
      }
    </main>
    
    <!-- Footer with Admin Shortcut -->
    <div class="relative z-50">
      <app-footer />
      <button (click)="store.setView('ADMIN_LOGIN')" class="absolute bottom-4 right-4 p-2 text-white/30 hover:text-white hover:scale-110 transition-all cursor-pointer z-50" title="Admin Access">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
           <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
         </svg>
      </button>
    </div>
  `,
  styles: [`
    .bg-white_95 { background-color: rgba(255, 255, 255, 0.95); }
    @keyframes bump {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    .animate-bump {
      animation: bump 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  store = inject(StoreService);
  scrolled = signal(false);
  mobileMenuOpen = signal(false);
  cartBump = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled.set(window.scrollY > 20);
      });
    }

    // Effect to trigger bump animation on cart change
    effect(() => {
      const count = this.store.cartCount(); // trigger dependency
      untracked(() => {
        if (count > 0) {
          this.cartBump.set(true);
          setTimeout(() => this.cartBump.set(false), 300);
        }
      });
    });

    // Scroll to top on view change
    effect(() => {
      const view = this.store.currentView();
      untracked(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      });
    });
  }

  toggleMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  navigate(sectionId: string) {
    this.mobileMenuOpen.set(false);

    // If it's the ingredients page, just switch view
    if (sectionId === 'ingredientes') {
      this.store.setView('INGREDIENTS');
      return;
    }

    // If not in home, go to home first
    if (this.store.currentView() !== 'HOME') {
      this.store.setView('HOME');
      // Allow view to render then scroll
      setTimeout(() => {
        this.scrollToElement(sectionId);
      }, 100);
    } else {
      this.scrollToElement(sectionId);
    }
  }

  private scrollToElement(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
