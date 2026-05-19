
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-terms',
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
        <h1 class="text-4xl md:text-5xl font-black text-brown-900 mb-8 tracking-tight">Términos y Condiciones</h1>
        

        <div class="text-stone-600">
          <p class="font-bold text-lg mb-8 text-stone-500">Última actualización: Enero 2026</p>
          
          <div class="space-y-8">
            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">1. Aceptación de los Términos</h3>
              <p class="leading-relaxed text-lg">
                Al acceder y utilizar el sitio web de Biscoli ("nosotros", "nuestro", "la empresa"), aceptas cumplir y estar sujeto a los siguientes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no deberías utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">2. Naturaleza de los Productos</h3>
              <p class="leading-relaxed text-lg mb-2">
                Biscoli se especializa en galletas artesanales, veganas y sin azúcar. Dado el carácter artesanal de nuestra producción:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-lg">
                <li>Las imágenes en el sitio web son referenciales. El producto final puede variar ligeramente en apariencia, aunque garantizamos su calidad y peso aproximado.</li>
                <li>Los productos pueden contener alérgenos como nueces y almendras, que son la base de nuestras harinas. Es responsabilidad del cliente revisar los ingredientes si posee alguna alergia severa.</li>
              </ul>
            </section>

            <section>
              <h3 class="text-2xl font-black text-brown-900 mb-3">3. Pedidos, Precios y Pagos</h3>
              <ul class="list-disc pl-5 space-y-2 text-lg">
                <li><strong>Proceso de Compra:</strong> Los pedidos se inician en nuestra web y se finalizan a través de WhatsApp. El contrato de venta se formaliza una vez que confirmamos la recepción del pago.</li>
                <li><strong>Precios:</strong> Todos los precios están expresados en pesos colombianos (COP). Nos reservamos el derecho de modificar los precios en cualquier momento sin previo aviso.</li>
                <li><strong>Pagos:</strong> Aceptamos transferencias bancarias (Nequi, Daviplata, Bancolombia) acordadas directamente en el chat de WhatsApp.</li>
              </ul>
            </section>

            <section>
               <h3 class="text-2xl font-black text-brown-900 mb-3">4. Políticas de Envío y Entrega</h3>
               <ul class="list-disc pl-5 space-y-2 text-lg">
                 <li>Realizamos envíos a nivel local y nacional según la cobertura de nuestras transportadoras aliadas.</li>
                 <li>Los tiempos de entrega son estimados (generalmente 1-3 días hábiles en ciudades principales) y pueden variar por factores externos o alta demanda.</li>
                 <li>Es responsabilidad del cliente proporcionar una dirección exacta y asegurar que haya alguien disponible para recibir el pedido.</li>
               </ul>
            </section>

            <section>
               <h3 class="text-2xl font-black text-brown-900 mb-3">5. Política de Devoluciones y Reembolsos</h3>
               <p class="leading-relaxed text-lg mb-2">
                 Debido a que nuestros productos son alimentos perecederos, <strong>no aceptamos devoluciones</strong> ni cambios por gusto personal una vez el producto ha sido entregado.
               </p>
               <p class="leading-relaxed text-lg">Solo procederemos con reembolsos o reposiciones si:</p>
               <ul class="list-disc pl-5 space-y-2 text-lg">
                 <li>El producto llega en mal estado o dañado por culpa del transporte (se requiere evidencia fotográfica inmediata).</li>
                 <li>El pedido recibido no corresponde a lo solicitado.</li>
               </ul>
            </section>

            <section>
               <h3 class="text-2xl font-black text-brown-900 mb-3">6. Limitación de Responsabilidad</h3>
               <p class="leading-relaxed text-lg">
                 Biscoli no se hace responsable por daños indirectos que puedan surgir del uso de nuestros productos. Nuestra responsabilidad máxima se limita al valor de compra del producto.
               </p>
            </section>
            
            <section>
               <h3 class="text-2xl font-black text-brown-900 mb-3">7. Contacto</h3>
               <p class="leading-relaxed text-lg">
                 Para cualquier duda, reclamo o sugerencia, puedes contactarnos directamente a través de nuestro canal de WhatsApp o redes sociales oficiales.
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
export class TermsComponent {
  store = inject(StoreService);
}
