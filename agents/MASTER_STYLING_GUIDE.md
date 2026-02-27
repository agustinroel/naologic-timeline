# UI/UX Styling Specification - Naologic ERP Timeline

**Goal**: 1:1 Pixel-Perfect implementation based on Sketch design tokens.

## 1. Design Reference Links

- **Main Pages**: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667
- **Symbols**: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667/symbols
- **Text Styles**: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667/text-styles
- **Layer Styles**: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667/layer-styles
- **Color Variables**: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667/color-variables

## 2. Core Palette (Hex Codes)

- **Primary Branding**: #3E40DB (Buttons, active states, primary text)
- **Primary Interaction**: #5658FF (Hover states, timeline indicators)
- **UI Surface**: #FFFFFF (Panel backgrounds, work order cards)
- **App Background**: #F6F8FB (Main workspace backdrop)
- **Grid/Dividers**: #EFF0F4 (Timeline borders and separators)

### Text Colors

- **Main text**: #1D1D1B
- **Secondary text**: #333333
- **Muted text**: #687195
- **Header text**: #A0A5B8

## 3. Page Layout (from Sketch Inspector)

### Header Bar

| Property   | Value               |
| ---------- | ------------------- |
| Width      | 1440px (full width) |
| Height     | 50px                |
| Background | #FFFFFF             |

### Logo

| Property    | Value             |
| ----------- | ----------------- |
| Width       | 80px              |
| Height      | 10px              |
| Left offset | 101px from screen |

### Page Title ("Work Orders")

| Property    | Value             |
| ----------- | ----------------- |
| Width       | 142px             |
| Height      | 34px              |
| Top offset  | 97px from top     |
| Left offset | 101px from screen |
| Font-weight | 700               |
| Font-size   | 22px              |

### Grid Wrapper

| Property     | Value             |
| ------------ | ----------------- |
| Left margin  | 102px             |
| Right margin | 102px             |
| Border       | 1px solid #EFF0F4 |
| Radius       | 0px (square)      |

## 4. Left Panel (Work Centers)

| Property   | Value   |
| ---------- | ------- |
| Width      | 380px   |
| Background | #FFFFFF |

### Rows

| Property   | Standard Row | Header Row (first) |
| ---------- | ------------ | ------------------ |
| Width      | 380px        | 380px              |
| Height     | 48px         | 60px               |
| Background | #FFFFFF      | #FFFFFF            |

## 5. Component-Specific Styles

### Status Badges (Pill inside timeline bar)

| Property      | Value                      |
| ------------- | -------------------------- |
| Height        | 22px                       |
| Border-radius | **5px** (slightly squared) |
| Font-size     | 11px                       |
| Font-weight   | 600                        |
| Padding       | 0 10px                     |

#### Pill Color Mapping (BG / Text)

- **Open**: `bg: rgba(228, 253, 255, 1)` / `border: 1px solid rgba(206, 251, 255, 1)` / `text: #3E40DB`
- **In Progress**: #D6D8FF / #3E40DB
- **Complete**: #E1FFCB / #2E7D32
- **Blocked**: #FBEDB5 / #E65100

### Work Order Bar Containers (Status-specific)

| Status      | Background | Border (inside, 1px) |
| ----------- | ---------- | -------------------- |
| Open        | #E4FDFF    | #CEFBFF              |
| In Progress | #EDEEFF    | #DEE0FF              |
| Complete    | #F0FFE6    | #D0EABF              |
| Blocked     | #FFF8E6    | #F0E4A8              |

All bars: border-radius 8px, border inside 1px, height 34px.

### Current Month Badge

| Property      | Value                         |
| ------------- | ----------------------------- |
| Width         | 109px                         |
| Height        | 22px                          |
| Border-radius | 5px                           |
| Background    | rgba(212,215,255,1) = #D4D7FF |
| Text color    | #3E40DB                       |
| Font-size     | 11px                          |
| Font-weight   | 600                           |
| Position      | Below month header label      |

### "Click to Add Dates" Hover Cue

#### Rectangle (appears in row on hover)

| Property      | Value                         |
| ------------- | ----------------------------- |
| Width         | 113px                         |
| Height        | 38px                          |
| Border        | 1px solid rgba(195,199,255,1) |
| Border-radius | 8px                           |
| Background    | rgba(101,112,255,0.1)         |

#### Tooltip (above rectangle)

| Property      | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Width         | 130px                                                                 |
| Height        | 26px                                                                  |
| Border-radius | 8px                                                                   |
| Background    | rgba(104,113,150,1) = #687196                                         |
| Box-shadow    | 0 2px 4px -2px rgba(200,207,233,1), 0 0 16px -8px rgba(230,235,240,1) |
| Text color    | #FFFFFF                                                               |
| Font-size     | 11px                                                                  |
| Z-index       | **10** (above all bars)                                               |

## 6. Interaction Cues

- **Row Hover**: `rgba(238, 240, 255, 1)` — applies to timeline grid only (left panel excluded).
- **Timeline Indicator**: 2px solid line (#5658FF) marking current day.
- **Current Month Badge**: Appears below current month column header.

## 7. Typography

- **Font**: Circular Std
- **Import**: `https://naologic-com-assets.naologic.com/fonts/circular-std/circular-std.css`
- **CSS family name**: `'Circular-Std', sans-serif`

### Font-Weight Mapping (CDN → Sketch)

| CSS font-weight | WOFF2 File           | Sketch Name         |
| --------------- | -------------------- | ------------------- |
| 400             | circular-std-regular | CircularStd-Regular |
| 500             | circular-std-book    | CircularStd-Book    |
| 600             | circular-std-medium  | CircularStd-Medium  |
| 700             | circular-std-bold    | CircularStd-Bold    |
| 800             | circular-std-black   | CircularStd-Black   |

## 8. Side Panel — "Work Order Details" (from Sketch)

### Backdrop Overlay

When the side panel is open, the main timeline view behind it receives a blur effect.

| Property | Value                                   |
| -------- | --------------------------------------- |
| Effect   | Blur (approx. 2–4px, TBD during polish) |

### Panel Container

| Property         | Value                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Width            | 591px                                                                                                                     |
| Height           | 1024px (full viewport)                                                                                                    |
| Border-radius    | 12px 0px 0px 12px                                                                                                         |
| Background-color | `rgba(255, 255, 255, 1)`                                                                                                  |
| Box-shadow       | `0 5px 15px 0 rgba(216, 220, 235, 1), 0 2.5px 3px -1.5px rgba(200, 207, 233, 1), 0 4.5px 5px -1px rgba(216, 220, 235, 1)` |
| Position         | Fixed, right edge of viewport                                                                                             |

### Panel Title — "Work Order Details"

| Property        | Value                                        |
| --------------- | -------------------------------------------- |
| Width           | 253px                                        |
| Height          | 25px                                         |
| Color           | `rgba(47, 48, 89, 1)`                        |
| Font-family     | CircularStd-Medium → CSS: `font-weight: 600` |
| Font-size       | 20px                                         |
| Padding-top     | 16px (from panel top edge)                   |
| Padding-left    | 24px (from panel left edge)                  |
| Gap to subtitle | 5px below                                    |

### Panel Subtitle — "Specify the dates, name and status for this order"

| Property      | Value                                      |
| ------------- | ------------------------------------------ |
| Width         | 352px                                      |
| Height        | 20px                                       |
| Color         | `rgba(104, 113, 150, 1)`                   |
| Font-family   | CircularStd-Book → CSS: `font-weight: 500` |
| Font-size     | 16px                                       |
| Margin-bottom | 16px (to divider border below)             |

### Header Divider (below subtitle)

| Property | Value                              |
| -------- | ---------------------------------- |
| Width    | 591px (full panel width)           |
| Height   | 1px                                |
| Border   | `1px solid rgba(230, 235, 240, 1)` |

### Button — "Cancel"

| Property         | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| Width            | 66px                                                                   |
| Height           | 32px                                                                   |
| Border-radius    | 7px                                                                    |
| Background-color | `rgba(255, 255, 255, 1)`                                               |
| Box-shadow       | `0 0 0 1px rgba(255, 255, 255, 1), 0 1px 3px 0 rgba(200, 207, 233, 1)` |
| Position         | 51px from title left edge, 8px left of "Create" button                 |

### Button — "Create"

| Property         | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Width            | 66px                                                                 |
| Height           | 32px                                                                 |
| Border-radius    | 7px                                                                  |
| Background-color | `rgba(86, 89, 255, 1)`                                               |
| Box-shadow       | `0 0 0 1px rgba(86, 89, 255, 1), 0 1px 3px 0 rgba(200, 207, 233, 1)` |
| Text color       | `#FFFFFF`                                                            |
| Position         | 24px from panel right edge                                           |

### Spacing Summary (Side Panel Header)

```
┌─────────────────────────────────────────────────────────────────┐
│ 16px                                                           │
│ 24px  "Work Order Details"          51px→ [Cancel] 8px [Create] 24px │
│       5px                                                      │
│ 24px  "Specify the dates..."                                   │
│       16px                                                     │
├─────────────────────────────────────────────────────────────────┤  ← 1px divider
│       24px (to first label)                                    │
│ 24px  "Work Order Name" (label)                                │
│       ...input...                                              │
│       "Status" (label)                                         │
│       ...input (with pill badge)...                            │
│       "End date" (label)                                       │
│       ...input...                                              │
│       "Start date" (label)                                     │
│       ...input...                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Form Field Labels

| Property    | Value                                         |
| ----------- | --------------------------------------------- |
| Width       | 542px                                         |
| Height      | 16px                                          |
| Color       | `rgba(104, 113, 150, 1)`                      |
| Font-family | CircularStd-Regular → CSS: `font-weight: 400` |
| Font-size   | 14px                                          |
| Top spacing | 24px from divider to first label              |

### Form Input Fields

| Property         | Value                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Width            | 542px                                                                                                                  |
| Height           | 38px                                                                                                                   |
| Border-radius    | 5px                                                                                                                    |
| Background-color | `rgba(255, 255, 255, 1)`                                                                                               |
| Box-shadow       | `0 0 0 1px rgba(216, 220, 235, 1), 0 1.5px 3px -1.5px rgba(200, 207, 233, 1), 0 1px 0.5px -1px rgba(216, 220, 235, 1)` |

### Form Input Text (inside fields)

| Property    | Value                                         |
| ----------- | --------------------------------------------- |
| Color       | `rgba(3, 9, 41, 1)`                           |
| Font-family | CircularStd-Regular → CSS: `font-weight: 400` |
| Font-size   | 14px                                          |

### Status Selector — Special Behavior

The Status field has a unique "Pill-to-Text" transformation:

**When a value is selected (closed state):**

- The selected status appears as a **pill badge** inside the input (same pill style as the timeline bars)

**When the selector is opened (dropdown list):**

- Options appear as **plain text** (not pills)
- The currently selected option is highlighted in `rgba(62, 64, 219, 1)`
- Unselected options use the default style below

### Status Selector — Option Text (unselected)

| Property    | Value                                      |
| ----------- | ------------------------------------------ |
| Width       | 150px                                      |
| Height      | 18px                                       |
| Color       | `rgba(47, 48, 89, 1)`                      |
| Font-family | CircularStd-Book → CSS: `font-weight: 500` |
| Font-size   | 14px                                       |

### Status Selector — Option Text (selected/active)

| Property    | Value                                      |
| ----------- | ------------------------------------------ |
| Color       | `rgba(62, 64, 219, 1)`                     |
| Font-family | CircularStd-Book → CSS: `font-weight: 500` |
| Font-size   | 14px                                       |

---

## 9. Deviations from Sketch (Applied Corrections)

This section documents intentional deviations from Sketch specs made during implementation
to better match the visual intent or fix rendering issues.

_No deviations documented yet. This section will be updated as adjustments are made._
