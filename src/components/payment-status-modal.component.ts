import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

export type PaymentModalState = 'processing' | 'success' | 'error';

@Component({
  selector: 'app-payment-status-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-overlay" (click)="$event.stopPropagation()">
      <div class="modal-container" [class.shake]="state === 'error'">

        <!-- PROCESSING STATE -->
        @if (state === 'processing') {
          <div class="modal-content animate-fade-in">
            <div class="spinner-wrapper">
              <div class="spinner"></div>
              <span class="spinner-emoji">🍪</span>
            </div>
            <h2 class="modal-title processing-title">Procesando tu pago</h2>
            <p class="modal-message">{{ message || 'Conectando con la pasarela de pagos...' }}</p>
            <div class="progress-dots">
              <span class="dot dot-1"></span>
              <span class="dot dot-2"></span>
              <span class="dot dot-3"></span>
            </div>
            <p class="modal-hint">Por favor no cierres ni recargues esta página.</p>
          </div>
        }

        <!-- SUCCESS STATE -->
        @if (state === 'success') {
          <div class="modal-content animate-pop-in">
            <div class="success-icon-wrapper">
              <div class="success-circle">
                <svg class="checkmark" viewBox="0 0 52 52">
                  <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <!-- Confetti particles -->
              <div class="confetti confetti-1">🎉</div>
              <div class="confetti confetti-2">✨</div>
              <div class="confetti confetti-3">🎊</div>
              <div class="confetti confetti-4">⭐</div>
              <div class="confetti confetti-5">🍪</div>
              <div class="confetti confetti-6">💚</div>
            </div>
            <h2 class="modal-title success-title">¡Pago Exitoso!</h2>
            <p class="modal-message success-message">Hemos recibido tu pedido. Pronto recibirás un mensaje con los detalles de tu entrega.</p>
            @if (reference) {
              <div class="reference-badge">
                <span class="reference-label">Referencia</span>
                <span class="reference-value">{{ reference }}</span>
              </div>
            }
            <button (click)="goHome.emit()" class="modal-btn modal-btn-success">
              <span>🏠</span> Volver al Inicio
            </button>
          </div>
        }

        <!-- ERROR STATE -->
        @if (state === 'error') {
          <div class="modal-content animate-fade-in">
            <div class="error-icon-wrapper">
              <div class="error-circle">
                <svg viewBox="0 0 52 52" class="error-x">
                  <line x1="16" y1="16" x2="36" y2="36" />
                  <line x1="36" y1="16" x2="16" y2="36" />
                </svg>
              </div>
            </div>
            <h2 class="modal-title error-title">Pago no procesado</h2>
            <p class="modal-message error-message">{{ message || 'Hubo un problema al procesar tu pago. Intenta nuevamente.' }}</p>
            <div class="error-actions">
              <button (click)="retry.emit()" class="modal-btn modal-btn-retry">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" /></svg>
                Reintentar
              </button>
              <button (click)="close.emit()" class="modal-btn modal-btn-change">
                Cambiar método de pago
              </button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(58, 74, 58, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 1rem;
    }

    .modal-container {
      background: white;
      border-radius: 2rem;
      padding: 3rem 2.5rem;
      max-width: 460px;
      width: 100%;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .modal-title {
      font-size: 1.75rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .processing-title { color: #3A4A3A; }
    .success-title { color: #4A5D4A; }
    .error-title { color: #5C2E35; }

    .modal-message {
      color: #6b7280;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.6;
      max-width: 320px;
      margin-bottom: 1.5rem;
    }

    .success-message { color: #4A5D4A; }
    .error-message { color: #92400e; }

    .modal-hint {
      color: #9ca3af;
      font-size: 0.8rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }

    /* ── Spinner ── */
    .spinner-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: 1.5rem;
    }

    .spinner {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 4px solid #e0eadc;
      border-top-color: #8FA67A;
      animation: spin 1s linear infinite;
    }

    .spinner-emoji {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      animation: pulse-cookie 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-cookie {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.15); }
    }

    /* ── Progress Dots ── */
    .progress-dots {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #8FA67A;
      animation: dot-bounce 1.4s ease-in-out infinite;
    }
    .dot-1 { animation-delay: 0s; }
    .dot-2 { animation-delay: 0.2s; }
    .dot-3 { animation-delay: 0.4s; }
    @keyframes dot-bounce {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.2); }
    }

    /* ── Success Icon ── */
    .success-icon-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: 1.5rem;
    }
    .success-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8FA67A, #4A5D4A);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(143, 166, 122, 0.4);
    }
    .checkmark {
      width: 52px;
      height: 52px;
    }
    .checkmark-check {
      stroke: white;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: draw-check 0.6s ease-out 0.3s forwards;
    }
    @keyframes draw-check {
      to { stroke-dashoffset: 0; }
    }

    /* ── Confetti ── */
    .confetti {
      position: absolute;
      font-size: 1.2rem;
      animation: confetti-burst 1s ease-out forwards;
      opacity: 0;
    }
    .confetti-1 { top: 0; left: 50%; animation-delay: 0.2s; --tx: -40px; --ty: -50px; }
    .confetti-2 { top: 0; right: 0; animation-delay: 0.3s; --tx: 40px; --ty: -30px; }
    .confetti-3 { bottom: 0; left: 0; animation-delay: 0.4s; --tx: -50px; --ty: 30px; }
    .confetti-4 { bottom: 0; right: 0; animation-delay: 0.35s; --tx: 45px; --ty: 40px; }
    .confetti-5 { top: 50%; left: -10px; animation-delay: 0.25s; --tx: -55px; --ty: -10px; }
    .confetti-6 { top: 50%; right: -10px; animation-delay: 0.45s; --tx: 55px; --ty: 10px; }
    @keyframes confetti-burst {
      0% { opacity: 0; transform: translate(0, 0) scale(0); }
      50% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1.2); }
      100% { opacity: 0; transform: translate(calc(var(--tx) * 1.5), calc(var(--ty) * 1.5)) scale(0.6); }
    }

    /* ── Error Icon ── */
    .error-icon-wrapper {
      width: 100px;
      height: 100px;
      margin-bottom: 1.5rem;
    }
    .error-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C4735B, #5C2E35);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(92, 46, 53, 0.3);
    }
    .error-x {
      width: 52px;
      height: 52px;
    }
    .error-x line {
      stroke: white;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: 28;
      stroke-dashoffset: 28;
      animation: draw-x 0.4s ease-out 0.2s forwards;
    }
    .error-x line:nth-child(2) {
      animation-delay: 0.35s;
    }
    @keyframes draw-x {
      to { stroke-dashoffset: 0; }
    }

    /* ── Reference Badge ── */
    .reference-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f0f5ee;
      border: 1px solid #e0eadc;
      border-radius: 1rem;
      padding: 0.75rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .reference-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .reference-value {
      font-size: 0.9rem;
      font-weight: 800;
      color: #3A4A3A;
      letter-spacing: 0.02em;
    }

    /* ── Buttons ── */
    .modal-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .modal-btn:hover { transform: scale(1.02); }
    .modal-btn:active { transform: scale(0.98); }

    .modal-btn-success {
      background: #4A5D4A;
      color: white;
      box-shadow: 0 4px 15px rgba(74, 93, 74, 0.3);
    }
    .modal-btn-success:hover { background: #3A4A3A; }

    .modal-btn-retry {
      background: #5C2E35;
      color: white;
      box-shadow: 0 4px 15px rgba(92, 46, 53, 0.3);
    }
    .modal-btn-retry:hover { background: #7A3B44; }

    .modal-btn-change {
      background: transparent;
      color: #5C2E35;
      border: 2px solid #5C2E35;
      margin-top: 0.75rem;
    }
    .modal-btn-change:hover { background: #5C2E35; color: white; }

    .error-actions {
      width: 100%;
    }

    /* ── Animations ── */
    .animate-fade-in {
      animation: modal-fade-in 0.4s ease-out;
    }
    .animate-pop-in {
      animation: modal-pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes modal-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes modal-pop-in {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .shake {
      animation: shake 0.5s ease-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `]
})
export class PaymentStatusModalComponent {
  @Input() state: PaymentModalState = 'processing';
  @Input() message = '';
  @Input() reference = '';

  @Output() close = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();
}
