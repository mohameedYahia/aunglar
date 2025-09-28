import { Injectable, signal, computed } from '@angular/core';
import { Customer, CustomerDetails, Invoice, Land, Payment, HistoryLogEntry, WarningTemplate } from '../models/data.models';

const INITIAL_STATE = {
    currentUser: 'أحمد علي',
    today: new Date(),
    warningTemplate: {
        content: `<div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 1px solid #ccc; padding-bottom: 1rem; margin-bottom: 1rem;">
            <div style="text-align: center;">
                <img id="template-fund-logo-preview" src="https://placehold.co/80x80/e2e8f0/64748b?text=شعار+الصندوق" alt="شعار الصندوق" style="height: 80px; margin-bottom: 0.5rem;">
                <p style="font-weight: bold;">محافظة الوادي الجديد</p>
                <p>صندوق استصلاح الأراضي</p>
            </div>
            <div style="text-align: center;">
                <img id="template-gov-logo-preview" src="https://placehold.co/80x80/e2e8f0/64748b?text=شعار+المحافظة" alt="شعار المحافظة" style="height: 80px; margin-bottom: 0.5rem;">
            </div>
        </div>
        <div class="text-right mb-4"><p><span class="font-bold">السادة /</span> [clientName]</p><p><span class="font-bold">العنوان :</span> [clientAddress]</p></div><p class="mb-4">تحيه طيبه وبعد،،،</p><div class="text-center mb-4"><h5 class="font-bold text-xl underline">انذار بخطاب علم الوصول</h5></div><p class="mb-4">بالإحاطة الى الأرض التي تم تخصيصها لكم بمساحة <span class="font-bold">[area]</span> فدان بمركز <span class="font-bold">[center]</span> وأنه توجد مستحقات مالية لدى شركتكم بلغت <span class="font-bold">[amountOverdue]</span> جنيه.</p><p class="mb-4">لذا ننذركم أنه:</p><ul class="list-disc list-inside space-y-2 mb-4"><li>يتعين عليكم سداد مستحقات الدولة طرفكم والتي تقدر بمبلغ <span class="font-bold">[amountOverdue]</span> جنيه.</li><li>في حالة عدم السداد او الجدولة قبل تاريخ <span class="font-bold">[deadline]</span> سيتم اتخاذ الإجراءات القانونية وسحب الأرض.</li><li>وكذا تحرير محاضر جنائية بالتعدي على أراضي الدولة وعدم سداد المستحقات المالية.</li></ul><p class="mb-6">وتفضلوا قبول وافر الاحترام والتقدير،،،،،</p><div class="grid grid-cols-2 gap-8 text-center text-sm mt-8"><div><p class="font-bold">باحث مشروعات</p><p>محمد حمود</p></div><div><p class="font-bold">حسابات الصندوق</p><p>مجدي جهلان</p></div><div class="col-span-2 mt-4"><p class="font-bold">يعتمد / مدير صندوق الاراضي</p><p>محمود علی عمران</p></div></div>`
    },
    // FIX: Explicitly cast the customers array to Customer[] to satisfy TypeScript's strict literal type checking.
    customers: [
        { id: 1, name: 'شركة البناء الحديثة', landCount: 2, investorType: 'شركة', mechanism: 'مزاد علني', currency: 'EGP', center: 'الخارجة' },
        { id: 2, name: 'مؤسسة الصحراء للتجارة', landCount: 1, investorType: 'فرد', mechanism: 'أمر مباشر', currency: 'USD', center: 'الداخلة' },
        { id: 3, name: 'مجموعة الأفق الاستثمارية', landCount: 1, investorType: 'شركة', mechanism: 'مبادرة', currency: 'EGP', center: 'الفرافرة' },
    ] as Customer[],
    customerDetails: {
        1: { investorType: 'شركة', fileNumber: 'C-2023-101', companyNationality: 'مصرية', partnersNationality: 'مصرية', address: '123 شارع الجمهورية, القاهرة', email: 'contact@modern.com', companyPhone: '0225678901', commercialRegNum: '12345', commercialRegExpiry: '2028-12-31', taxCardNum: '54321-A', taxCardExpiry: '2027-10-15', issuingAuthority: 'مكتب استثمار القاهرة', companyActivity: 'مقاولات عامة وتوريدات', chairman: { name: 'أحمد محمود', phone: '01001234567' }, partners: [{ name: 'محمد خالد', phone: '01112345678' }], notes: 'تم التواصل مع العميل بتاريخ 2024-07-29 ووعد بالسداد خلال أسبوع.', lands: [
            { landId: 'LND-01A', mechanism: 'مزاد علني', basicInfo: { receiveDate: '2023-03-01', auctionSessionDate: '2023-02-15' }, auctionInfo: { landArea: 100, landLocation: 'شمال المدينة الصناعية' }, currency: 'EGP', baseRent: 150000, financials: { feddanValue: 200000, feddanRentalValue: 1500, insurance: 20000 } },
            { landId: 'LND-01B', mechanism: 'مزاد علني', basicInfo: { receiveDate: '2023-10-01', auctionSessionDate: '2023-09-20' }, auctionInfo: { landArea: 50, landLocation: 'غرب المنطقة الحرة' }, currency: 'EGP', baseRent: 90000, financials: { feddanValue: 220000, feddanRentalValue: 1800, insurance: 22000 }  }
        ]},
        2: { investorType: 'فرد', nationalId: '28504032100123', phone: '01223456789', email: 'investor2@example.com', mailingAddress: 'ص.ب 150, الداخلة, الوادي الجديد', notes: '', lands: [
            { landId: 'LND-02A', mechanism: 'أمر مباشر', basicInfo: { receiveDate: '2023-01-01' }, auctionInfo: { landArea: 20, landLocation: 'المنطقة الحرة' }, currency: 'USD', baseRent: 5000, financials: { feddanValue: 3000, feddanRentalValue: 250, insurance: 600 } }
        ]},
        3: { investorType: 'شركة', chairman: {name: 'N/A', phone: 'N/A'}, partners: [], address: 'N/A', lands: [{ landId: 'LND-03A', mechanism: 'مبادرة', financials: {feddanRentalValue: 1100, feddanValue: 100000, insurance: 10000}, auctionInfo: {landArea: 70, landLocation: 'شرق بلاط'}, basicInfo: {receiveDate: '2022-05-10'}, baseRent: 77000, currency: 'EGP' }], notes:'' },
    } as {[key: number]: CustomerDetails},
    invoices: [
        { id: 'INV-001', customerId: 2, landId: 'LND-02A', description: 'قيمة ايجارية سنوية 2024', dueDate: '2024-07-01', originalAmount: 5000, currency: 'USD', reminderLog: [], status: 'pending' },
        { id: 'INV-002', customerId: 1, landId: 'LND-01A', description: 'قيمة ايجارية سنوية 2024', dueDate: '2024-07-11', originalAmount: 150000, currency: 'EGP', reminderLog: [{user: 'النظام الآلي', date: '2024-07-10T10:00:00Z'}], status: 'pending' },
        { id: 'INV-003', customerId: 1, landId: 'LND-01B', description: 'قيمة ايجارية سنوية 2024', dueDate: '2024-08-01', originalAmount: 90000, currency: 'EGP', reminderLog: [], status: 'pending' },
        { id: 'INV-004', customerId: 3, landId: 'LND-03A', description: 'قيمة ايجارية سنوية 2024', dueDate: '2024-06-15', originalAmount: 77000, currency: 'EGP', reminderLog: [], status: 'pending' },
        { id: 'INV-005', customerId: 1, landId: 'LND-01A', description: 'تأمين ابتدائي', dueDate: '2023-02-20', originalAmount: 20000, currency: 'EGP', reminderLog: [], status: 'paid' },
    ] as Invoice[],
    payments: [
        { paymentId: 'PAY-001', invoiceId: 'INV-005', customerId: 1, landId: 'LND-01A', paymentDate: '2023-02-20', amount: 20000, currency: 'EGP', method: 'تحويل بنكي', description: 'تأمين ابتدائي', details: { bankName: 'بنك مصر', transferId: 'TRN584399' }, documentUrl: '#', notes: 'تم استلام المبلغ وتأكيد التحويل.', status: 'confirmed' },
        { paymentId: 'PAY-002', invoiceId: 'INV-002', customerId: 1, landId: 'LND-01A', paymentDate: '2024-07-20', amount: 100000, currency: 'EGP', method: 'شيك', description: 'قيمة ايجارية سنوية 2024', details: { chequeNumber: 'CHK100548', dueDate: '2024-07-20' }, documentUrl: '#', notes: 'الشيك تحت التحصيل.', status: 'confirmed' },
        { paymentId: 'PAY-003', invoiceId: null, customerId: 2, landId: 'LND-02A', paymentDate: '2023-01-05', amount: 500, currency: 'USD', method: 'نقدي', description: 'رسوم جدية الطلب', details: {}, documentUrl: '#', notes: '', status: 'confirmed' },
        { paymentId: 'PAY-004', invoiceId: null, customerId: 2, landId: 'LND-02A', paymentDate: '2023-01-06', amount: 100, currency: 'USD', method: 'نقدي', description: 'الرسم الكروكي', details: {}, documentUrl: '#', notes: '', status: 'confirmed' },
        { paymentId: 'PAY-005', invoiceId: null, customerId: 3, landId: 'LND-03A', paymentDate: '2022-05-12', amount: 1000, currency: 'EGP', method: 'نقدي', description: 'رسوم تبرع', details: {}, documentUrl: '#', notes: '', status: 'confirmed' },
    ] as Payment[],
    historyLog: [] as HistoryLogEntry[],
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private state = {
    currentUser: signal(INITIAL_STATE.currentUser),
    today: signal(INITIAL_STATE.today),
    warningTemplate: signal<WarningTemplate>(INITIAL_STATE.warningTemplate),
    customers: signal<Customer[]>(INITIAL_STATE.customers),
    customerDetails: signal<{[key: number]: CustomerDetails}>(INITIAL_STATE.customerDetails),
    invoices: signal<Invoice[]>(INITIAL_STATE.invoices),
    payments: signal<Payment[]>(INITIAL_STATE.payments),
    historyLog: signal<HistoryLogEntry[]>(INITIAL_STATE.historyLog),
  };

  // --- Public Signals (Read-only) ---
  currentUser = this.state.currentUser.asReadonly();
  customers = this.state.customers.asReadonly();
  // FIX: Expose customerDetails signal to be used in components.
  customerDetails = this.state.customerDetails.asReadonly();
  invoices = this.state.invoices.asReadonly();
  payments = this.state.payments.asReadonly();
  historyLog = this.state.historyLog.asReadonly();
  warningTemplate = this.state.warningTemplate.asReadonly();
  // FIX: Expose the `today` signal to make it accessible in components.
  today = this.state.today.asReadonly();
  
  // --- Selectors ---
  getCustomerById(id: number) {
    return computed(() => this.state.customers().find(c => c.id === id));
  }

  getCustomerDetailsById(id: number) {
    return computed(() => this.state.customerDetails()[id]);
  }

  getInvoicesByCustomerId(customerId: number) {
    return computed(() => this.state.invoices().filter(inv => inv.customerId === customerId));
  }
  
  getPaymentsByCustomerId(customerId: number) {
      return computed(() => this.state.payments().filter(p => p.customerId === customerId));
  }

  getPaymentById(paymentId: string) {
    return computed(() => this.state.payments().find(p => p.paymentId === paymentId));
  }
  
  getOverdueInvoices() {
    return computed(() => this.state.invoices().filter(inv => 
        inv.status !== 'reviewed' && 
        inv.status !== 'paid' &&
        new Date(inv.dueDate) < this.state.today()
    ));
  }

  getPaymentsForConfirmation() {
    return computed(() => this.state.payments().filter(p => p.status === 'pending_review'));
  }

  getConfirmedPayments() {
      return computed(() => this.state.payments().filter(p => p.status === 'confirmed'));
  }

  // --- Business Logic & Helpers ---
  formatCurrency(amount: number, currency: string = 'EGP'): string {
    return (amount || 0).toLocaleString('ar-EG', { style: 'currency', currency: currency, minimumFractionDigits: 2 });
  }

  calculateDelayDays(dueDateString: string, paymentDateString: string | Date): number {
    const dueDate = new Date(dueDateString);
    const paymentDate = new Date(paymentDateString);
    if (paymentDate <= dueDate) return 0;
    return Math.ceil(Math.abs(paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  getPaidAmountForInvoice(invoiceId: string | null): number {
    if (!invoiceId) return 0;
    return this.state.payments()
        .filter(p => p.invoiceId === invoiceId && p.status !== 'rejected')
        .reduce((sum, p) => sum + p.amount, 0);
  }

  getInvoiceDisplayStatus(invoice: Invoice): string {
    if (invoice.status === 'paid') return 'مدفوع';
    if (invoice.status === 'reviewed') return 'مؤرشف';
    if (invoice.status === 'awaiting_confirmation') return 'قيد المراجعة';
    const paidAmount = this.getPaidAmountForInvoice(invoice.id);
    if (new Date(invoice.dueDate) < this.state.today()) return paidAmount > 0 ? 'متأخر (جزئي)' : 'متأخر';
    return paidAmount > 0 ? 'جزئي' : 'قادم';
  }

  getCustomerOverallStatus(customerId: number): string {
    const hasOverdue = this.state.invoices().some(inv => inv.customerId === customerId && this.getInvoiceDisplayStatus(inv).includes('متأخر'));
    if (!hasOverdue) return 'منتظم';
    const hasPaid = this.state.payments().some(p => p.customerId === customerId);
    return hasPaid ? 'متخلف جزئياً' : 'متخلف كلياً';
  }

  // --- Actions (Mutations) ---
  addPayment(paymentData: {
    invoiceId: string;
    amount: number;
    method: 'تحويل بنكي' | 'شيك' | 'نقدي';
    details: any;
    notes: string;
    paymentDate: string;
  }) {
    const invoice = this.invoices().find(inv => inv.id === paymentData.invoiceId);
    if (!invoice) return;

    const newPayment: Payment = {
      paymentId: `PAY-${String(Date.now()).slice(-6)}`,
      invoiceId: paymentData.invoiceId,
      customerId: invoice.customerId,
      landId: invoice.landId,
      paymentDate: paymentData.paymentDate,
      amount: paymentData.amount,
      currency: invoice.currency,
      method: paymentData.method,
      description: `سداد دفعة من فاتورة ${paymentData.invoiceId}`,
      details: paymentData.details,
      documentUrl: '#',
      notes: paymentData.notes,
      status: 'pending_review',
    };

    this.state.payments.update(payments => [...payments, newPayment]);

    this.state.invoices.update(invoices => {
        const targetInvoice = invoices.find(inv => inv.id === paymentData.invoiceId);
        if (targetInvoice) {
            targetInvoice.status = 'awaiting_confirmation';
        }
        return [...invoices];
    });
  }

  addAdvancePayment(paymentData: {
    customerId: number;
    landId: string;
    amount: number;
    method: 'تحويل بنكي' | 'شيك' | 'نقدي';
    details: any;
    notes: string;
    paymentDate: string;
    description: string;
    currency: 'EGP' | 'USD';
  }) {
    const newPayment: Payment = {
      paymentId: `PAY-${String(Date.now()).slice(-6)}`,
      invoiceId: null,
      customerId: paymentData.customerId,
      landId: paymentData.landId,
      paymentDate: paymentData.paymentDate,
      amount: paymentData.amount,
      currency: paymentData.currency,
      method: paymentData.method,
      description: paymentData.description,
      details: paymentData.details,
      documentUrl: '#',
      notes: paymentData.notes,
      status: 'pending_review',
    };
    
    this.state.payments.update(payments => [...payments, newPayment]);
  }

  confirmPayment(paymentId: string) {
    const paymentToConfirm = this.state.payments().find(p => p.paymentId === paymentId);
    if (!paymentToConfirm) return;

    this.state.payments.update(payments => {
        const payment = payments.find(p => p.paymentId === paymentId);
        if (payment) {
            payment.status = 'confirmed';
        }
        return [...payments];
    });
    
    if (paymentToConfirm.invoiceId) {
        this.state.invoices.update(invoices => {
            const invoice = invoices.find(inv => inv.id === paymentToConfirm.invoiceId);
            if(invoice) {
                const totalPaid = this.getPaidAmountForInvoice(invoice.id);
                if (totalPaid >= invoice.originalAmount) {
                    invoice.status = 'paid';
                } else {
                    invoice.status = 'pending'; // Back to pending if partially paid
                }
            }
            return [...invoices];
        });
    }
  }

  rejectPayment(paymentId: string, reason: string) {
    const paymentToReject = this.state.payments().find(p => p.paymentId === paymentId);
    if (!paymentToReject) return;

    this.state.payments.update(payments => {
        const payment = payments.find(p => p.paymentId === paymentId);
        if (payment) {
            payment.status = 'rejected';
            payment.notes = `تم الرفض: ${reason}\n${payment.notes}`;
        }
        return [...payments];
    });

    if (paymentToReject.invoiceId) {
        this.state.invoices.update(invoices => {
            const invoice = invoices.find(inv => inv.id === paymentToReject.invoiceId);
            if(invoice) {
                invoice.status = 'pending'; // Revert invoice status
            }
            return [...invoices];
        });
    }
  }

  updatePayment(updatedPaymentData: Partial<Payment> & { paymentId: string }) {
      this.state.payments.update(payments => {
          const index = payments.findIndex(p => p.paymentId === updatedPaymentData.paymentId);
          if (index > -1) {
              payments[index] = { ...payments[index], ...updatedPaymentData };
          }
          return [...payments];
      });
  }

  addReminder(invoiceId: string) {
    this.state.invoices.update(invoices => {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        invoice.reminderLog.push({ user: this.state.currentUser(), date: new Date().toISOString() });
      }
      return [...invoices];
    });
    this.state.historyLog.update(log => [
        ...log, 
        { id: Date.now(), invoiceId, type: 'reminder', user: this.state.currentUser(), timestamp: new Date().toLocaleString('ar-EG') }
    ]);
  }

  addWarning(invoiceId: string, deliveryMethods: string[], deadline: string, content: string) {
    this.state.historyLog.update(log => [
        ...log, 
        { 
            id: Date.now(), 
            invoiceId, 
            type: 'warning', 
            user: this.state.currentUser(), 
            timestamp: new Date().toLocaleString('ar-EG'), 
            deliveryMethods,
            deadline,
            content
        }
    ]);
  }

  updateCustomerNotes(customerId: number, notes: string) {
    this.state.customerDetails.update(details => {
        if(details[customerId]) {
            details[customerId].notes = notes;
        }
        return {...details};
    });
  }

  updateWarningTemplate(content: string) {
      this.state.warningTemplate.update(template => ({...template, content}));
  }
}