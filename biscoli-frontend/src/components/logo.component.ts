
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_IMAGES } from '../assets/images';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [style.width]="width" [style.height]="height">
      <img 
        [src]="logoUrl" 
        alt="Biscoli Logo" 
        class="w-full h-full object-contain drop-shadow-md select-none"
      >
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() variant: 'default' | 'no-slogan' = 'default';

  get logoUrl() {
    return this.variant === 'no-slogan' ? APP_IMAGES.logoSinSlogan : APP_IMAGES.logo;
  }
}
