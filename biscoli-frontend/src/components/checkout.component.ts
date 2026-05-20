import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { PaymentService, PaymentMethodType } from '../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styles: [`
    .animate-fade-in { animation: fade-in 0.3s ease-out; }
    @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .payment-tab { @apply flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200; }
    .payment-tab.active { @apply border-[#4A5D4A] bg-[#e0eadc] shadow-md scale-[1.02]; }
    .payment-tab:not(.active) { @apply border-gray-200 bg-white hover:border-[#8FA67A] hover:bg-[#f0f5ed]; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  store = inject(StoreService);
  paymentService = inject(PaymentService);
  private fb = inject(FormBuilder);

  readonly cities = ['Cali'];
  readonly installmentOptions = [1, 2, 3, 6, 12, 24, 36];

  isProcessing = signal(false);
  paymentError = signal('');
  processingMessage = signal('');
  selectedPaymentMethod = signal<PaymentMethodType>('CARD');
  detectedCardType = signal<string>('');

  checkoutForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    city: ['', [Validators.required, this.caliOnlyValidator]],
    address: ['', Validators.required],
    neighborhood: ['', Validators.required],
    notes: [''],
    // Card fields
    cardNumber: [''],
    cardExp: [''], // MM/YY format
    cardCvc: [''],
    // Nequi field
    nequiPhone: [''],
  });

  private caliOnlyValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return control.value === 'Cali' ? null : { onlyCali: true };
  }

  selectPaymentMethod(method: PaymentMethodType) {
    this.selectedPaymentMethod.set(method);
    this.paymentError.set('');
    this.clearPaymentValidators();
    this.applyPaymentValidators(method);
  }

  private clearPaymentValidators() {
    ['cardNumber', 'cardExp', 'cardCvc', 'nequiPhone'].forEach(field => {
      this.checkoutForm.get(field)?.clearValidators();
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  private applyPaymentValidators(method: PaymentMethodType) {
    if (method === 'CARD') {
      // Allows Amex format (4-6-5) or standard format (4-4-4-4)
      this.checkoutForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern('^(\\d{4}\\s\\d{6}\\s\\d{5}|\\d{4}\\s\\d{4}\\s\\d{4}\\s\\d{4})$')]);
      this.checkoutForm.get('cardExp')?.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/[0-9]{2}$')]); // MM/YY
      this.checkoutForm.get('cardCvc')?.setValidators([Validators.required, Validators.pattern('^[0-9]{3,4}$')]);
    } else if (method === 'NEQUI') {
      this.checkoutForm.get('nequiPhone')?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
    }
    ['cardNumber', 'cardExp', 'cardCvc', 'nequiPhone'].forEach(field => {
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  constructor() {
    this.applyPaymentValidators('CARD');
  }

  onCardNumberInput(event: any) {
    let val = event.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Detect franchise
    let type = '';
    if (/^4/.test(val)) {
      type = 'visa';
    } else if (/^5[1-5]/.test(val)) {
      type = 'mastercard';
    } else if (/^3[47]/.test(val)) {
      type = 'amex';
    }
    this.detectedCardType.set(type);

    // Limit length based on card type (15 for Amex, 16 for others)
    const maxLength = type === 'amex' ? 15 : 16;
    if (val.length > maxLength) {
      val = val.substring(0, maxLength);
    }

    // Format with spaces
    let formatted = '';
    if (type === 'amex') {
      // Amex: 4-6-5 format
      const match = val.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
      if (match) {
        formatted = !match[2] ? match[1] : `${match[1]} ${match[2]}${match[3] ? ` ${match[3]}` : ''}`;
      }
    } else {
      // Visa/Mastercard: 4-4-4-4 format
      formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    }
    
    this.checkoutForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }

  onCardExpInput(event: any) {
    let val = event.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    this.checkoutForm.get('cardExp')?.setValue(val, { emitEvent: false });
  }

  isFormValid(): boolean {
    const base = this.checkoutForm.get('name')?.valid && this.checkoutForm.get('email')?.valid
      && this.checkoutForm.get('phone')?.valid && this.checkoutForm.get('city')?.valid
      && this.checkoutForm.get('address')?.valid && this.checkoutForm.get('neighborhood')?.valid;
    if (!base) return false;
    const method = this.selectedPaymentMethod();
    if (method === 'CARD') {
      return !!(this.checkoutForm.get('cardNumber')?.valid && this.checkoutForm.get('cardExp')?.valid
        && this.checkoutForm.get('cardCvc')?.valid);
    } else if (method === 'NEQUI') {
      return !!this.checkoutForm.get('nequiPhone')?.valid;
    }
    return true; // Bancolombia doesn't need extra fields
  }

  async submitOrder() {
    if (!this.isFormValid() || this.isProcessing()) return;
    this.isProcessing.set(true);
    this.paymentError.set('');

    const formVal = this.checkoutForm.value;
    const method = this.selectedPaymentMethod();
    const amountInCents = this.store.cartTotal() * 100;

    try {
      if (method === 'CARD') {
        await this.processCardPayment(formVal, amountInCents);
      } else if (method === 'NEQUI') {
        await this.processNequiPayment(formVal, amountInCents);
      } else {
        await this.processBancolombiaPayment(formVal, amountInCents);
      }
    } catch (err: any) {
      console.error(err);
      this.paymentError.set(err?.message || 'Hubo un error procesando tu pago. Intenta nuevamente.');
    } finally {
      this.isProcessing.set(false);
      this.processingMessage.set('');
    }
  }

  private async processCardPayment(formVal: any, amountInCents: number) {
    this.processingMessage.set('Verificando datos de tu tarjeta...');
    
    const [expMonth, expYear] = formVal.cardExp.split('/');
    const cleanCardNumber = formVal.cardNumber.replace(/\D/g, '');

    const token = await this.paymentService.tokenizeCard({
      number: cleanCardNumber,
      cvc: formVal.cardCvc,
      exp_month: expMonth,
      exp_year: expYear,
      card_holder: formVal.name
    });

    this.processingMessage.set('Procesando tu pago...');
    const response = await this.paymentService.createPayment({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: formVal.email,
      payment_method: { type: 'CARD', token, installments: 1 },
      order_details: this.buildOrderDetails(formVal)
    });

    this.processingMessage.set('Verificando estado del pago...');
    const final = await this.paymentService.pollTransactionUntilFinal(response.data.id, 30);
    this.handleFinalStatus(final.data.status, final.data.status_message);
  }

  private async processNequiPayment(formVal: any, amountInCents: number) {
    this.processingMessage.set('Enviando solicitud a Nequi...');
    const response = await this.paymentService.createPayment({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: formVal.email,
      payment_method: { type: 'NEQUI', phone_number: formVal.nequiPhone },
      order_details: this.buildOrderDetails(formVal)
    });

    this.processingMessage.set('⏳ Abre tu app Nequi y acepta el pago...');
    const final = await this.paymentService.pollTransactionUntilFinal(response.data.id, 90);
    this.handleFinalStatus(final.data.status, final.data.status_message);
  }

  private async processBancolombiaPayment(formVal: any, amountInCents: number) {
    this.processingMessage.set('Conectando con Bancolombia...');
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const response = await this.paymentService.createPayment({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: formVal.email,
      redirect_url: currentUrl,
      payment_method: {
        type: 'BANCOLOMBIA_TRANSFER',
        user_type: 'PERSON',
        payment_description: 'Pago Biscoli Cookies',
        sandbox_status: 'APPROVED'
      },
      order_details: this.buildOrderDetails(formVal)
    });

    this.processingMessage.set('Obteniendo enlace de pago...');
    const asyncUrl = await this.paymentService.pollForAsyncPaymentUrl(response.data.id);
    window.location.href = asyncUrl;
  }

  private buildOrderDetails(formVal: any) {
    const cart = this.store.cart();
    const items = cart.map(item => {
      if (item.size === 1) {
        return {
          name: item.flavors[0]?.name || 'Galleta individual',
          quantity: item.quantity
        };
      } else {
        // Count occurrences of each flavor in the box
        const flavorCounts: Record<string, number> = {};
        item.flavors.forEach(flavor => {
          flavorCounts[flavor.name] = (flavorCounts[flavor.name] || 0) + 1;
        });

        // Format as "2x Sabor, Sabor2"
        const flavorsStr = Object.entries(flavorCounts)
          .map(([name, count]) => count > 1 ? `${count}x ${name}` : name)
          .join(', ');

        return {
          name: `Caja x${item.size} (${flavorsStr})`,
          quantity: item.quantity
        };
      }
    });

    return {
      customer_name: formVal.name,
      phone: formVal.phone,
      city: formVal.city,
      address: formVal.address,
      neighborhood: formVal.neighborhood,
      notes: formVal.notes || '',
      items
    };
  }

  private handleFinalStatus(status: string, message: string) {
    if (status === 'APPROVED') {
      alert('🎉 ¡Pago exitoso! Hemos recibido tu pedido.');
      this.store.clearCart();
      this.store.setView('HOME');
    } else if (status === 'DECLINED') {
      this.paymentError.set(`Pago rechazado: ${message || 'Intenta con otro método de pago.'}`);
    } else {
      this.paymentError.set(`Error en el pago: ${message || 'Hubo un problema. Intenta nuevamente.'}`);
    }
  }
}
