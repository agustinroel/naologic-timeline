/**
 * All possible statuses for a Work Order.
 * Maps directly to the status badge color scheme in the styling guide.
 */
export enum WorkOrderStatus {
  Open = 'Open',
  InProgress = 'In progress',
  Complete = 'Complete',
  Blocked = 'Blocked',
}

/**
 * Represents a single Work Order assigned to a Work Center.
 * The `workCenterId` field strictly links this order to its parent Work Center.
 */
export interface WorkOrder {
  readonly id: string;
  readonly name: string;
  readonly workCenterId: string;
  readonly status: WorkOrderStatus;
  readonly startDate: string; // ISO 8601 date string (YYYY-MM-DD)
  readonly endDate: string; // ISO 8601 date string (YYYY-MM-DD)
  readonly description?: string;
}
