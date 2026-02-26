/**
 * Generic document envelope following the Naologic data architecture pattern.
 * Every entity (WorkCenter, WorkOrder, etc.) is wrapped in this envelope.
 */
export interface DocEnvelope<T> {
  readonly docId: string;
  readonly docType: string;
  readonly data: T;
}
