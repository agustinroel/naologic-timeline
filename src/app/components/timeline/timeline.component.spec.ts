import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TimelineComponent } from './timeline.component';
import { MockDataService } from '../../services/data';
import { WorkOrderStatus } from '../../models';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
      providers: [MockDataService, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial data from service', () => {
    expect(component.workCenters().length).toBeGreaterThan(0);
    expect(component.workOrders().length).toBeGreaterThan(0);
  });

  it('should change zoom level and rebuild columns', () => {
    const initialColumns = component.columns().length;
    component.setZoomLevel('day');
    fixture.detectChanges();

    expect(component.zoomLevel()).toBe('day');
    expect(component.columns().length).not.toBe(initialColumns);
  });

  it('should calculate bar left and width correctly', () => {
    const mockWO = {
      id: 'test',
      name: 'Test',
      workCenterId: 'wc-1',
      status: WorkOrderStatus.Open,
      startDate: '2026-02-01',
      endDate: '2026-02-05',
    };

    const left = component.getBarLeft(mockWO);
    const width = component.getBarWidth(mockWO);

    expect(left).toBeDefined();
    expect(width).toBeGreaterThan(0);
  });

  it('should open details panel in create mode when clicking empty area', () => {
    const mockTarget = {
      closest: vi.fn().mockReturnValue(null),
    };
    const mockRow = {
      getBoundingClientRect: vi.fn().mockReturnValue({ left: 0, top: 0, width: 1000, height: 100 }),
    };
    const event = {
      target: mockTarget,
      currentTarget: mockRow,
      clientX: 500,
    } as unknown as MouseEvent;

    component.onEmptyClick(event, 'wc-1');

    expect(component.panelOpen()).toBe(true);
    expect(component.panelWorkOrder()).toBe(null);
    expect(component.panelWorkCenterId()).toBe('wc-1');
    expect(component.panelPrefillDate()).toBeTruthy();
  });

  it('should open details panel in edit mode', () => {
    const orderId = component.workOrders()[0].data.id;
    component.onEditOrder(orderId);

    expect(component.panelOpen()).toBe(true);
    expect(component.panelWorkOrder()?.id).toBe(orderId);
  });

  it('should delete work order', () => {
    const initialCount = component.workOrders().length;
    const orderId = component.workOrders()[0].data.id;

    component.onDeleteOrder(orderId);
    expect(component.workOrders().length).toBe(initialCount - 1);
  });

  it('should close panel with animation delay', () => {
    vi.useFakeTimers();
    component.panelOpen.set(true);
    component.onPanelCancel();

    expect(component.isClosing()).toBe(true);
    expect(component.panelOpen()).toBe(true);

    vi.advanceTimersByTime(250);
    expect(component.isClosing()).toBe(false);
    expect(component.panelOpen()).toBe(false);
  });

  it('should add new work order on save', () => {
    const initialCount = component.workOrders().length;
    const newWO = {
      id: 'new-id',
      name: 'New Order',
      workCenterId: 'wc-001',
      status: WorkOrderStatus.Open,
      startDate: '2026-10-01',
      endDate: '2026-10-05',
    };

    component.onPanelSave(newWO);
    expect(component.workOrders().length).toBe(initialCount + 1);
  });

  it('should update existing work order on save', () => {
    const firstOrder = component.workOrders()[0].data;
    component.panelWorkOrder.set(firstOrder);

    const updated = { ...firstOrder, name: 'Updated Name' };
    component.onPanelSave(updated);

    const found = component.workOrders().find((o) => o.data.id === firstOrder.id);
    expect(found?.data.name).toBe('Updated Name');
  });

  it('should show error toast on invalid dates or overlap', () => {
    const spy = vi.spyOn(component, 'showErrorToast');

    // Invalid dates
    component.onPanelSave({
      startDate: '2026-02-10',
      endDate: '2026-02-05',
    });
    expect(spy).toHaveBeenCalledWith('Start date cannot be after end date.');
  });
});
