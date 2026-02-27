import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DetailsPanelComponent } from './details-panel.component';
import { WorkOrderStatus } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

describe('DetailsPanelComponent', () => {
  let component: DetailsPanelComponent;
  let fixture: ComponentFixture<DetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPanelComponent, ReactiveFormsModule, NgbDatepickerModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPanelComponent);
    component = fixture.componentInstance;
    // Set required input
    fixture.componentRef.setInput('workCenterId', 'wc-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode by default', () => {
    expect(component.isEditMode()).toBe(false);
    expect(component.panelTitle()).toBe('Create Work Order');
    expect(component.actionLabel()).toBe('Create');
  });

  it('should initialize in edit mode when workOrder is provided', () => {
    // We need to re-initialize or call ngOnInit manually if we set input after first detectChanges
    fixture.componentRef.setInput('workOrder', {
      id: 'wo-1',
      name: 'Existing Order',
      workCenterId: 'wc-1',
      status: WorkOrderStatus.InProgress,
      startDate: '2026-01-01',
      endDate: '2026-01-10',
    });
    component.ngOnInit(); // Force form patch
    fixture.detectChanges();

    expect(component.isEditMode()).toBe(true);
    expect(component.panelTitle()).toBe('Work Order Details');
    expect(component.form.value.name).toBe('Existing Order');
  });

  it('should prefill startDate when creating new order', () => {
    fixture.componentRef.setInput('prefillStartDate', '2026-05-05');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.value.startDate).toBe('2026-05-05');
  });

  it('should mark all as touched and emit error if form is invalid on save', () => {
    const spy = vi.spyOn(component.errorMsg, 'emit');
    component.onSave();
    expect(spy).toHaveBeenCalledWith(
      'Please fill all required fields (Name, Start Date, End Date).',
    );
  });

  it('should emit save event if form is valid', () => {
    const spy = vi.spyOn(component.save, 'emit');
    component.form.patchValue({
      name: 'New Test Order',
      status: WorkOrderStatus.Open,
      startDate: '2026-02-01',
      endDate: '2026-02-05',
    });

    component.onSave();
    expect(spy).toHaveBeenCalled();
    const emitted = spy.mock.calls[0][0];
    expect(emitted.name).toBe('New Test Order');
    expect(emitted.workCenterId).toBe('wc-1');
  });

  it('should emit cancel event on cancel', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle status dropdown', () => {
    const event = new MouseEvent('click');
    expect(component.statusDropdownOpen()).toBe(false);
    component.toggleStatusDropdown(event);
    expect(component.statusDropdownOpen()).toBe(true);
  });

  it('should select status and close dropdown', () => {
    component.selectStatus(WorkOrderStatus.Complete);
    expect(component.form.get('status')?.value).toBe(WorkOrderStatus.Complete);
    expect(component.statusDropdownOpen()).toBe(false);
  });
});
