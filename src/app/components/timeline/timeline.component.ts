import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/data';
import type { DocEnvelope, WorkCenter, WorkOrder } from '../../models';
import { WorkOrderStatus } from '../../models';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';
import { DetailsPanelComponent } from '../details-panel/details-panel.component';
import { hasOverlap } from '../../utils';

// ── Types ───────────────────────────────────────────────────────────────
export type ZoomLevel = 'day' | 'week' | 'month';

export interface TimelineColumn {
  key: string;
  label: string;
  widthPx: number;
  startOffset: number;
  isCurrent: boolean; // is this the current month/week/day?
}

const MONTH_COL_WIDTH = 113; // Exact Sketch spec

const PX_PER_DAY: Record<ZoomLevel, number> = {
  day: 40,
  week: 20,
  month: MONTH_COL_WIDTH / 30, // ~3.77 px/day — derived from fixed 113px columns
};

const ZOOM_LABELS: Record<ZoomLevel, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, WorkOrderBarComponent, DetailsPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit, AfterViewInit {
  private readonly dataService = inject(MockDataService);
  private readonly elRef = inject(ElementRef);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  // ── Data ──────────────────────────────────────────────────────────────
  readonly workCenters = signal<DocEnvelope<WorkCenter>[]>([]);
  readonly workOrders = signal<DocEnvelope<WorkOrder>[]>([]);

  // ── Zoom engine ───────────────────────────────────────────────────────
  readonly zoomLevel = signal<ZoomLevel>('month');
  readonly zoomLabel = computed(() => ZOOM_LABELS[this.zoomLevel()]);
  readonly MONTHS_BUFFER = 6;

  // ── Timescale dropdown ────────────────────────────────────────────────
  readonly timescaleMenuOpen = signal(false);

  // ── Timeline data ─────────────────────────────────────────────────────
  readonly columns = signal<TimelineColumn[]>([]);
  readonly totalWidth = signal<number>(0);
  readonly todayOffset = signal<number>(0);
  private timelineStartDate!: Date;

  readonly pxPerDay = computed(() => PX_PER_DAY[this.zoomLevel()]);

  // ── UI state ──────────────────────────────────────────────────────────
  readonly hoveredRow = signal<string | null>(null);
  readonly cueLeftPx = signal<number>(0);
  readonly cueVisible = signal(false);

  // ── Panel state ───────────────────────────────────────────────────────
  readonly panelOpen = signal(false);
  readonly isClosing = signal(false); // Used to trigger CSS slide-out
  readonly panelWorkOrder = signal<WorkOrder | null>(null);
  readonly panelWorkCenterId = signal<string>('');
  readonly panelPrefillDate = signal<string>('');

  // ── Drag to Scroll ────────────────────────────────────────────────────
  readonly isDragging = signal(false);
  private startX = 0;
  private scrollLeft = 0;
  private hasDragged = false;

  // ── Error Toast ───────────────────────────────────────────────────────
  readonly toastMessage = signal<string | null>(null);
  private toastTimeout: any;

  // ── Close timescale dropdown on outside click ─────────────────────────
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.timescaleMenuOpen() && !target.closest('.timescale-selector')) {
      this.timescaleMenuOpen.set(false);
    }
  }

  constructor() {
    // Automatically persist orders whenever the signal changes
    effect(() => {
      const orders = this.workOrders();
      if (orders.length > 0) {
        localStorage.setItem('naologic_work_orders', JSON.stringify(orders));
      }
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.workCenters.set(this.dataService.getWorkCenters());

    // Load from localStorage or fallback to mock data
    const saved = localStorage.getItem('naologic_work_orders');
    if (saved) {
      try {
        this.workOrders.set(JSON.parse(saved));
      } catch (e) {
        this.workOrders.set(this.dataService.getWorkOrders());
      }
    } else {
      this.workOrders.set(this.dataService.getWorkOrders());
    }

    this._rebuildColumns();
    this._checkInitialOverlaps();
  }

  ngAfterViewInit(): void {
    this._centerOnToday();
  }

  // ── Zoom controls ─────────────────────────────────────────────────────
  toggleTimescaleMenu(): void {
    this.timescaleMenuOpen.update((v) => !v);
  }

  setZoomLevel(level: ZoomLevel): void {
    this.timescaleMenuOpen.set(false);
    if (this.zoomLevel() === level) return;
    this.zoomLevel.set(level);
    this._rebuildColumns();
    requestAnimationFrame(() => this._centerOnToday());
  }

  // ── Template helpers ──────────────────────────────────────────────────
  getOrdersForCenter(centerId: string): DocEnvelope<WorkOrder>[] {
    return this.workOrders().filter((o) => o.data.workCenterId === centerId);
  }

  onRowHover(centerId: string | null): void {
    this.hoveredRow.set(centerId);
    if (!centerId) {
      this.cueVisible.set(false);
    }
  }

  onRowMouseMove(event: MouseEvent, workCenterId: string): void {
    if (this.isDragging()) {
      this.cueVisible.set(false);
      return;
    }

    const row = event.currentTarget as HTMLElement;
    const rect = row.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    // The rectangle is 113px wide, centered on mouseX
    const rectLeft = mouseX - 56.5;
    const rectRight = mouseX + 56.5;

    // Check collision with any existing order in this row
    const orders = this.getOrdersForCenter(workCenterId);
    let collision = false;
    for (const order of orders) {
      const barLeft = this.getBarLeft(order.data);
      const barRight = barLeft + this.getBarWidth(order.data);

      // 1D overlap check
      if (rectLeft < barRight && rectRight > barLeft) {
        collision = true;
        break;
      }
    }

    if (collision) {
      this.cueVisible.set(false);
    } else {
      this.cueVisible.set(true);
      // The cue container is 130px wide, so offset by 65px to center on mouse
      this.cueLeftPx.set(mouseX - 65);
    }
  }

  getBarLeft(order: WorkOrder): number {
    const start = new Date(order.startDate);
    const diffMs = start.getTime() - this.timelineStartDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return Math.round(diffDays * this.pxPerDay());
  }

  getBarWidth(order: WorkOrder): number {
    const start = new Date(order.startDate);
    const end = new Date(order.endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24) + 1; // +1 because dates are inclusive
    return Math.max(Math.round(diffDays * this.pxPerDay()), 24); // min 24px so it remains clickable
  }

  onEditOrder(orderId: string): void {
    const envelope = this.workOrders().find((o) => o.data.id === orderId);
    if (envelope) {
      this.panelWorkOrder.set(envelope.data);
      this.panelWorkCenterId.set(envelope.data.workCenterId);
      this.panelPrefillDate.set('');
      this.panelOpen.set(true);
    }
  }

  onDeleteOrder(orderId: string): void {
    this.workOrders.update((orders) => orders.filter((o) => o.data.id !== orderId));
  }

  onEmptyClick(event: MouseEvent, workCenterId: string): void {
    if (this.hasDragged) return;
    if ((event.target as HTMLElement).closest('app-work-order-bar')) return;

    const row = event.currentTarget as HTMLElement;
    const rect = row.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    const dayOffset = clickX / this.pxPerDay();
    const clickDate = new Date(this.timelineStartDate);
    clickDate.setDate(clickDate.getDate() + Math.floor(dayOffset));
    const isoDate = clickDate.toISOString().split('T')[0];

    this.panelWorkOrder.set(null);
    this.panelWorkCenterId.set(workCenterId);
    this.panelPrefillDate.set(isoDate);
    this.panelOpen.set(true);
  }

  // ── Panel actions ────────────────────────────────────────────────────
  onPanelCancel(): void {
    this.closePanelWithAnimation();
  }

  private closePanelWithAnimation(): void {
    this.isClosing.set(true);
    setTimeout(() => {
      this.panelOpen.set(false);
      this.isClosing.set(false);
      this.panelWorkOrder.set(null);
    }, 250); // Matches the slideOut CSS animation duration
  }

  onPanelSave(data: Partial<WorkOrder>): void {
    const wo = data as WorkOrder;

    const newStart = new Date(wo.startDate).getTime();
    const newEnd = new Date(wo.endDate).getTime();

    if (newStart > newEnd) {
      this.showErrorToast('Start date cannot be after end date.');
      return;
    }

    // Check overlap
    const existingOrders = this.getOrdersForCenter(wo.workCenterId)
      .map((o) => o.data)
      .filter((o) => o.id !== wo.id); // Exclude self in edit mode

    const overlaps = hasOverlap(wo, existingOrders);
    if (overlaps.length > 0) {
      this.showErrorToast(
        'This work order overlaps with an existing order in this Work Center. Please adjust the timeline.',
      );
      return;
    }

    if (this.panelWorkOrder()) {
      // Edit mode — update existing
      this.workOrders.update((orders) =>
        orders.map((o) => (o.data.id === wo.id ? { ...o, data: { ...o.data, ...wo } } : o)),
      );
    } else {
      // Create mode — add new
      const envelope: DocEnvelope<WorkOrder> = {
        docId: wo.id,
        docType: 'work-order',
        data: wo,
      };
      this.workOrders.update((orders) => [...orders, envelope]);
    }

    this.closePanelWithAnimation();
  }

  showErrorToast(msg: string): void {
    this.toastMessage.set(msg);
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.toastMessage.set(null), 4000);
  }

  // ── Drag to Scroll Events ─────────────────────────────────────────────
  onMouseDown(e: MouseEvent): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    this.isDragging.set(true);
    this.hasDragged = false;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  onMouseLeave(): void {
    this.isDragging.set(false);
  }

  onMouseUp(): void {
    this.isDragging.set(false);
  }

  onMouseMoveGrid(e: MouseEvent): void {
    if (!this.isDragging()) return;
    e.preventDefault(); // prevent text selection while dragging
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Scroll speed multiplier

    // Only count as a drag if we moved a substantial amount
    if (Math.abs(x - this.startX) > 5) {
      this.hasDragged = true;
    }

    el.scrollLeft = this.scrollLeft - walk;
  }

  // ── Column building ───────────────────────────────────────────────────
  private _rebuildColumns(): void {
    const zoom = this.zoomLevel();
    const today = new Date();
    const ppd = PX_PER_DAY[zoom];

    this.timelineStartDate = new Date(
      today.getFullYear(),
      today.getMonth() - this.MONTHS_BUFFER,
      1,
    );
    const endDate = new Date(today.getFullYear(), today.getMonth() + this.MONTHS_BUFFER + 1, 0);

    const columns: TimelineColumn[] = [];
    let offset = 0;

    if (zoom === 'month') {
      const current = new Date(this.timelineStartDate);
      while (current <= endDate) {
        const y = current.getFullYear();
        const m = current.getMonth();
        const days = new Date(y, m + 1, 0).getDate();
        const w = MONTH_COL_WIDTH; // Fixed 113px per Sketch
        const isCurrent = y === today.getFullYear() && m === today.getMonth();
        columns.push({
          key: `${y}-${m}`,
          label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          widthPx: w,
          startOffset: offset,
          isCurrent,
        });
        offset += w;
        current.setMonth(m + 1);
      }
    } else if (zoom === 'week') {
      const current = new Date(this.timelineStartDate);
      let weekNum = 1;
      while (current <= endDate) {
        const w = 7 * ppd;
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const isCurrent = today >= current && today <= weekEnd;
        columns.push({
          key: `w-${current.toISOString().split('T')[0]}`,
          label: `W${weekNum} · ${current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          widthPx: w,
          startOffset: offset,
          isCurrent,
        });
        offset += w;
        current.setDate(current.getDate() + 7);
        weekNum++;
      }
    } else {
      const current = new Date(this.timelineStartDate);
      while (current <= endDate) {
        const isCurrent = current.toDateString() === today.toDateString();
        const narrowDay = current.toLocaleDateString('en-US', { weekday: 'narrow' });
        columns.push({
          key: `d-${current.toISOString().split('T')[0]}`,
          label: `${narrowDay} ${current.getDate()}`,
          widthPx: ppd,
          startOffset: offset,
          isCurrent,
        });
        offset += ppd;
        current.setDate(current.getDate() + 1);
      }
    }

    this.columns.set(columns);
    this.totalWidth.set(offset);

    const todayMs = today.getTime() - this.timelineStartDate.getTime();
    this.todayOffset.set(Math.round((todayMs / (1000 * 60 * 60 * 24)) * ppd));
  }

  private _centerOnToday(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    requestAnimationFrame(() => {
      // Find the current month column and scroll so it starts near the left
      const currentCol = this.columns().find((c) => c.isCurrent);
      if (currentCol) {
        el.scrollLeft = Math.max(0, currentCol.startOffset - 20);
      } else {
        el.scrollLeft = Math.max(0, this.todayOffset() - el.clientWidth / 2);
      }
    });
  }

  private _checkInitialOverlaps(): void {
    for (const wc of this.workCenters()) {
      const orders = this.getOrdersForCenter(wc.data.id).map((o) => o.data);
      for (const order of orders) {
        const collisions = hasOverlap(order, orders);
        if (collisions.length > 0) {
          console.warn(
            `[Overlap detected] "${order.name}" in "${wc.data.name}" overlaps with:`,
            collisions.map((c) => c.id),
          );
        }
      }
    }
  }
}
