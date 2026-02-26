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
| Radius       | 8px               |

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

- **Open**: #EDF0FF / #3E40DB
- **In Progress**: #D6D8FF / #3E40DB
- **Complete**: #E1FFCB / #2E7D32
- **Blocked**: #FBEDB5 / #E65100

### Work Order Bar Containers (Status-specific)

| Status      | Background | Border (inside, 1px) |
| ----------- | ---------- | -------------------- |
| Open        | #EDF0FF    | #DEE0FF              |
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

- **Row Hover**: Highlight entire row with #F9FBFC.
- **Timeline Indicator**: 2px solid line (#5658FF) marking current day.
- **Current Month Badge**: Appears below current month column header.

## 7. Typography

- **Font**: Circular Std
- **Import**: `https://naologic-com-assets.naologic.com/fonts/circular-std/circular-std.css`
