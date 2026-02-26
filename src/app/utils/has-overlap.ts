import type { WorkOrder } from '../models';

/**
 * Checks whether a new work order overlaps with any existing orders
 * in the same Work Center.
 *
 * Collision formula (from BUSINESS_LOGIC §2):
 *   (newStart < existingEnd) && (newEnd > existingStart)
 *
 * @param newOrder        The work order being created or edited.
 * @param existingOrders  All existing orders in the SAME Work Center (excludes newOrder if editing).
 * @returns               Array of overlapping orders (empty = no collision).
 */
export function hasOverlap(
  newOrder: Pick<WorkOrder, 'startDate' | 'endDate' | 'id'>,
  existingOrders: ReadonlyArray<Pick<WorkOrder, 'startDate' | 'endDate' | 'id'>>,
): Pick<WorkOrder, 'startDate' | 'endDate' | 'id'>[] {
  const newStart = new Date(newOrder.startDate).getTime();
  const newEnd = new Date(newOrder.endDate).getTime();

  return existingOrders.filter((existing) => {
    if (existing.id === newOrder.id) return false; // skip self when editing
    const existingStart = new Date(existing.startDate).getTime();
    const existingEnd = new Date(existing.endDate).getTime();
    return newStart < existingEnd && newEnd > existingStart;
  });
}
