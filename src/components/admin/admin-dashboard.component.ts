import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen pt-24 pb-64 px-4 max-w-6xl mx-auto">
      
      <div class="flex justify-between items-center mb-10">
        <div>
           <h2 class="text-4xl font-black text-brown-900 tracking-tight mb-2">Panel Administrativo</h2>
           <p class="text-gray-500 font-bold">Gestiona tu stock en tiempo real</p>
        </div>
        
        <div class="flex items-center gap-4">
           <!-- SEED BUTTON -->
           <button (click)="seed()" class="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg font-bold text-gray-600 transition-colors">
             ⚠️ Cargar Datos Iniciales
           </button>

           <button (click)="logout()" class="bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
             </svg>
             Salir
           </button>
        </div>
      </div>

      <!-- STORE STATUS CARD -->
      <div class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden mb-8 p-8">
        <div class="flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div>
            <h3 class="text-2xl font-black text-brown-900 mb-2">Estado de la Tienda</h3>
            <p class="text-gray-500">Controla si se pueden recibir pedidos.</p>
          </div>

          <div class="flex items-center gap-4">
             <span class="text-lg font-bold" [class.text-green-600]="store.storeConfig().isOpen" [class.text-red-500]="!store.storeConfig().isOpen">
                {{ store.storeConfig().isOpen ? 'ABIERTA' : 'CERRADA' }}
             </span>

             <button 
                (click)="toggleStore(!store.storeConfig().isOpen)"
                class="relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brown-900 focus:ring-offset-2"
                [class.bg-green-500]="store.storeConfig().isOpen"
                [class.bg-gray-300]="!store.storeConfig().isOpen"
              >
                <span
                  class="inline-block h-8 w-8 transform rounded-full bg-white transition shadow-sm"
                  [class.translate-x-11]="store.storeConfig().isOpen"
                  [class.translate-x-1]="!store.storeConfig().isOpen"
                ></span>
              </button>
          </div>
        </div>

        @if (!store.storeConfig().isOpen) {
          <div class="mt-6 bg-red-50 p-6 rounded-2xl border border-red-100">
            <label class="block text-sm font-bold text-red-800 mb-2">Mensaje de "Cerrado" (visible a clientes)</label>
            <div class="flex gap-4">
              <input 
                type="text" 
                [(ngModel)]="closedMessage" 
                class="flex-1 bg-white border border-red-200 rounded-lg p-3 text-red-900 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Ej: Volvemos mañana a las 8am 🍪">
              <button (click)="updateClosedMessage()" class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition">
                Guardar Mensaje
              </button>
            </div>
            <p class="text-xs text-red-400 mt-2 font-bold">⚠️ Recuerda guardar el mensaje después de editarlo.</p>
          </div>
        }
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <p class="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">Total Sabores</p>
           <p class="text-4xl font-black text-brown-900">{{ store.flavors().length }}</p>
        </div>
      </div>
      
      <!-- Inventory Grid -->
      <div class="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-100">
          <h3 class="text-2xl font-black text-brown-900">Inventario de Sabores</h3>
        </div>

        <div class="divide-y divide-gray-100">
           @for (flavor of store.flavors(); track flavor.id) {
             <div class="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-colors group gap-4">
               
               <div class="flex items-center gap-6 flex-1">
                 <!-- Image Preview -->
                 <div class="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0">
                    @if (flavor.image) {
                      <img [src]="flavor.image" class="w-full h-full object-cover">
                    } @else {
                      <div [class]="'w-full h-full ' + flavor.color"></div>
                    }
                    @if (flavor.available === false) {
                      <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span class="text-[10px] items-center text-white font-black uppercase">Agotado</span>
                      </div>
                    }
                 </div>

                 <div>
                    <h4 class="font-bold text-lg text-brown-900 mb-1">{{ flavor.name }}</h4>
                    <p class="text-xs text-gray-500 font-mono mb-2">{{ flavor.id }}</p>
                    
                    <!-- Price Editor -->
                    <div class="flex items-center gap-2">
                       <span class="text-xs font-bold text-gray-500">Precio:</span>
                       <div class="relative">
                          <span class="absolute left-2 top-1.5 text-xs text-gray-400">$</span>
                          <input 
                            #priceInput
                            type="number" 
                            [value]="flavor.price || 15900" 
                            class="w-24 pl-5 py-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            (keyup.enter)="updatePrice(flavor.id, priceInput.value)"
                          >
                       </div>
                       <button 
                         (click)="updatePrice(flavor.id, priceInput.value)"
                         class="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded hover:bg-amber-200 transition font-bold"
                        >
                         Guardar
                       </button>
                    </div>

                 </div>
               </div>
               
               <!-- Toggle Switch -->
               <div class="flex items-center gap-4 self-end md:self-center">
                  <span class="text-sm font-bold" [class.text-green-600]="flavor.available !== false" [class.text-red-500]="flavor.available === false">
                    {{ flavor.available !== false ? 'Disponible' : 'Agotado' }}
                  </span>

                  <button 
                    (click)="toggle(flavor.id, flavor.available !== false)"
                    class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brown-900 focus:ring-offset-2"
                    [class.bg-green-500]="flavor.available !== false"
                    [class.bg-gray-300]="flavor.available === false"
                  >
                    <span
                      class="inline-block h-6 w-6 transform rounded-full bg-white transition shadow-sm"
                      [class.translate-x-7]="flavor.available !== false"
                      [class.translate-x-1]="flavor.available === false"
                    ></span>
                  </button>
               </div>

             </div>
           }
        </div>
      </div>
      
      <!-- DEBUG CONSOLE (Visual Feedback) -->
      <div class="fixed bottom-0 left-0 right-0 bg-black/95 text-green-400 font-mono text-xs p-4 h-48 overflow-y-auto z-50 border-t-4 border-green-600 shadow-2xl">
          <div class="flex justify-between items-center mb-2 border-b border-green-800 pb-2 sticky top-0 bg-black/95">
              <span class="font-bold text-sm">🖥️ CONSOLA DE DEPURACIÓN (DEBUG)</span>
              <div class="flex gap-2">
                 <button (click)="clearLogs()" class="text-white hover:text-red-400 bg-white/10 px-3 py-1 rounded text-[10px] uppercase font-bold">Limpiar</button>
                 <button (click)="closeConsole()" class="text-gray-500 hover:text-white px-2">X</button>
              </div>
          </div>
          <div class="flex flex-col gap-1 font-mono">
              @if (debugLogs.length === 0) {
                  <span class="text-gray-600 italic">Esperando acciones...</span>
              }
              @for (log of debugLogs; track $index) {
                  <div class="break-words border-l-2 border-green-900 pl-2 hover:bg-white/5">{{ log }}</div>
              }
          </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent {
  store = inject(StoreService);
  private auth = inject(Auth);

  // Local state for closed message editing
  closedMessage = '';

  constructor() {
    // Sync local message with store config when it changes
    effect(() => {
      this.closedMessage = this.store.storeConfig().closedMessage;
    });
  }

  // State for logs
  debugLogs: string[] = ['Listo. Esperando comandos...'];
  consoleVisible = true;

  private log(msg: string) {
    const time = new Date().toLocaleTimeString();
    this.debugLogs.push(`[${time}] ${msg}`);
    console.log(`[${time}] ${msg}`);
  }

  clearLogs() {
    this.debugLogs = [];
  }

  closeConsole() {
    this.consoleVisible = false;
  }

  async toggleStore(isOpen: boolean) {
    try {
      await this.store.updateStoreStatus(isOpen, this.closedMessage || 'Estamos cerrados por el momento.');
      this.log(`Tienda ${isOpen ? 'ABIERTA' : 'CERRADA'}`);
    } catch (err: any) {
      this.log('Error cambiando estado tienda: ' + err.message);
    }
  }

  async updateClosedMessage() {
    try {
      await this.store.updateStoreStatus(false, this.closedMessage);
      this.log('Mensaje de cierre actualizado: ' + this.closedMessage);
    } catch (err: any) {
      this.log('Error guardando mensaje: ' + err.message);
    }
  }

  async toggle(id: string, currentStatus: boolean) {
    try {
      await this.store.toggleStock(id, currentStatus);
    } catch (err: any) {
      this.log('ERROR al cambiar stock: ' + err.message);
    }
  }

  async updatePrice(id: string, priceStr: string) {
    const price = parseInt(priceStr);
    if (isNaN(price)) {
      this.log('❌ Error: El precio debe ser un número válido.');
      return;
    }

    try {
      await this.store.updateFlavorPrice(id, price);
      this.log(`✅ Precio del sabor ${id} actualizado a $${price}`);
    } catch (err: any) {
      this.log('❌ Error al actualizar precio: ' + err.message);
    }
  }

  async logout() {
    await signOut(this.auth);
    this.store.setView('HOME');
  }

  async seed() {
    this.log('--- BOTÓN PRESIONADO: Cargar Datos Iniciales ---');
    this.log('Intentando cargar datos...');

    try {
      this.log('Ejecutando store.seedData()...');
      await this.store.seedData();
      this.log('✅ ÉXITO: Los datos se han guardado en Firestore.');
      this.log(' Verifica que aparezcan en la lista de arriba.');
    } catch (err: any) {
      this.log('⛔ ERROR CRÍTICO: ' + (err.message || err));
      console.error(err);

      if (err.code === 'permission-denied') {
        this.log('👉 CAUSA: Permisos denegados en Firestore.');
        this.log('SOLUCIÓN: Ve a Firebase Console > Firestore > Rules y cambia a: allow read, write: if true;');
      }
    }
  }
}
