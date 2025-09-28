import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

declare var lucide: any;

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class RevenuesComponent {
  dataService = inject(DataService);

  confirmedPayments = this.dataService.getConfirmedPayments();

  totalRevenueEGP = computed(() => {
    return this.confirmedPayments()
      .filter(p => p.currency === 'EGP')
      .reduce((sum, p) => sum + p.amount, 0);
  });

  totalRevenueUSD = computed(() => {
    return this.confirmedPayments()
      .filter(p => p.currency === 'USD')
      .reduce((sum, p) => sum + p.amount, 0);
  });
  
  constructor() {
    effect(() => {
        this.confirmedPayments();
        setTimeout(() => lucide.createIcons(), 0);
    });
  }

  getCustomerName(customerId: number): string {
    return this.dataService.customers().find(c => c.id === customerId)?.name || 'غير معروف';
  }
}
