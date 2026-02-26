# Business Logic & Functional Specification

**Tech Stack**: Angular 21, Reactive Forms, SCSS, ng-bootstrap.

## 1. Timeline Engine

- **Zoom Levels**:
  - **Day**: 1 column = 24 segments. Header displays individual days.
  - **Week**: 1 column = 7 days. Header displays week numbers.
  - **Month**: 1 column = 1 month. Header displays month names (Default View).
- **Center on Today**: On load, the timeline must center horizontally on the current date.

## 2. Work Order Constraints

- **Overlap Detection (Strict)**: Prevention logic for multiple orders in the same Work Center simultaneously.
- **Collision Formula**: `(NewStart < ExistingEnd) && (NewEnd > ExistingStart)`.
- **Date Picking**: End Date MUST be after Start Date. Start Date is pre-filled based on click position.

## 3. State & Persistence

- **Reactive Forms**: Use `FormGroup` for the details panel.
- **Data Persistence**: Implement `localStorage` to save work orders across refreshes (Bonus Requirement).
- **Data Structure**: Use the document envelope `{ docId, docType, data: { ... } }`.

## 4. Key UX Behaviors (from Handover)

- **Panel Animation**: Right-to-left slide-in transition (0.3s cubic-bezier).
- **Action Menu**: Three-dot menu on bar hover containing Edit and Delete options.
- **Dynamic Field**: Status field transforms from Pill selection to Text list when interacting.
