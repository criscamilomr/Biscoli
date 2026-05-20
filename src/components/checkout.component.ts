import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { PaymentService, PaymentMethodType, FinancialInstitution } from '../services/payment.service';
import { PaymentStatusModalComponent, PaymentModalState } from './payment-status-modal.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, PaymentStatusModalComponent],
  templateUrl: './checkout.component.html',
  styles: [`
    .animate-fade-in { animation: fade-in 0.3s ease-out; }
    @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .payment-tab { @apply flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200; }
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
  readonly docTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
  ];

  isProcessing = signal(false);
  paymentError = signal('');
  processingMessage = signal('');
  selectedPaymentMethod = signal<PaymentMethodType>('CARD');
  detectedCardType = signal<string>('');

  // Modal state
  showPaymentModal = signal(false);
  paymentModalState = signal<PaymentModalState>('processing');
  paymentModalMessage = signal('');
  paymentModalReference = signal('');

  // PSE banks
  pseInstitutions = signal<FinancialInstitution[]>([]);
  pseLoading = signal(false);

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
    cardHolderName: [''],
    cardInstallments: [1],
    // Nequi field
    nequiPhone: [''],
    // PSE fields
    pseUserType: ['0'], // "0" = natural person
    pseDocType: ['CC'],
    pseDocNumber: [''],
    pseBank: [''],
    // Daviplata fields
    daviplataPhone: [''],
    daviplataDocType: ['CC'],
    daviplataDocNumber: [''],
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

    // Load PSE banks on first selection
    if (method === 'PSE' && this.pseInstitutions().length === 0) {
      this.loadPSEBanks();
    }
  }

  private async loadPSEBanks() {
    this.pseLoading.set(true);
    try {
      const banks = await this.paymentService.getFinancialInstitutions();
      this.pseInstitutions.set(banks);
    } catch (err) {
      console.error('Error loading PSE banks:', err);
    } finally {
      this.pseLoading.set(false);
    }
  }

  private clearPaymentValidators() {
    ['cardNumber', 'cardExp', 'cardCvc', 'cardHolderName', 'nequiPhone', 'pseDocNumber', 'pseBank', 'daviplataPhone', 'daviplataDocNumber'].forEach(field => {
      this.checkoutForm.get(field)?.clearValidators();
      this.checkoutForm.get(field)?.updateValueAndValidity();
    });
  }

  private applyPaymentValidators(method: PaymentMethodType) {
    if (method === 'CARD') {
      this.checkoutForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern('^(\\d{4}\\s\\d{6}\\s\\d{5}|\\d{4}\\s\\d{4}\\s\\d{4}\\s\\d{4})$')]);
      this.checkoutForm.get('cardExp')?.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/[0-9]{2}$')]); // MM/YY
      this.checkoutForm.get('cardCvc')?.setValidators([Validators.required, Validators.pattern('^[0-9]{3,4}$')]);
      this.checkoutForm.get('cardHolderName')?.setValidators([Validators.required]);
    } else if (method === 'NEQUI') {
      this.checkoutForm.get('nequiPhone')?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
    } else if (method === 'PSE') {
      this.checkoutForm.get('pseDocNumber')?.setValidators([Validators.required]);
      this.checkoutForm.get('pseBank')?.setValidators([Validators.required]);
    } else if (method === 'DAVIPLATA') {
      this.checkoutForm.get('daviplataPhone')?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
      this.checkoutForm.get('daviplataDocNumber')?.setValidators([Validators.required]);
    }
    // Update validity for all dynamic fields
    ['cardNumber', 'cardExp', 'cardCvc', 'cardHolderName', 'nequiPhone', 'pseDocNumber', 'pseBank', 'daviplataPhone', 'daviplataDocNumber'].forEach(field => {
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
        && this.checkoutForm.get('cardCvc')?.valid && this.checkoutForm.get('cardHolderName')?.valid);
    } else if (method === 'NEQUI') {
      return !!this.checkoutForm.get('nequiPhone')?.valid;
    } else if (method === 'PSE') {
      return !!(this.checkoutForm.get('pseDocNumber')?.valid && this.checkoutForm.get('pseBank')?.valid);
    } else if (method === 'DAVIPLATA') {
      return !!(this.checkoutForm.get('daviplataPhone')?.valid && this.checkoutForm.get('daviplataDocNumber')?.valid);
    }
    return true; // Bancolombia doesn't need extra fields
  }

  // ── Modal helpers ──
  private openModal(state: PaymentModalState, message: string, reference = '') {
    this.paymentModalState.set(state);
    this.paymentModalMessage.set(message);
    this.paymentModalReference.set(reference);
    this.showPaymentModal.set(true);
  }

  private updateModalMessage(message: string) {
    this.paymentModalMessage.set(message);
  }

  onModalGoHome() {
    this.showPaymentModal.set(false);
    this.store.clearCart();
    this.store.setView('HOME');
  }

  onModalRetry() {
    this.showPaymentModal.set(false);
  }

  onModalClose() {
    this.showPaymentModal.set(false);
  }

  async submitOrder() {
    if (!this.isFormValid() || this.isProcessing()) return;
    this.isProcessing.set(true);
    this.paymentError.set('');

    const formVal = this.checkoutForm.value;
    const method = this.selectedPaymentMethod();
    const amountInCents = this.store.cartTotal() * 100;

    // Open modal in processing state
    this.openModal('processing', 'Conectando con la pasarela de pagos...');

    try {
      if (method === 'CARD') {
        await this.processCardPayment(formVal, amountInCents);
      } else if (method === 'NEQUI') {
        await this.processNequiPayment(formVal, amountInCents);
      } else if (method === 'PSE') {
        await this.processPSEPayment(formVal, amountInCents);
      } else if (method === 'DAVIPLATA') {
        await this.processDaviplataPayment(formVal, amountInCents);
      } else {
        await this.processBancolombiaPayment(formVal, amountInCents);
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg = err?.error?.message || err?.message || 'Hubo un error procesando tu pago. Intenta nuevamente.';
      if (method === 'CARD') {
        errorMsg = 'No se pudo hacer el pago, verifica los datos de tu tarjeta.';
      }
      this.openModal('error', errorMsg);
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async processCardPayment(formVal: any, amountInCents: number) {
    this.updateModalMessage('Verificando datos de tu tarjeta...');
    
    const [expMonth, expYear] = formVal.cardExp.split('/');
    const cleanCardNumber = formVal.cardNumber.replace(/\D/g, '');

    const token = await this.paymentService.tokenizeCard({
      number: cleanCardNumber,
      cvc: formVal.cardCvc,
      exp_month: expMonth,
      exp_year: expYear,
      card_holder: formVal.cardHolderName
    });

    this.updateModalMessage('Procesando tu pago...');
    const response = await this.paymentService.createPayment({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: formVal.email,
      payment_method: { type: 'CARD', token, installments: Number(formVal.cardInstallments) || 1 },
      order_details: this.buildOrderDetails(formVal)
    });

    this.updateModalMessage('Verificando estado del pago...');
    const final = await this.paymentService.pollTransactionUntilFinal(response.data.id, 30);
    this.handleFinalStatus(final.data.status, final.data.status_message, final.data.reference);
  }

  private async processNequiPayment(formVal: any, amountInCents: number) {
    this.updateModalMessage('Enviando solicitud a Nequi...');
    const response = await this.paymentService.createPayment({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: formVal.email,
      payment_method: { type: 'NEQUI', phone_number: formVal.nequiPhone, sandbox_status: 'APPROVED' },
      order_details: this.buildOrderDetails(formVal)
    });

    this.updateModalMessage('⏳ Abre tu app Nequi y acepta el pago...');
    const final = await this.paymentService.pollTransactionUntilFinal(response.data.id, 90);
    this.handleFinalStatus(final.data.status, final.data.status_message, final.data.reference);
  }

  private async processBancolombiaPayment(formVal: any, amountInCents: number) {
    this.updateModalMessage('Conectando con Bancolombia...');
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

    this.updateModalMessage('Obteniendo enlace de pago...');
    const asyncUrl = await this.paymentService.pollForAsyncPaymentUrl(response.data.id);
    window.location.href = asyncUrl;
  }

  private async processPSEPayment(formVal: any, amountInCents: number) {
    this.updateModalMessage('Conectando con PSE...');
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const response = await this.paymentService.createPayment({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: formVal.email,
      redirect_url: currentUrl,
      payment_method: {
        type: 'PSE',
        user_type: formVal.pseUserType,
        user_legal_id: formVal.pseDocNumber,
        user_legal_id_type: formVal.pseDocType,
        financial_institution_code: formVal.pseBank,
        payment_description: 'Pago Biscoli Cookies'
      },
      order_details: this.buildOrderDetails(formVal)
    });

    this.updateModalMessage('Redirigiendo a tu banco...');
    const asyncUrl = await this.paymentService.pollForAsyncPaymentUrl(response.data.id);
    window.location.href = asyncUrl;
  }

  private async processDaviplataPayment(formVal: any, amountInCents: number) {
    this.updateModalMessage('Enviando solicitud a Daviplata...');
    const response = await this.paymentService.createPayment({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: formVal.email,
      payment_method: {
        type: 'DAVIPLATA',
        phone_number: formVal.daviplataPhone,
        user_legal_id: formVal.daviplataDocNumber,
        user_legal_id_type: formVal.daviplataDocType,
        sandbox_status: 'APPROVED'
      },
      order_details: this.buildOrderDetails(formVal)
    });

    this.updateModalMessage('⭐ Abre tu app Daviplata y acepta el pago...');
    const final = await this.paymentService.pollTransactionUntilFinal(response.data.id, 30);
    this.handleFinalStatus(final.data.status, final.data.status_message, final.data.reference);
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

  private handleFinalStatus(status: string, message: string, reference: string = '') {
    if (status === 'APPROVED') {
      this.openModal('success', '¡Tu pedido ha sido recibido! Pronto recibirás un mensaje con los detalles de tu entrega.', reference);
    } else if (status === 'DECLINED') {
      if (this.selectedPaymentMethod() === 'CARD') {
        this.openModal('error', 'No se pudo hacer el pago, verifica los datos de tu tarjeta.');
      } else {
        this.openModal('error', `Pago rechazado: ${message || 'Intenta con otro método de pago.'}`);
      }
    } else {
      if (this.selectedPaymentMethod() === 'CARD') {
        this.openModal('error', 'No se pudo hacer el pago, verifica los datos de tu tarjeta.');
      } else {
        this.openModal('error', `Error en el pago: ${message || 'Hubo un problema. Intenta nuevamente.'}`);
      }
    }
  }
}
