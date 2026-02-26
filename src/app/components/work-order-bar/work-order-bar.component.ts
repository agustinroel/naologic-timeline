import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WorkOrder } from '../../models';
import { WorkOrderStatus } from '../../models';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './work-order-bar.component.html',
  styleUrl: './work-order-bar.component.scss',
})
export class WorkOrderBarComponent {
  private readonly elRef = inject(ElementRef);

  // ── Inputs ────────────────────────────────────────────────────────────
  readonly order = input.required<WorkOrder>();
  readonly leftPx = input.required<number>();
  readonly widthPx = input.required<number>();

  // ── Outputs ───────────────────────────────────────────────────────────
  readonly editOrder = output<string>();
  readonly deleteOrder = output<string>();

  // ── Local state ───────────────────────────────────────────────────────
  readonly hovered = signal(false);
  readonly menuOpen = signal(false);

  // ── Computed ──────────────────────────────────────────────────────────
  readonly statusClass = computed(() => {
    const map: Record<string, string> = {
      [WorkOrderStatus.InProgress]: 'status-in-progress',
      [WorkOrderStatus.Complete]: 'status-complete',
      [WorkOrderStatus.Blocked]: 'status-blocked',
    };
    return map[this.order().status] ?? 'status-in-progress';
  });

  // ── Close menu when clicking outside ──────────────────────────────────
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.menuOpen() && !this.elRef.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  // ── Close menu when another WorkOrderBar opens its menu ───────────────
  @HostListener('window:wo-menu-close', ['$event'])
  onOtherMenuOpen(event: Event): void {
    const detail = (event as CustomEvent).detail;
    if (this.menuOpen() && detail !== this.order().id) {
      this.menuOpen.set(false);
    }
  }

  // ── Handlers ──────────────────────────────────────────────────────────
  onMouseEnter(): void {
    this.hovered.set(true);
  }

  onMouseLeave(): void {
    this.hovered.set(false);
    // Don't close menu on mouse leave — user might be moving to the dropdown
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    const willOpen = !this.menuOpen();
    if (willOpen) {
      // Close any other open menus first
      window.dispatchEvent(new CustomEvent('wo-menu-close', { detail: this.order().id }));
    }
    this.menuOpen.set(willOpen);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    this.editOrder.emit(this.order().id);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    this.deleteOrder.emit(this.order().id);
  }
}
