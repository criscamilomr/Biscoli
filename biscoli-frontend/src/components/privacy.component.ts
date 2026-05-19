
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-32 pb-16 px-4 max-w-4xl mx-auto">
      <button (click)="store.setView('HOME')" class="mb-8 text-brown-900 hover:text-black transition-colors flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Volver
      </button>

      <div class="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-xl border border-white">
        <h1 class="text-4xl md:text-5xl font-black text-brown-900 mb-8 tracking-tight">Política de Privacidad</h1>
        

        <div class="text-stone-600">
          <p class="font-bold text-lg mb-8 text-stone-500">Última actualización: Enero 2026</p>
          
          <div class="space-y-8">
            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">1. Compromiso de Privacidad</h3>
              <p class="leading-relaxed text-lg">
                En Biscoli, respetamos tu privacidad y estamos comprometidos a proteger tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos la información que nos proporcionas. Cumplimos con la normativa vigente sobre protección de datos personales (Ley 1581 de 2012 de Habeas Data en Colombia).
              </p>
            </section>

            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">2. Información que Recolectamos</h3>
              <p class="leading-relaxed text-lg mb-2">
                Podemos recolectar la siguiente información personal, la cual nos proporcionas voluntariamente al realizar un pedido o consultarnos:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-lg">
                 <li><strong>Datos de Identificación:</strong> Nombre y apellidos.</li>
                 <li><strong>Datos de Contacto:</strong> Número de teléfono (Celular/WhatsApp), dirección de correo electrónico y dirección física para envíos.</li>
                 <li><strong>Información de Transacción:</strong> Detalles de los productos que compras y comprobantes de pago. NO almacenamos datos de tarjetas de crédito o débito, ya que los pagos se realizan directamente a través de pasarelas bancarias externas o transferencias.</li>
              </ul>
            </section>

            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">3. Uso de tu Información</h3>
              <p class="leading-relaxed text-lg mb-2">
                Utilizamos tus datos personales únicamente para las siguientes finalidades:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-lg">
                <li>Procesar, empacar y entregar tus pedidos de manera efectiva.</li>
                <li>Comunicarnos contigo sobre el estado de tu pedido a través de WhatsApp o correo.</li>
                <li>Responder a tus preguntas, comentarios o reclamos.</li>
                <li>Si nos has dado tu consentimiento explícito, para enviarte información sobre nuevos sabores o promociones especiales.</li>
              </ul>
            </section>

            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">4. Compartir Información con Terceros</h3>
              <p class="leading-relaxed text-lg">
                Biscoli <strong>nunca</strong> venderá tus datos personales. Solo compartimos la información estrictamente necesaria con proveedores de servicios esenciales para nuestra operación, tales como:
                <br>• Empresas de mensajería y logística para realizar la entrega.
              </p>
            </section>

            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">5. Tus Derechos (Habeas Data)</h3>
              <p class="leading-relaxed text-lg">
                Como titular de tus datos, tienes derecho a conocer, actualizar, rectificar o solicitar la supresión de tu información de nuestras bases de datos en cualquier momento. Para ejercer estos derechos, simplemente escríbenos a nuestro WhatsApp o redes sociales solicitando la eliminación de tus datos.
              </p>
            </section>
            
            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">6. Cookies y Tecnologías</h3>
              <p class="leading-relaxed text-lg">
                Nuestro sitio web utiliza cookies técnicas esenciales para el funcionamiento del carrito de compras y la navegación. No utilizamos cookies de terceros para rastreo publicitario invasivo.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyComponent {
  store = inject(StoreService);
}
