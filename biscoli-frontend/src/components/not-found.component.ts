
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-12 shadow-2xl border border-white max-w-lg w-full">
        <div class="text-8xl mb-6 animate-bounce">🍪</div>
        <h1 class="text-5xl font-black text-brown-900 mb-4 tracking-tight">404</h1>
        <h2 class="text-2xl font-bold text-gray-600 mb-8">¡Ups! Esta galleta se rompió.</h2>
        <p class="text-gray-500 mb-10 text-lg">La página que buscas no existe o ha sido movida.</p>
        
        <button (click)="store.setView('HOME')" class="w-full bg-brown-900 text-amber-50 py-4 rounded-xl font-black text-lg shadow-xl hover:bg-black transition-all transform hover:scale-105">
          Volver al Inicio
        </button>
      </div>
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
    store = inject(StoreService);
}
