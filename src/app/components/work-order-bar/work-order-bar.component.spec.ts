import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { WorkOrderBarComponent } from './work-order-bar.component';
import { WorkOrderStatus } from '../../models';
import { By } from '@angular/platform-browser';

describe('WorkOrderBarComponent', () => {
  let component: WorkOrderBarComponent;
  let fixture: ComponentFixture<WorkOrderBarComponent>;

  const mockOrder = {
    id: 'wo-1',
    name: 'Test Order',
    workCenterId: 'wc-1',
    status: WorkOrderStatus.InProgress,
    startDate: '2026-01-01',
    endDate: '2026-01-05',
    description: 'Test Desc',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkOrderBarComponent);
    component = fixture.componentInstance;

    // Set inputs
    fixture.componentRef.setInput('order', mockOrder);
    fixture.componentRef.setInput('leftPx', 100);
    fixture.componentRef.setInput('widthPx', 250);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply correct CSS classes based on status', () => {
    expect(component.statusClass()).toBe('status-in-progress');

    fixture.componentRef.setInput('order', { ...mockOrder, status: WorkOrderStatus.Complete });
    fixture.detectChanges();
    expect(component.statusClass()).toBe('status-complete');

    fixture.componentRef.setInput('order', { ...mockOrder, status: WorkOrderStatus.Blocked });
    fixture.detectChanges();
    expect(component.statusClass()).toBe('status-blocked');
  });

  it('should toggle menu on click', () => {
    const event = new MouseEvent('click');
    expect(component.menuOpen()).toBe(false);
    component.toggleMenu(event);
    expect(component.menuOpen()).toBe(true);
    component.toggleMenu(event);
    expect(component.menuOpen()).toBe(false);
  });

  it('should emit editOrder when onEdit is called', () => {
    const spy = vi.spyOn(component.editOrder, 'emit');
    const event = new MouseEvent('click');
    component.onEdit(event);
    expect(spy).toHaveBeenCalledWith('wo-1');
    expect(component.menuOpen()).toBe(false);
  });

  it('should emit deleteOrder when onDelete is called', () => {
    const spy = vi.spyOn(component.deleteOrder, 'emit');
    const event = new MouseEvent('click');
    component.onDelete(event);
    expect(spy).toHaveBeenCalledWith('wo-1');
    expect(component.menuOpen()).toBe(false);
  });

  it('should close menu on outside click', () => {
    component.menuOpen.set(true);
    fixture.detectChanges();

    // Simulate outside click
    document.dispatchEvent(new MouseEvent('click'));
    expect(component.menuOpen()).toBe(false);
  });

  it('should close menu when wo-menu-close event for different ID is received', () => {
    component.menuOpen.set(true);
    fixture.detectChanges();

    window.dispatchEvent(new CustomEvent('wo-menu-close', { detail: 'other-id' }));
    expect(component.menuOpen()).toBe(false);
  });

  it('should stay open when wo-menu-close event for same ID is received', () => {
    component.menuOpen.set(true);
    fixture.detectChanges();

    window.dispatchEvent(new CustomEvent('wo-menu-close', { detail: 'wo-1' }));
    expect(component.menuOpen()).toBe(true);
  });
});
