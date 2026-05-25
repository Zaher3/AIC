# Design Document

## 1. Profile Baseline Declaration

- **Profile selection**: `profiles/strategic.md`
- **Selection rationale**: This is a technical project proposal and prototype presentation aimed at decision-makers (IT directors, project managers, technical leads). The strategic profile fits best for conveying project vision, architecture, and implementation path.
- **Referenced dimensions**: Design philosophy (grand vision, clear storyline), information density (medium-high), color guidance (steady premium), font guidance, layout patterns (timelines, cards, architecture diagrams).
- **Deviation notes**: Since the content is highly technical (architecture diagrams, DB schema, RBAC matrix), the visual will lean more toward clean, structured technical diagrams rather than purely persuasive business charts. No data charts needed — architecture diagrams and tables instead.

## 2. Style Baseline Declaration

- **Style anchor**: McKinsey/BCG strategic report style + Stripe developer documentation aesthetic
- **Referenced dimension**: 
  - From McKinsey: Clean grid layout, authoritative typography, structured hierarchy
  - From Stripe: Technical clarity, clean code/schema presentation, modern sans-serif fonts, dark accent elements on light backgrounds

## 3. Style Details

### Color Design Principles
- **Overall tendency**: Conservative & steady with local highlights
- **Temperature**: Cool-neutral, mineral feel
- **Primary**: Deep navy `#1E3A5F` (the app's brand color)
- **Background**: Light warm gray `#F8F9FA` (not pure white, warmer feel)
- **Text**: Dark charcoal `#1F2937`
- **Secondary**: Medium gray `#6B7280` for annotations and secondary info
- **Accent**: Emerald green `#4ADE80` for highlights, matching the app's active state color
- **Dark variant**: For cover and chapter pages, use `#0F172A` dark background with white text

### Font Usage
- **Title font**: Liter (modern, clean, rational — perfect for tech)
- **Body font**: Liter
- **Font size hierarchy**:
  - Cover title: 48px
  - Page title: 28px
  - Body: 18px
  - Annotations/labels: 14px
  - Big numbers: 52px

### Container Styles
- Use sharp-cornered rectangles (no rounded corners) for cards
- Content separation: whitespace + font size differences
- Thin horizontal lines as separators
- Architecture boxes: border-only rectangles with clear hierarchy

### Image Style
- Icons: Outline style, Font Awesome, used sparingly for feature highlights
- Tables: Minimal three-line style with navy header
- Architecture diagrams: Built with shapes (rectangles + connectors)

## 4. Layout System

### Global Layout
- Page size: 1280x720 (16:9)
- Margins: 60px left/right, 50px top/bottom
- Consistent bottom-right page number on all content pages
- Thin navy accent line at bottom of content pages

### Special Pages
- **Cover**: Dark navy background, centered title + subtitle, accent line decoration
- **Chapter**: Dark navy background with large chapter number
- **Final**: Dark navy background, centered text

### Content Pages
- Title at top (28px, navy)
- Content area below with various layouts:
  - Two-column: left text + right diagram
  - Three-column cards for features
  - Full-width table for RBAC matrix
  - Architecture diagram built with shapes

## 5. Theme Definition

```yaml
theme:
  colors:
    primary: "#1E3A5F"
    secondary: "#6B7280"
    accent: "#4ADE80"
    background: "#F8F9FA"
    text: "#1F2937"
    light: "#E5E7EB"
    dark: "#0F172A"
    white: "#FFFFFF"
  textStyles:
    title:
      fontSize: 48
      color: "$white"
      fontFamily: "Liter"
      letterSpacing: 1
    subtitle:
      fontSize: 22
      color: "$secondary"
      fontFamily: "Liter"
    pageTitle:
      fontSize: 28
      color: "$primary"
      fontFamily: "Liter"
      letterSpacing: 0.5
    body:
      fontSize: 18
      color: "$text"
      fontFamily: "Liter"
      lineHeight: 1.6
    label:
      fontSize: 14
      color: "$secondary"
      fontFamily: "Liter"
    bigNumber:
      fontSize: 52
      color: "$primary"
      fontFamily: "Liter"
  tableStyles:
    default:
      fontSize: 16
      fontFamily: "Liter"
      headerFill: "$primary"
      headerColor: "$white"
      headerBold: true
      bodyFill: ["$white", "$background"]
      bodyColor: "$text"
      border:
        style: solid
        width: 1
        color: "$light"
```

## 6. Risk Prohibitions

- No blue/cyan primary colors (already using navy)
- No rounded rectangles on cards
- No generic stock photos
- Body font never below 18px
- Annotation font never below 12px
- No gradient backgrounds on content pages
- Architecture boxes must use sharp corners
