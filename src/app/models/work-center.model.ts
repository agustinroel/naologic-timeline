/**
 * Represents a physical or logical Work Center where Work Orders are scheduled.
 */
export interface WorkCenter {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly color: string;
}
