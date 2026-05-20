import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { firstValueFrom } from 'rxjs';

// ──────────────────────── Interfaces ────────────────────────

export interface CardTokenizeRequest {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface WompiTokenResponse {
  status: string;
  data: {
    id: string;
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    expires_at: string;
  };
}

export type PaymentMethodType = 'CARD' | 'NEQUI' | 'BANCOLOMBIA_TRANSFER';

export interface PaymentMethodCard {
  type: 'CARD';
  token: string;
  installments: number;
}

export interface PaymentMethodNequi {
  type: 'NEQUI';
  phone_number: string;
}

export interface PaymentMethodBancolombia {
  type: 'BANCOLOMBIA_TRANSFER';
  user_type: string; // Must be "PERSON"
  payment_description: string;
  ecommerce_url?: string;
  sandbox_status?: string; // For sandbox testing
}

export type PaymentMethodPayload = PaymentMethodCard | PaymentMethodNequi | PaymentMethodBancolombia;

export interface OrderItemDetail {
  name: string;
  quantity: number;
}

export interface OrderDetails {
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  neighborhood: string;
  notes: string;
  items: OrderItemDetail[];
}

export interface PaymentRequest {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: PaymentMethodPayload;
  redirect_url?: string;
  order_details?: OrderDetails;
}

export interface TransactionResponse {
  data: {
    id: string;
    reference: string;
    amount_in_cents: number;
    currency: string;
    status: string;
    status_message: string;
    payment_method_type: string;
    payment_method: {
      type: string;
      extra: {
        async_payment_url?: string;
        name?: string;
        brand?: string;
        last_four?: string;
      };
    };
    redirect_url: string;
  };
}

// ──────────────────────── Service ────────────────────────

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);

  /**
   * Tokenize a credit/debit card directly with Wompi (PCI-compliant).
   * The card data never touches our backend.
   */
  async tokenizeCard(card: CardTokenizeRequest): Promise<string> {
    const url = `${environment.wompi.apiUrl}/tokens/cards`;

    const response = await firstValueFrom(
      this.http.post<WompiTokenResponse>(url, card, {
        headers: {
          'Authorization': `Bearer ${environment.wompi.publicKey}`
        }
      })
    );

    return response.data.id;
  }

  /**
   * Create a payment transaction via our backend.
   * The backend generates the integrity signature and calls Wompi.
   */
  async createPayment(request: PaymentRequest): Promise<TransactionResponse> {
    const url = `${environment.apiBaseUrl}/payments`;
    return firstValueFrom(this.http.post<TransactionResponse>(url, request));
  }

  /**
   * Get the current status of a transaction from our backend.
   */
  async getTransactionStatus(transactionId: string): Promise<TransactionResponse> {
    const url = `${environment.apiBaseUrl}/payments/${transactionId}`;
    return firstValueFrom(this.http.get<TransactionResponse>(url));
  }

  /**
   * Poll transaction status every 2 seconds until a final status is reached.
   * Final statuses: APPROVED, DECLINED, VOIDED, ERROR
   * Returns the final transaction response.
   * Throws after maxAttempts (default 60 = 2 minutes).
   */
  async pollTransactionUntilFinal(transactionId: string, maxAttempts = 60): Promise<TransactionResponse> {
    const finalStatuses = ['APPROVED', 'DECLINED', 'VOIDED', 'ERROR'];

    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.getTransactionStatus(transactionId);

      if (finalStatuses.includes(response.data.status)) {
        return response;
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Tiempo de espera agotado. La transacción sigue pendiente.');
  }

  /**
   * Poll for the async_payment_url for Bancolombia Transfer.
   * Wompi generates this URL asynchronously after creating the transaction.
   */
  async pollForAsyncPaymentUrl(transactionId: string, maxAttempts = 15): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await this.getTransactionStatus(transactionId);

      const asyncUrl = response.data.payment_method?.extra?.async_payment_url;
      if (asyncUrl) {
        return asyncUrl;
      }

      // Check if the transaction already reached a final status (error)
      if (['DECLINED', 'ERROR', 'VOIDED'].includes(response.data.status)) {
        throw new Error(response.data.status_message || 'La transacción fue rechazada.');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('No se pudo obtener la URL de pago de Bancolombia. Intenta nuevamente.');
  }
}
