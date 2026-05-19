import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-[#3A4A3A] text-[#F5EDE2]/80 py-12 relative z-50 border-t border-[#C4735B]/20">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div class="text-center md:text-left">
          <h4 class="text-2xl font-serif text-[#C4735B] font-bold mb-2">Biscoli</h4>
          <p class="text-sm opacity-60 mb-4">© {{ year }} Biscoli Cookies. <br>Hecho con pasión y sin culpas.</p>
          
          <div class="flex gap-4 text-xs font-bold text-[#C4735B]/60 justify-center md:justify-start">
            <button (click)="store.setView('TERMS')" class="hover:text-[#C4735B] transition-colors uppercase">Términos</button>
            <span>•</span>
            <button (click)="store.setView('PRIVACY')" class="hover:text-[#C4735B] transition-colors uppercase">Privacidad</button>
          </div>
        </div>

        <div class="flex flex-col items-center">
            <span class="text-xs uppercase tracking-widest text-[#C4735B]/80 mb-4 font-bold">Síguenos</span>
            <div class="flex items-center gap-6">
                <!-- Instagram -->
                <a href="https://www.instagram.com/biscoli.co/" target="_blank" class="p-3 bg-white/5 rounded-full hover:scale-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#dde8d5]">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>

                <!-- TikTok -->
                <a href="https://tiktok.com/@biscoli.co" target="_blank" class="p-3 bg-white/5 rounded-full hover:scale-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#dde8d5]">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                    </svg>
                </a>
            </div>
            
            <a href="https://www.instagram.com/biscoli.co/" target="_blank" class="mt-4 text-sm font-bold text-[#C4735B] hover:text-[#E8956C]">biscoli.co</a>
        </div>

      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  store = inject(StoreService);
  year = new Date().getFullYear();
}
