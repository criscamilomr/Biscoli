import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { StoreService } from '../../services/store.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="min-h-screen pt-32 pb-12 px-4 flex items-center justify-center bg-brown-900/5">
      <div class="bg-white rounded-[2rem] p-10 shadow-xl border border-white max-w-md w-full">
        <div class="text-center mb-10">
           <h2 class="text-3xl font-black text-brown-900 mb-2">Admin Access</h2>
           <p class="text-gray-500">Solo personal autorizado 🍪</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="login()" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input formControlName="email" type="email" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brown-900/20" placeholder="admin@biscoli.com">
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
            <input formControlName="password" type="password" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brown-900/20" placeholder="••••••">
          </div>

          @if (error) {
            <div class="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
              {{ error }}
            </div>
          }

          <div class="flex gap-4">
             <button type="submit" [disabled]="loginForm.invalid || loading" class="flex-1 bg-brown-900 text-white py-4 rounded-xl font-black shadow-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed">
               {{ loading ? '...' : 'Ingresar' }}
             </button>
             
             <!-- Temporary Register Button -->
             <button type="button" (click)="register()" [disabled]="loginForm.invalid || loading" class="bg-gray-200 text-gray-600 px-6 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all disabled:opacity-50">
               Crear
             </button>
          </div>
          
          <button type="button" (click)="store.setView('HOME')" class="w-full text-center text-gray-400 font-bold hover:text-brown-900 transition-colors text-sm mt-4">
            Volver a la tienda
          </button>
        </form>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
    private auth = inject(Auth);
    store = inject(StoreService);
    private fb = inject(FormBuilder);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = false;
    error = '';

    async login() {
        if (this.loginForm.invalid) return;
        this.loading = true;
        this.error = '';
        const { email, password } = this.loginForm.value;

        try {
            await signInWithEmailAndPassword(this.auth, email!, password!);
            this.store.setView('ADMIN_DASHBOARD');
        } catch (err: any) {
            console.error(err);
            this.error = 'Credenciales inválidas';
        } finally {
            this.loading = false;
        }
    }

    async register() {
        if (this.loginForm.invalid) return;
        this.loading = true;
        this.error = '';
        const { email, password } = this.loginForm.value;

        try {
            await createUserWithEmailAndPassword(this.auth, email!, password!);
            this.store.setView('ADMIN_DASHBOARD');
        } catch (err: any) {
            console.error(err);
            this.error = 'Error al crear usuario (Min 6 caracteres)';
        } finally {
            this.loading = false;
        }
    }
}
