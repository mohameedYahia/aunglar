import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ModalService } from '../../services/modal.service';
import { Payment } from '../../models/data.models';

declare var lucide: any;

@Component({
  selector: 'app-payment-confirmations',
  imports: [CommonModule],
  templateUrl: './payment-confirmations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentConfirmationsComponent {
  dataService = inject(DataService);
  modalService = inject(ModalService);

  pendingPayments = this.dataService.getPaymentsForConfirmation();

  constructor() {
    effect(() => {
        this.pendingPayments();
        setTimeout(() => lucide.createIcons(), 0);
    });
  }

  getCustomerName(customerId: number): string {
    return this.dataService.customers().find(c => c.id === customerId)?.name || 'غير معروف';
  }
  
  openConfirmModal(payment: Payment) {
    this.modalService.open('paymentConfirmation', payment);
  }

  openRejectModal(payment: Payment) {
    this.modalService.open('paymentRejection', payment);
  }

  openEditModal(payment: Payment) {
    this.modalService.open('paymentEdit', payment);
  }
}
