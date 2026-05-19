import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full relative z-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="bg-[#F5EDE2] py-4 overflow-hidden relative rounded-2xl mask-gradient border border-[#E8D5C0]">
          
          <!-- Wrapper that moves -->
          <div class="flex animate-scroll w-max hover:pause">
            
            <!-- Strip 1 (Original) -->
            <div class="flex items-center gap-12 pr-12">
               @for (rep of [1, 2, 3, 4]; track $index) {
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#5C2E35]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Sin Gluten</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#C4735B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Sin Azúcar</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#8FA67A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Hecho a Mano</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#C4735B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Horneadas hoy</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <span class="text-2xl">🍪</span>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Ingredientes Reales</span>
                  </div>
               }
            </div>

            <!-- Strip 2 (Duplicate for seamless loop) -->
            <div class="flex items-center gap-12 pr-12">
               @for (rep of [1, 2, 3, 4]; track $index) {
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#5C2E35]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Sin Gluten</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#C4735B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Sin Azúcar</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#8FA67A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Hecho a Mano</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#C4735B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Horneadas hoy</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <span class="text-2xl">🍪</span>
                    <span class="text-[#5C2E35] font-black uppercase tracking-widest text-base whitespace-nowrap">Ingredientes Reales</span>
                  </div>
               }
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 60s linear infinite;
    }
    .animate-scroll:hover {
      animation-play-state: paused;
    }
    .mask-gradient {
      mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarqueeComponent { }
