# Prompt Log — Naologic ERP Timeline

Architectural decisions and trade-offs recorded during development.

---

## Entry 1 — Phase 1 & Phase 2 Init (2026-02-25)

### Prompt Received

> Initialize Phase 1 and Phase 2 of the MASTER_EXECUTION_PLAN.md.
> Build the data layer (5 Work Centers, 8 Work Orders, strict `{ docId, docType, data }` envelope),
> global SCSS design tokens (Circular Std, hex codes), and the two-pane timeline skeleton
> (240px fixed left panel, horizontally scrollable right panel, center-on-today).

**Mandatory adjustments from reviewer:**

1. Timeline date range: ±6 months from today.
2. WorkOrders must link to WorkCenters via `workCenterId` strictly.
3. Left panel must remain completely static (no horizontal scroll).

### Technical Decisions

| #   | Decision                                                | Rationale                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **CSS Grid (not Flexbox)** for the two-pane layout      | Grid's `grid-template-columns: 240px 1fr` creates two truly independent scroll containers. With Flexbox, both panels share the same flex container flow, making independent horizontal scrolling harder to manage without additional wrapper hacks.                         |
| 2   | **Separate scroll containers** (not `position: sticky`) | Using `position: sticky` on the left column inside a single horizontal scroller can cause rendering glitches in WebKit during fast scrolls and adds z-index complexity. Two separate containers guarantee the left panel never participates in horizontal scrolling at all. |
| 3   | **Signals** for data layer (not RxJS Observables)       | The mock data is synchronous. Angular 21 signals are first-class primitives with better change-detection integration and less boilerplate than `BehaviorSubject` + `async` pipe. We can upgrade to RxJS-backed signals later if we need HTTP calls.                         |
| 4   | **`DAY_WIDTH = 6px`** per day in month view             | With ±6 months (≈365 days), total canvas width ≈ 2190px — comfortably scrollable without performance issues and large enough that month columns are visually distinct.                                                                                                      |
| 5   | **Dates relative to `new Date()`** in mock data         | Ensures the timeline always "looks alive" regardless of when the app is run — work orders will straddle "today" naturally.                                                                                                                                                  |
| 6   | **SCSS partials** (`_variables.scss`)                   | Centralises all design tokens (colours, spacing, fonts) in one file. Every component imports it via `@use`, guaranteeing a single source of truth. This avoids CSS custom-property sprawl while still allowing per-component overrides.                                     |
| 7   | **`DocEnvelope<T>` generic**                            | Follows Naologic's required `{ docId, docType, data }` pattern. The generic type parameter `T` gives us full IntelliSense inside `data` while keeping the envelope shape uniform.                                                                                           |
| 8   | **`workCenterId` as strict FK**                         | Each `WorkOrder.workCenterId` must match a `WorkCenter.id`. The `getOrdersForCenter()` helper and unit test both enforce this constraint. No loose coupling or "orphan" orders allowed.                                                                                     |

### Trade-offs Considered

- **CSS Grid vs. Flexbox**: Grid adds a hard column boundary but makes responsive collapse (e.g., hiding the left panel on mobile) slightly more complex. Accepted because pixel-perfect desktop layout is the priority per the Sketch spec.
- **`@use` vs. `@import` in SCSS**: `@use` is the modern Dart Sass recommendation and avoids global namespace pollution. Downside: every file must explicitly `@use` the partials it needs. Worth it for Long-term maintainability.
- **Signals vs. Observables**: Signals lack built-in debounce/throttle operators. If we later need reactive HTTP streams, we can wrap signals with `toObservable()`. For Phase 1 mock data, this is not a concern.
- **±6 months range**: Wider than originally planned (±3), but matches user requirements. Adds ~1100px of canvas width, well within browser rendering limits.

---

## Entry 2 — Zoom Engine + Phase 3 Init (2026-02-25)

### Prompt Received

> Finish Phase 2 (Zoom Engine with Day/Week/Month) and initiate Phase 3.
> Refactor bars into `WorkOrderBarComponent` with OnPush.
> Implement `hasOverlap()`, three-dot menu, and click-to-add cue.

### Technical Decisions

| #   | Decision                                                        | Rationale                                                                                                                                                                                                                                                 |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **`PX_PER_DAY` lookup** (`day:40, week:20, month:6`)            | Single source of truth for zoom math. Every date→pixel and pixel→date calculation reads from this constant, making it fully reactive when zoom changes. Day=40px gives enough room for 24-segment density; Month=6px ≈ 2190px total canvas for ±6 months. |
| 2   | **Unified `_rebuildColumns()`** instead of 3 separate builders  | One method with a `switch` avoids code duplication while keeping each zoom branch readable. Column keys are prefixed (`d-`, `w-`, `y-m`) ensuring unique `track` values.                                                                                  |
| 3   | **`WorkOrderBarComponent` with input signals** (not `@Input()`) | Angular 21 signal inputs (`input.required<T>()`) integrate natively with `OnPush` — no manual `markForCheck()` needed. The parent passes `leftPx` and `widthPx` as pre-computed values so the child has zero layout math responsibility.                  |
| 4   | **Three-dot menu via `position: absolute` + `opacity`**         | Absolute positioning inside the bar with `overflow: visible` on the bar itself ensures the menu never shifts the label text or the bar's width. Using `@if (menuVisible())` instead of CSS-only avoids rendering the dropdown DOM when not needed.        |
| 5   | **`hasOverlap()` as pure function in `utils/`**                 | Keeps collision logic unit-testable and decoupled from Angular DI. Uses `Pick<WorkOrder, ...>` for minimal typing. Skips self-comparison via `id` check to support edit scenarios.                                                                        |
| 6   | **Startup overlap detection** (`_checkInitialOverlaps()`)       | Runs once in `ngOnInit` and `console.warn()`s any collisions in mock data, proving the formula works before the UI forms are built.                                                                                                                       |
| 7   | **Click-to-add cue** via `rgba(#5658FF, 0.03)` background       | Very subtle — appears on row hover via CSS transition. The handler on `(click)` converts pixel→date using `clickX / pxPerDay()` to pre-fill the StartDate for the future Create panel.                                                                    |

### Trade-offs

- **Day view column count**: ±6 months ≈ 365 days = 365 columns at 40px each ≈ 14,600px canvas. Big but browser handles it fine; considered virtualisation but deferred to Phase 5 if needed.
- **Week numbering**: Used sequential count + date label instead of ISO week numbers for clarity across year boundaries.
- **`OnPush` on timeline root**: Applied `OnPush` to both `TimelineComponent` and `WorkOrderBarComponent`. Signals trigger change detection automatically, so this is safe and improves perf.
