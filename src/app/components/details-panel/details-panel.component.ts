import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import type { WorkOrder } from '../../models';
import { WorkOrderStatus } from '../../models';

@Component({
  selector: 'app-details-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './details-panel.component.html',
  styleUrl: './details-panel.component.scss',
})
export class DetailsPanelComponent implements OnInit {
  private readonly fb = new FormBuilder();

  // ── Inputs ────────────────────────────────────────────────────────────
  readonly workOrder = input<WorkOrder | null>(null);
  readonly workCenterId = input.required<string>();
  readonly prefillStartDate = input<string>('');

  // ── Outputs ───────────────────────────────────────────────────────────
  readonly save = output<Partial<WorkOrder>>();
  readonly cancel = output<void>();
  readonly errorMsg = output<string>();

  // ── Local State ───────────────────────────────────────────────────────
  readonly statusOptions = Object.values(WorkOrderStatus);
  readonly statusDropdownOpen = signal(false);
  readonly openDatepicker = signal<'start' | 'end' | null>(null);
  readonly currentStatus = signal<WorkOrderStatus>(WorkOrderStatus.Open);

  // ── Form ──────────────────────────────────────────────────────────────
  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    status: [WorkOrderStatus.Open, Validators.required],
    endDate: ['', Validators.required],
    startDate: ['', Validators.required],
  });

  // ── Computed ──────────────────────────────────────────────────────────
  readonly isEditMode = computed(() => this.workOrder() !== null);
  readonly panelTitle = computed(() =>
    this.isEditMode() ? 'Work Order Details' : 'Create Work Order',
  );
  readonly actionLabel = computed(() => (this.isEditMode() ? 'Save' : 'Create'));

  readonly selectedStatusClass = computed(() => {
    const status = this.currentStatus();
    const map: Record<string, string> = {
      [WorkOrderStatus.Open]: 'status-open',
      [WorkOrderStatus.InProgress]: 'status-in-progress',
      [WorkOrderStatus.Complete]: 'status-complete',
      [WorkOrderStatus.Blocked]: 'status-blocked',
    };
    return map[status] ?? 'status-open';
  });

  ngOnInit(): void {
    const wo = this.workOrder();
    if (wo) {
      this.form.patchValue({
        name: wo.name,
        status: wo.status,
        endDate: wo.endDate,
        startDate: wo.startDate,
      });
      this.currentStatus.set(wo.status);
    } else if (this.prefillStartDate()) {
      this.form.patchValue({ startDate: this.prefillStartDate() });
    }
  }

  // ── Status Selector ───────────────────────────────────────────────────
  toggleStatusDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.statusDropdownOpen.update((v) => !v);
    this.openDatepicker.set(null); // Close any open datepicker
  }

  selectStatus(status: WorkOrderStatus): void {
    this.form.patchValue({ status });
    this.currentStatus.set(status);
    this.statusDropdownOpen.set(false);
  }

  // ── Datepicker ────────────────────────────────────────────────────────
  toggleDatepicker(field: 'start' | 'end', event: MouseEvent): void {
    event.stopPropagation();
    this.statusDropdownOpen.set(false); // Close status dropdown
    this.openDatepicker.update((v) => (v === field ? null : field));
  }

  getDateDisplay(field: 'startDate' | 'endDate'): string {
    const val = this.form.get(field)?.value;
    if (!val) return '';
    // Format ISO date string → dd.MM.yyyy
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}.${dd}.${yyyy}`;
  }

  getDatepickerModel(field: 'startDate' | 'endDate'): NgbDateStruct | null {
    const val = this.form.get(field)?.value;
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  onDateSelect(field: 'startDate' | 'endDate', date: NgbDateStruct): void {
    const mm = String(date.month).padStart(2, '0');
    const dd = String(date.day).padStart(2, '0');
    const iso = `${date.year}-${mm}-${dd}`;
    this.form.patchValue({ [field]: iso });
    this.openDatepicker.set(null);
  }

  // ── Actions ───────────────────────────────────────────────────────────
  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    if (this.form.valid) {
      const val = this.form.value;
      const wo = this.workOrder();
      this.save.emit({
        id: wo?.id ?? crypto.randomUUID(),
        name: val.name,
        status: val.status,
        startDate: val.startDate,
        endDate: val.endDate,
        workCenterId: wo?.workCenterId ?? this.workCenterId(),
      });
    } else {
      this.form.markAllAsTouched();
      this.errorMsg.emit('Please fill all required fields (Name, Start Date, End Date).');
    }
  }

  // ── Close dropdowns when clicking panel background ────────────────────
  onPanelClick(): void {
    if (this.statusDropdownOpen()) {
      this.statusDropdownOpen.set(false);
    }
    if (this.openDatepicker()) {
      this.openDatepicker.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.onCancel();
  }
}
