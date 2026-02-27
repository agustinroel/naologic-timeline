# Phased Implementation Roadmap - Naologic ERP Timeline

**Target**: Complete functional delivery with Pixel-Perfect UI within 7 days.
**Tech Stack**: Angular 21 (Standalone), SCSS, ng-bootstrap, ng-select.

## Phase 1: Environment & Foundation

- [x] **Project Setup**: Bootstrap Angular 21 project using Standalone Components.
- [x] **Design Tokens**: Configure global SCSS with precise Hex codes, spacing, and the "Circular Std" font import.
- [x] **Data Architecture**: Implement `MockDataService` using the required `{ docId, docType, data }` envelope.
- [x] **Sample Data**: Create 5+ Work Centers and 8+ Work Orders representing all 3 statuses (In progress, Complete, Blocked).

## Phase 2: The Core Timeline Grid

- [x] **Layout Architecture**: Build the dual-pane system: Fixed left panel (Work Centers) and horizontally scrollable right panel (Timeline Grid).
- [x] **Zoom Engine**: Implement logic for Day, Week, and Month (Default) timescales.
- [x] **Temporal Indicators**:
  - Render the vertical "Current Day" line indicator.
  - Implement the "Center on Today" logic to focus the viewport on the current date upon initialization.
- [x] **Interactive Hover**: Implement row-level background highlights (`rgba(238, 240, 255, 1)`) on hover, restricted to the timeline grid only (left panel excluded).

## Phase 3: Work Order Bars & Collision System

- [x] **Visual Component**: Create `WorkOrderBar` with dynamic status-based styling (Pill badges) and precise positioning based on ISO dates.
- [x] **Collision Logic**: Code the `hasOverlap()` utility to prevent conflicting schedules in the same Work Center.
- [x] **UX Interactions**:
  - Implement "Click empty area" to trigger the Create Panel with a pre-filled `StartDate`.
  - Add the "Three-dot" action menu (Edit/Delete) visible only on bar hover.
  - Exclusive single-open behavior (opening one menu closes any other).
  - Dropdown positioned 5px below trigger, aligned to button left edge.

## Phase 4: Side Panel & Forms

- [x] **Drawer Component**: Develop the slide-out `DetailsPanel` using Angular Animations (`transform: translateX`).
- [x] **Reactive Forms**: Build the form using `FormGroup` for Name, Status, Start Date, and End Date.
- [x] **Third-Party Integration**: Integrate `ngb-datepicker` and `ng-select`, styled to match Sketch symbols.
- [x] **State Transformation**: Implement the "Pill-to-Text" visual change for the Status dropdown (Pill in selection, Plain text in list).
- [x] **Error Handling**: Add UI feedback (Toast/Banner) if an overlap is detected during Save/Create.

## Phase 5: QA, Performance & Submission

- [x] **Pixel-Perfect Audit**: Verify all dimensions, colors, and shadows against Sketch "Inspect" values.
  - [x] Typography: All elements using Circular-Std with correct weights and RGBA colors.
  - [x] Timescale selector: Unified pill design with shared shadow, chevron color states.
  - [x] Work Order dropdown (Edit/Delete): Exact dimensions, shadow, border-radius.
  - [x] Row heights: First row 60px, subsequent rows 48px.
  - [x] Left panel alignment: 31px left padding matching header.
  - [x] Timeline wrapper: Square corners (no border-radius).
  - [x] Page header: No border-bottom below logo.
- [x] **Optimization**: Implement `OnPush` change detection and `trackBy` for timeline rendering performance.
- [x] **Persistence (Bonus)**: Implement `localStorage` to persist Work Order changes across refreshes.
- [ ] **Final Delivery**: Record the 10-minute Loom video walking through the code, the zoom functionality, and the overlap error scenario.
