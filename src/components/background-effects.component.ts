import { Component, ChangeDetectionStrategy, signal, computed, inject, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-effects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Main Container with More Visible Gradient Base -->
    <!-- Gradient goes from Warm Cream (Top Left) to Soft Blue (Bottom Right) -->
    <div class="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-br from-[#fff3e0] via-[#f5f5f5] to-[#e1f5fe]">
      
      <!-- Large Atmospheric Gradients - Increased Opacity -->
      <!-- Top Right: Brand Blue (Visible) -->
      <div class="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#72c3fa]/25 via-[#72c3fa]/10 to-transparent blur-[100px] animate-pulse-slow"></div>
      
      <!-- Bottom Left: Warm Cookie Tone (Visible) -->
      <div class="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#ffcc80]/20 via-[#ffcc80]/5 to-transparent blur-[120px]"></div>

      <!-- Mid Floating Orbs for depth and movement -->
      <div class="absolute top-[30%] left-[10%] w-[45vw] h-[45vw] bg-blue-200/20 rounded-full blur-[90px] animate-float-medium mix-blend-multiply"></div>
      <div class="absolute top-[15%] right-[25%] w-[35vw] h-[35vw] bg-amber-100/40 rounded-full blur-[80px] animate-float-slow mix-blend-multiply"></div>

      <!-- Decor Shapes - More Vibrant -->
      <div class="absolute top-32 left-10 w-32 h-32 bg-[#72c3fa]/20 rounded-full blur-2xl animate-float-slow"></div>
      <div class="absolute bottom-1/3 right-10 w-48 h-48 bg-[#ffe082]/20 rounded-full blur-3xl animate-float-medium"></div>

      <!-- NEW: Parallax Cookies (Gray & Visible) -->
      @for (cookie of floatingCookies; track $index) {
        <div 
          class="absolute text-gray-500 transition-transform duration-75 ease-linear will-change-transform"
          [style.left.%]="cookie.x"
          [style.top.%]="cookie.y"
          [style.width.px]="cookie.size"
          [style.height.px]="cookie.size"
          [style.opacity]="cookie.opacity"
          [style.transform]="getTransform(cookie)"
        >
          <!-- Simple Vector Cookie -->
          <svg viewBox="0 0 100 100" fill="currentColor" class="w-full h-full drop-shadow-sm">
            <!-- Body with slight fill -->
            <path d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5 Z" 
              stroke="currentColor" 
              stroke-width="3" 
              fill="currentColor" 
              fill-opacity="0.1"
            />
            <!-- Chips (Darker opacity) -->
            <circle cx="30" cy="40" r="6" fill="currentColor" opacity="0.6"/>
            <circle cx="70" cy="30" r="5" fill="currentColor" opacity="0.6"/>
            <circle cx="50" cy="60" r="7" fill="currentColor" opacity="0.6"/>
            <circle cx="25" cy="70" r="4" fill="currentColor" opacity="0.6"/>
            <circle cx="75" cy="75" r="5" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
      }

      <!-- Existing Particles -->
      @for (item of particles; track $index) {
        <div 
          class="absolute rounded-full bg-[#72c3fa]/50 animate-drift"
          [style.left.%]="item.x"
          [style.top.%]="item.y"
          [style.width.px]="item.size"
          [style.height.px]="item.size"
          [style.animation-duration.s]="item.duration"
          [style.animation-delay.s]="item.delay">
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    .animate-float-slow { animation: float 12s ease-in-out infinite; }
    .animate-float-medium { animation: float 8s ease-in-out infinite; }
    
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }

    @keyframes drift {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      20% { opacity: 0.6; }
      80% { opacity: 0.6; }
      100% { transform: translateY(-100px) translateX(30px); opacity: 0; }
    }
    .animate-drift {
      animation-name: drift;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundEffectsComponent implements OnDestroy {
  scrollY = signal(0);
  private ngZone = inject(NgZone);
  private scrollListener: () => void;

  // Parallax Cookies Data
  floatingCookies = Array.from({ length: 15 }, (_, i) => ({
    x: Math.random() * 100,      // Horizontal position %
    y: Math.random() * 100,      // Vertical position %
    size: Math.random() * 80 + 40, // Size between 40px and 120px
    opacity: Math.random() * 0.2 + 0.1, // Visible but subtle
    speed: (Math.random() - 0.5) * 0.4, // Parallax speed factor
    rotation: Math.random() * 360 // Initial rotation
  }));

  particles = Array.from({ length: 25 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 3,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10
  }));

  constructor() {
    if (typeof window !== 'undefined') {
      // Create the listener function
      this.scrollListener = () => {
        const y = window.scrollY;
        // Only update signal (which triggers CD) if value significantly changes to avoid thrashing?
        // Actually, accessing signal inside template is fine, but the event itself firing constantly in zone is bad.
        // Since we need to update the view based on scroll, we DO need to re-enter zone or use a signal that updates view.
        // However, angular signals track dependencies.
        // Best practice: Run 'addEventListener' outside angular.
        // Then inside the callback, if we update a signal, angular will detect the change specifically for that signal's consumers.
        // BUT standard OnPush components might not re-render unless we markForCheck or update a signal they consume.
        // Here 'scrollY' is a signal used in template. Updating it will trigger CD for this component.
        // We wrap the *update* in run? No, signals are zone-aware? 
        // Actually signals don't require Zone.js for updates, but Angular's change detection usually relies on Zone to know *when* to check.
        // Let's run the listener entirely outside, and manually update the signal.
        this.ngZone.run(() => {
          this.scrollY.set(y);
        });
      };

      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.scrollListener, { passive: true });
      });
    } else {
      this.scrollListener = () => { };
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  getTransform(cookie: any): string {
    // Calculate vertical movement based on scrollY and the cookie's unique speed factor
    const yOffset = this.scrollY() * cookie.speed * 2;
    // Add a slow rotation based on scroll as well
    const rotation = cookie.rotation + (this.scrollY() * 0.05);
    return `translateY(${yOffset}px) rotate(${rotation}deg)`;
  }
}
