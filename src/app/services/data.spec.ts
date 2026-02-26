import { TestBed } from '@angular/core/testing';
import { MockDataService } from './data';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 5 work centers', () => {
    expect(service.getWorkCenters().length).toBe(5);
  });

  it('should return 8 work orders', () => {
    expect(service.getWorkOrders().length).toBe(8);
  });

  it('every work order should reference a valid work center id', () => {
    const centerIds = new Set(service.getWorkCenters().map((wc) => wc.data.id));
    for (const order of service.getWorkOrders()) {
      expect(centerIds.has(order.data.workCenterId)).toBe(true);
    }
  });

  it('all four statuses should be represented', () => {
    const statuses = new Set(service.getWorkOrders().map((o) => o.data.status));
    expect(statuses.has('Open')).toBe(true);
    expect(statuses.has('In Progress')).toBe(true);
    expect(statuses.has('Complete')).toBe(true);
    expect(statuses.has('Blocked')).toBe(true);
  });
});
