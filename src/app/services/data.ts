import { Injectable, signal } from '@angular/core';
import { DocEnvelope, WorkCenter, WorkOrder, WorkOrderStatus } from '../models';

/**
 * MockDataService — provides seed data for development.
 *
 * All entities are wrapped in the `DocEnvelope<T>` pattern.
 * WorkOrders are strictly linked to WorkCenters via `workCenterId`.
 */
@Injectable({ providedIn: 'root' })
export class MockDataService {
  // ── Work Centers ──────────────────────────────────────────────────────
  private readonly _workCenters = signal<DocEnvelope<WorkCenter>[]>([
    {
      docId: 'wc-001',
      docType: 'work-center',
      data: {
        id: 'wc-001',
        name: 'CNC Milling',
        description: 'Computer-controlled milling machines for precision parts',
        color: '#3E40DB',
      },
    },
    {
      docId: 'wc-002',
      docType: 'work-center',
      data: {
        id: 'wc-002',
        name: 'Laser Cutting',
        description: 'High-precision laser cutting station',
        color: '#5658FF',
      },
    },
    {
      docId: 'wc-003',
      docType: 'work-center',
      data: {
        id: 'wc-003',
        name: 'Assembly Line A',
        description: 'Primary assembly line for sub-components',
        color: '#2E7D32',
      },
    },
    {
      docId: 'wc-004',
      docType: 'work-center',
      data: {
        id: 'wc-004',
        name: 'Quality Control',
        description: 'End-of-line quality inspection station',
        color: '#E65100',
      },
    },
    {
      docId: 'wc-005',
      docType: 'work-center',
      data: {
        id: 'wc-005',
        name: 'Packaging',
        description: 'Final packaging and shipping preparation',
        color: '#6A1B9A',
      },
    },
  ]);

  // ── Work Orders ───────────────────────────────────────────────────────
  // Dates are relative to "today" so the timeline always looks populated.
  private readonly _workOrders = signal<DocEnvelope<WorkOrder>[]>(this._generateWorkOrders());

  // ── Public API ────────────────────────────────────────────────────────
  readonly workCenters = this._workCenters.asReadonly();
  readonly workOrders = this._workOrders.asReadonly();

  getWorkCenters(): DocEnvelope<WorkCenter>[] {
    return this._workCenters();
  }

  getWorkOrders(): DocEnvelope<WorkOrder>[] {
    return this._workOrders();
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  private _generateWorkOrders(): DocEnvelope<WorkOrder>[] {
    const today = new Date();

    const d = (offset: number): string => {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    };

    return [
      // WC-001: CNC Milling — 2 orders (spanning months)
      {
        docId: 'wo-001',
        docType: 'work-order',
        data: {
          id: 'wo-001',
          name: 'Shaft Batch #1201',
          workCenterId: 'wc-001',
          status: WorkOrderStatus.InProgress,
          startDate: d(-20),
          endDate: d(40),
          description: 'Machining 200 drive shafts for Q3 delivery',
        },
      },
      {
        docId: 'wo-002',
        docType: 'work-order',
        data: {
          id: 'wo-002',
          name: 'Gear Housing #0987',
          workCenterId: 'wc-001',
          status: WorkOrderStatus.InProgress,
          startDate: d(50),
          endDate: d(110),
          description: 'Milling gear housings — awaiting raw material',
        },
      },
      // WC-002: Laser Cutting — 2 orders
      {
        docId: 'wo-003',
        docType: 'work-order',
        data: {
          id: 'wo-003',
          name: 'Panel Cut #3344',
          workCenterId: 'wc-002',
          status: WorkOrderStatus.Complete,
          startDate: d(-60),
          endDate: d(-15),
          description: 'Steel panels for enclosures — completed',
        },
      },
      {
        docId: 'wo-004',
        docType: 'work-order',
        data: {
          id: 'wo-004',
          name: 'Bracket Set #5567',
          workCenterId: 'wc-002',
          status: WorkOrderStatus.InProgress,
          startDate: d(-5),
          endDate: d(55),
          description: 'Cutting mounting brackets for Assembly Line A',
        },
      },
      // WC-003: Assembly Line A — 1 order
      {
        docId: 'wo-005',
        docType: 'work-order',
        data: {
          id: 'wo-005',
          name: 'Motor Assembly #7712',
          workCenterId: 'wc-003',
          status: WorkOrderStatus.Blocked,
          startDate: d(5),
          endDate: d(65),
          description: 'Blocked — waiting for brackets from Laser Cutting',
        },
      },
      // WC-004: Quality Control — 2 orders
      {
        docId: 'wo-006',
        docType: 'work-order',
        data: {
          id: 'wo-006',
          name: 'Inspection Lot #4455',
          workCenterId: 'wc-004',
          status: WorkOrderStatus.Complete,
          startDate: d(-50),
          endDate: d(-10),
          description: 'Inspection of CNC batch — all passed',
        },
      },
      {
        docId: 'wo-007',
        docType: 'work-order',
        data: {
          id: 'wo-007',
          name: 'Inspection Lot #4460',
          workCenterId: 'wc-004',
          status: WorkOrderStatus.InProgress,
          startDate: d(10),
          endDate: d(70),
          description: 'Scheduled QC for upcoming shaft batch',
        },
      },
      // WC-005: Packaging — 1 order
      {
        docId: 'wo-008',
        docType: 'work-order',
        data: {
          id: 'wo-008',
          name: 'Ship Prep #8899',
          workCenterId: 'wc-005',
          status: WorkOrderStatus.Open,
          startDate: d(20),
          endDate: d(80),
          description: 'Packaging for client AcmeCorp shipment',
        },
      },
    ];
  }
}
