import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-ingredients-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pt-24 pb-32 px-4 max-w-6xl mx-auto font-sans">
      
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-5xl md:text-7xl font-black text-[#3A4A3A] mb-6 tracking-tight">Nuestros Ingredientes</h2>
        <p class="text-xl text-[#3A4A3A]/80 max-w-2xl mx-auto leading-relaxed font-medium">
          Creemos que el sabor real comienza con ingredientes reales. <br>
          <span class="font-black text-[#8FA67A] text-2xl mt-2 block">Sin gluten. Sin azúcar. 100% Placer.</span>
        </p>
      </div>

      <!-- Main Ingredients Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-24">
        
        <!-- Harina de Almendra -->
        <div class="bg-white rounded-[2rem] p-10 shadow-xl border border-[#e0eadc] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
          <div class="absolute top-0 right-0 w-40 h-40 bg-[#f0f5ee] rounded-bl-[4rem] -mr-10 -mt-10 opacity-50 text-7xl flex items-center justify-center pt-10 pr-10">🌰</div>
          <h3 class="text-4xl font-black text-[#3A4A3A] mb-4 relative z-10 tracking-tight">Harina de Almendra</h3>
          <p class="text-[#4A5D4A] text-lg mb-8 relative z-10 font-medium leading-relaxed">La base de nuestra magia. Aporta una textura húmeda y suave que se deshace en la boca, sin la pesadez del gluten.</p>
          
          <ul class="space-y-4 relative z-10">
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Rica en proteínas y grasas saludables</span>
            </li>
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Bajo índice glucémico</span>
            </li>
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Aporta Vitamina E antioxidante</span>
            </li>
          </ul>
        </div>

        <!-- Alulosa -->
        <div class="bg-white rounded-[2rem] p-10 shadow-xl border border-[#e0eadc] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
          <div class="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-bl-[4rem] -mr-10 -mt-10 opacity-50 text-7xl flex items-center justify-center pt-10 pr-10">🌾</div>
          <h3 class="text-4xl font-black text-[#3A4A3A] mb-4 relative z-10 tracking-tight">Alulosa</h3>
          <p class="text-[#4A5D4A] text-lg mb-8 relative z-10 font-medium leading-relaxed">Un endulzante revolucionario que se encuentra naturalmente en higos y pasas. Sabe igual que el azúcar pero sin sus calorías.</p>
          
          <ul class="space-y-4 relative z-10">
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Sabor idéntico al azúcar, sin resabios</span>
            </li>
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">No impacta la glucosa en sangre</span>
            </li>
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">100% Keto Friendly</span>
            </li>
          </ul>
        </div>

         <!-- Aceite de Coco -->
         <div class="bg-white rounded-[2rem] p-10 shadow-xl border border-[#e0eadc] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
          <div class="absolute top-0 right-0 w-40 h-40 bg-cyan-50 rounded-bl-[4rem] -mr-10 -mt-10 opacity-50 text-7xl flex items-center justify-center pt-10 pr-10">🥥</div>
          <h3 class="text-4xl font-black text-[#3A4A3A] mb-4 relative z-10 tracking-tight">Aceite de Coco</h3>
          <p class="text-[#4A5D4A] text-lg mb-8 relative z-10 font-medium leading-relaxed">Sustituimos la mantequilla por grasas vegetales de calidad premium para un bocado untuoso.</p>
          
          <ul class="space-y-4 relative z-10">
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Triglicéridos de cadena media (energía rápida)</span>
            </li>
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Propiedades antimicrobianas</span>
            </li>
          </ul>
        </div>

        <!-- Harina de Avena -->
        <div class="bg-white rounded-[2rem] p-10 shadow-xl border border-[#e0eadc] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
          <div class="absolute top-0 right-0 w-40 h-40 bg-yellow-50 rounded-bl-[4rem] -mr-10 -mt-10 opacity-50 text-7xl flex items-center justify-center pt-10 pr-10">🥣</div>
          <h3 class="text-4xl font-black text-[#3A4A3A] mb-4 relative z-10 tracking-tight">Harina de avena CGF</h3>
          <p class="text-[#4A5D4A] text-lg mb-8 relative z-10 font-medium leading-relaxed">Avena Certificada Gluten Free. Aporta fibra soluble y una textura increíblemente tierna a nuestras galletas.</p>
          
          <ul class="space-y-4 relative z-10">
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Fuente natural de fibra y betaglucanos</span>
            </li>
            <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Digestión lenta y energía sostenida</span>
            </li>
             <li class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">✓</span>
              <span class="text-gray-700 font-medium text-lg">Certificada libre de trazas de gluten</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Allergen Information Section -->
      <div class="mb-24">
        <h3 class="text-3xl md:text-4xl font-black text-[#3A4A3A] text-center mb-10 tracking-tight">Información de Alérgenos</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- CONTAINS -->
          <div class="bg-red-50 border border-red-100 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto font-bold">⚠️</div>
            <h4 class="text-xl font-black text-red-800 mb-2 uppercase tracking-wide">Contiene</h4>
            <ul class="text-red-700/80 font-medium space-y-2">
              <li class="flex items-center justify-center gap-2">
                <span>🌰</span> Almendras (Frutos Secos)
              </li>
              <li class="flex items-center justify-center gap-2">
                <span>🥥</span> Coco
              </li>
            </ul>
          </div>

          <!-- WARNING / TRACES -->
          <div class="bg-amber-50 border border-amber-100 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto font-bold">🏭</div>
            <h4 class="text-xl font-black text-amber-800 mb-2 uppercase tracking-wide">Puede Contener</h4>
            <p class="text-amber-700/80 font-medium leading-relaxed text-sm">
              Producido en instalaciones que también procesan <strong>maní</strong> y otras <strong>nueces</strong>. Si tienes alergias severas, ten precaución.
            </p>
          </div>

          <!-- FREE OF -->
          <div class="bg-green-50 border border-green-100 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto font-bold">✅</div>
            <h4 class="text-xl font-black text-green-800 mb-2 uppercase tracking-wide">Libre De</h4>
            <ul class="text-green-700/80 font-medium space-y-2">
               <li class="flex items-center justify-center gap-2">🚫 Gluten</li>
               <li class="flex items-center justify-center gap-2">🚫 Lácteos</li>
               <li class="flex items-center justify-center gap-2">🚫 Huevos</li>
               <li class="flex items-center justify-center gap-2">🚫 Azúcar Refinada</li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Bottom Call to Action -->
      <div class="bg-[#3A4A3A] rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-[#8FA67A]/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <h3 class="text-4xl md:text-5xl font-black mb-8 relative z-10 tracking-tight">¿Listo para probar lo saludable?</h3>
        <p class="text-[#dde8d5]/90 mb-10 max-w-2xl mx-auto relative z-10 text-xl font-medium leading-relaxed">No tienes que sacrificar el sabor para cuidar tu cuerpo. Nuestras cookies son la prueba.</p>
        
        <button (click)="store.setView('HOME')" class="bg-[#8FA67A] text-[#3A4A3A] px-10 py-5 rounded-full font-black text-xl shadow-xl hover:bg-[#A3B88C] hover:scale-105 transition-transform relative z-10 uppercase tracking-wide">
          Volver a Pedir
        </button>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientsViewComponent {
  store = inject(StoreService);
}
