# Design Brief: Datenerfassung

## 1. App Analysis

### What This App Does
Datenerfassung (Data Collection) is a simple data entry application that allows users to capture and manage records with two text fields. It's a general-purpose data collection tool - think of it as a lightweight, structured note-keeping or data logging system.

### Who Uses This
Non-technical users who need to capture structured data pairs - could be inventory notes, contact details, quick observations, or any two-field data entry. They want something fast, clean, and reliable.

### The ONE Thing Users Care About Most
Seeing their collected data at a glance and being able to quickly add new entries. The total count of records and the most recent entries are what they want to see immediately.

### Primary Actions (IMPORTANT!)
1. **Add new entry** → Primary Action Button (the #1 action - users come here to log data)
2. Edit existing entries
3. Delete old entries

---

## 2. What Makes This Design Distinctive

### Visual Identity
The design uses a cool slate-blue base with a rich indigo accent, creating a professional yet approachable data workspace. The slightly warm off-white background avoids the clinical feel of pure white, while the indigo primary color adds a sense of purpose and reliability. This isn't a flashy creative tool - it's a trusted, well-organized data companion that feels solid and dependable.

### Layout Strategy
- The hero element is the total record count, displayed prominently with large typography and generous whitespace to create a clear focal point
- The layout is asymmetric on desktop: a wider left column holds the hero KPI and data table, while a narrower right column shows the most recent entries as a compact activity feed
- Visual interest comes from the contrast between the bold hero number and the refined, compact data table below it
- Secondary elements (recent activity sidebar on desktop) support without competing through muted colors and smaller typography

### Unique Element
The hero KPI card features a subtle indigo gradient border on the left edge (4px wide), creating a distinctive accent mark that ties the most important metric to the brand color. This vertical accent line echoes through the recent entries sidebar, creating a visual rhythm unique to this dashboard.

---

## 3. Theme & Colors

### Font
- **Family:** Plus Jakarta Sans
- **URL:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`
- **Why this font:** Plus Jakarta Sans is professional and geometric with subtle rounded features that make data feel approachable rather than intimidating. It has excellent weight range for creating typography hierarchy.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(220 20% 97%)` | `--background` |
| Main text | `hsl(220 25% 14%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(220 25% 14%)` | `--card-foreground` |
| Borders | `hsl(220 15% 90%)` | `--border` |
| Primary action | `hsl(234 72% 53%)` | `--primary` |
| Text on primary | `hsl(0 0% 100%)` | `--primary-foreground` |
| Accent highlight | `hsl(234 72% 96%)` | `--accent` |
| Muted background | `hsl(220 15% 95%)` | `--muted` |
| Muted text | `hsl(220 10% 46%)` | `--muted-foreground` |
| Success/positive | `hsl(152 60% 40%)` | (component use) |
| Error/negative | `hsl(0 72% 51%)` | `--destructive` |

### Why These Colors
The cool slate-blue page background creates depth without feeling cold. The indigo primary is distinct from generic "bootstrap blue" - it's richer and more refined. The accent is a very light indigo wash that provides subtle highlighting without overwhelming. The muted foreground at 46% lightness provides readable secondary text with clear hierarchy.

### Background Treatment
The page background is a cool-toned off-white (`hsl(220 20% 97%)`) with a very slight blue undertone. Cards sit on pure white, creating a subtle but effective layer separation. No gradients on the page background - the layering of white cards on the cool base provides enough visual depth.

---

## 4. Mobile Layout (Phone)

### Layout Approach
The hero KPI dominates the first viewport with a large, bold number. Below it, a full-width data list shows entries as compact cards. The layout creates visual interest through the contrast between the large hero area and the dense but readable list below.

### What Users See (Top to Bottom)

**Header:**
- Left: App title "Datenerfassung" in 700 weight, 20px
- Right: No additional header actions (primary action is a fixed bottom button)

**Hero Section (The FIRST thing users see):**
- A single card spanning full width with generous padding (24px)
- Left edge: 4px indigo border accent
- Inside: Label "Eintraege gesamt" in 13px 500 weight muted-foreground
- Main number: Total record count in 48px 800 weight foreground
- Below number: "Zuletzt aktualisiert: [relative time]" in 12px 400 weight muted-foreground
- Takes about 25% of viewport height including padding
- Why hero: Users want immediate confirmation that their data is being tracked. The count validates their effort.

**Section 2: Alle Eintraege (All Entries)**
- Section heading "Alle Eintraege" in 16px 700 weight with a count badge next to it
- Each entry is a compact card with:
  - Feld 1 value as the primary text (15px 600 weight)
  - Feld 2 value below in 13px 400 weight muted-foreground
  - Created date in 12px muted-foreground, right-aligned
  - Edit (pencil) and Delete (trash) icon buttons, right side, 32px touch targets
- Cards have 12px padding, 8px gap between them
- Sorted by creation date, newest first

**Bottom Navigation / Action:**
- Fixed bottom button bar with "Neuen Eintrag erstellen" primary button
- Full width minus 16px padding on each side
- 48px height, 12px border-radius
- Indigo background with white text, 16px 600 weight

### Mobile-Specific Adaptations
- Hero card and entry list stack vertically as single column
- Entry cards show all information inline (no hidden details)
- Edit/delete actions visible directly on each card (no swipe needed)
- Bottom button has safe area padding for notched phones (pb-safe or 16px extra)

### Touch Targets
- All icon buttons are 32px minimum touch target with 8px padding around icons
- Bottom action button is 48px tall, easy thumb reach
- Entry cards themselves are not tappable (all info visible)

### Interactive Elements
- Tapping edit icon opens the edit dialog pre-filled with current values
- Tapping delete icon opens confirmation dialog
- Bottom button opens the create dialog

---

## 5. Desktop Layout

### Overall Structure
Two-column layout with 2fr / 1fr proportions, max-width 1200px centered on page with 32px horizontal padding.

- **Left column (66%):** Hero KPI card on top, then the full data table below
- **Right column (33%):** "Letzte Eintraege" (Recent Entries) sidebar showing the 5 most recent additions as a compact activity feed

The eye goes: Hero number (top-left) → Data table (scan down-left) → Recent activity (glance right)

### Section Layout

**Top area - Hero KPI (full width of left column):**
- Card with 32px padding
- Left border accent: 4px solid indigo
- Label "Eintraege gesamt" in 14px 500 weight muted-foreground
- Number in 56px 800 weight
- Subtitle with last updated time

**Left column - Data Table (below hero):**
- Section header: "Alle Eintraege" in 18px 700 weight with record count badge + "Neuen Eintrag" button on the right
- Table with columns: Feld 1, Feld 2, Erstellt am, Aktionen
- Table rows with alternating subtle background (even rows: muted at 50% opacity)
- Aktionen column: Edit (pencil) and Delete (trash) icon buttons
- Table header in 13px 600 weight uppercase tracking-wide muted-foreground

**Right column - Recent Activity:**
- Card with title "Letzte Eintraege" in 16px 700 weight
- Shows 5 most recent entries
- Each entry: Feld 1 value in 14px 500 weight, Feld 2 truncated in 13px muted, relative time ("vor 3 Tagen") in 12px muted
- Thin separator line between entries
- Left border accent on the card (4px indigo, matching hero)

### What Appears on Hover
- Table rows get a subtle background highlight (`bg-muted/50`) on hover
- Edit and delete icon buttons get background circle on hover
- Cards get subtle shadow elevation on hover (`shadow-md`)

### Clickable/Interactive Areas
- Edit icon → opens edit dialog
- Delete icon → opens delete confirmation dialog
- "Neuen Eintrag" button → opens create dialog

---

## 6. Components

### Hero KPI
- **Title:** Eintraege gesamt
- **Data source:** Datenerfassung app
- **Calculation:** Count of all records (`records.length`)
- **Display:** Large bold number (48px mobile, 56px desktop) inside a white card with left indigo border accent
- **Context shown:** "Zuletzt aktualisiert: [relative time of newest record]" below the number
- **Why this is the hero:** For a data collection app, the total count validates the user's effort and gives immediate status of data volume

### Secondary KPIs
None. With only two text fields and no numeric data, additional KPIs would be forced and meaningless. The recent entries sidebar serves the secondary information need.

### Chart
None. With two text fields and no numeric/date data to aggregate, a chart would add no value. Clean data management is more honest than a forced visualization.

### Lists/Tables

**Alle Eintraege (All Entries)**
- Purpose: Central data management view - users need to see, edit, and delete their data
- Source: Datenerfassung app
- Fields shown: Feld 1, Feld 2, Erstellt am (formatted date), Aktionen (edit/delete)
- Mobile style: Compact cards stacked vertically
- Desktop style: Clean table with header
- Sort: By creation date, newest first
- Limit: Show all records (no pagination for simplicity)

**Letzte Eintraege (Recent Entries - Desktop sidebar)**
- Purpose: Quick glance at recent activity without scanning the full table
- Source: Datenerfassung app (same data, limited to 5)
- Fields shown: Feld 1, Feld 2 (truncated), relative time
- Mobile style: Hidden (mobile already shows newest first in the main list)
- Desktop style: Compact activity feed in right sidebar card
- Sort: By creation date, newest first
- Limit: 5 entries

### Primary Action Button (REQUIRED!)
- **Label:** "Neuen Eintrag erstellen"
- **Action:** add_record
- **Target app:** Datenerfassung (698d77713243f76fa48f2999)
- **What data:** Form with Feld 1 (text input) and Feld 2 (text input)
- **Mobile position:** bottom_fixed
- **Desktop position:** header (next to section title "Alle Eintraege")
- **Why this action:** Users come to this app specifically to collect data. Adding new entries is the core workflow.

### CRUD Operations Per App (REQUIRED!)

**Datenerfassung CRUD Operations**

- **Create (Erstellen):**
  - **Trigger:** "Neuen Eintrag erstellen" button (fixed bottom on mobile, inline header on desktop)
  - **Form fields:** Feld 1 (text input, label "Feld 1"), Feld 2 (text input, label "Feld 2")
  - **Form style:** Dialog/Modal centered on screen
  - **Required fields:** None (both fields are optional per app metadata)
  - **Default values:** None

- **Read (Anzeigen):**
  - **List view:** Mobile: Card list. Desktop: Table with columns Feld 1, Feld 2, Erstellt am, Aktionen
  - **Detail view:** No separate detail view needed - all fields are visible in the list/table
  - **Fields shown in list:** Feld 1, Feld 2, creation date
  - **Fields shown in detail:** N/A (all visible in list)
  - **Sort:** Creation date, newest first
  - **Filter/Search:** No filter needed for this simple app

- **Update (Bearbeiten):**
  - **Trigger:** Pencil icon button on each record (in Aktionen column on desktop, inline on mobile cards)
  - **Edit style:** Same dialog as Create but pre-filled with current values, title changes to "Eintrag bearbeiten"
  - **Editable fields:** Feld 1, Feld 2 (both editable)

- **Delete (Loeschen):**
  - **Trigger:** Trash icon button on each record
  - **Confirmation:** AlertDialog with destructive styling
  - **Confirmation text:** "Moechtest du diesen Eintrag wirklich loeschen? Diese Aktion kann nicht rueckgaengig gemacht werden."

---

## 7. Visual Details

### Border Radius
Rounded (8px) - approachable but not playful. Cards: 12px. Buttons: 8px. Input fields: 8px.

### Shadows
Subtle - Cards have a soft shadow: `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)`. On hover, cards elevate to: `0 4px 12px rgba(0,0,0,0.08)`.

### Spacing
Normal to spacious - 24px padding inside cards (mobile), 32px (desktop). 16px gap between cards/sections (mobile), 24px (desktop). Page padding: 16px (mobile), 32px (desktop).

### Animations
- **Page load:** Subtle fade-in with stagger (hero first, then table, then sidebar)
- **Hover effects:** Background color transition (150ms ease), shadow transition (200ms ease)
- **Tap feedback:** Scale down to 0.98 on active state for buttons (100ms)
- **Dialog:** Fade in + slight scale up from 0.95 (200ms ease-out)

---

## 8. CSS Variables (Copy Exactly!)

```css
:root {
  --background: hsl(220 20% 97%);
  --foreground: hsl(220 25% 14%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(220 25% 14%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(220 25% 14%);
  --primary: hsl(234 72% 53%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(220 15% 95%);
  --secondary-foreground: hsl(220 25% 14%);
  --muted: hsl(220 15% 95%);
  --muted-foreground: hsl(220 10% 46%);
  --accent: hsl(234 72% 96%);
  --accent-foreground: hsl(234 72% 30%);
  --destructive: hsl(0 72% 51%);
  --border: hsl(220 15% 90%);
  --input: hsl(220 15% 90%);
  --ring: hsl(234 72% 53%);
  --radius: 0.5rem;
  --chart-1: hsl(234 72% 53%);
  --chart-2: hsl(152 60% 40%);
  --chart-3: hsl(220 15% 65%);
  --chart-4: hsl(280 60% 55%);
  --chart-5: hsl(30 80% 55%);
}
```

---

## 9. Implementation Checklist

The implementer should verify:
- [ ] Font loaded from URL above (Plus Jakarta Sans with weights 300-800)
- [ ] All CSS variables copied exactly from Section 8
- [ ] Mobile layout matches Section 4 (single column, fixed bottom button)
- [ ] Desktop layout matches Section 5 (2fr/1fr two-column)
- [ ] Hero element is prominent with left indigo border accent
- [ ] Colors create the professional, approachable mood described in Section 2
- [ ] CRUD patterns are consistent (same dialog for create/edit, AlertDialog for delete)
- [ ] Delete confirmations are in place
- [ ] All entries show edit/delete actions
- [ ] Toast notifications for all CRUD operations
- [ ] Loading skeleton shown while data loads
- [ ] Empty state with helpful message when no records exist
- [ ] Error state with retry option
