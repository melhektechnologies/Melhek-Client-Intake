# Melhek Client Discovery Wizard — Technical Specification

## Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0 | UI framework |
| react-dom | ^19.0 | DOM renderer |
| react-router-dom | ^7.0 | Client-side routing (3 routes: welcome, wizard, success) |
| @tanstack/react-form | ^1.0 | Headless form state management, field-level validation, array fields |
| zod | ^3.24 | Schema validation (step validation, data integrity) |
| zod-form-adapter | ^1.0 | Zod adapter for @tanstack/react-form |
| gsap | ^3.12 | Animation engine (step transitions, micro-interactions, scroll animations) |
| @gsap/react | ^2.1 | React integration for GSAP (useGSAP hook, auto-cleanup) |
| lenis | ^1.2 | Smooth scroll (validation error scroll, sticky nav) |
| lucide-react | ^0.460 | Icon library (all icons referenced in design) |

### Dev

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^6.0 | Build tool |
| @vitejs/plugin-react | ^4.3 | React Fast Refresh for Vite |
| typescript | ^5.7 | Type safety |
| tailwindcss | ^4.0 | Utility-first CSS |
| @tailwindcss/vite | ^4.0 | Tailwind Vite plugin |
| @types/react | ^19.0 | React type definitions |
| @types/react-dom | ^19.0 | ReactDOM type definitions |

---

## Component Inventory

### Layout

| Component | Source | Reuse |
|-----------|--------|-------|
| ProgressNav | Custom | Singleton — fixed top nav across all wizard steps. Shows step circles (desktop) or "Step X of 10" bar (mobile). Contains draft save status. |
| WizardLayout | Custom | Singleton — wraps step content: max-width container, form panel styling, sticky bottom button bar. |

### Sections (one per wizard step + 3 special)

| Component | Source | Notes |
|-----------|--------|-------|
| WelcomeSection | Custom | Hero entry (step 0). Full-viewport, not inside WizardLayout. Own CTA triggers route change to step 1. |
| CompanyInfoSection | Custom | Step 1. 2-column grid (desktop), standard inputs. |
| BusinessOverviewSection | Custom | Step 2. 3 full-width textareas + 2 inputs + 1 select. |
| ProjectTypeSection | Custom | Step 3. Multi-Select Card Grid (12 cards) + conditional "Other" field. |
| ProjectGoalsSection | Custom | Step 4. 3 full-width textareas. |
| RequiredFeaturesSection | Custom | Step 5. Collapsible category groups (8 categories, ~50 features). Largest step. |
| DesignPreferencesSection | Custom | Step 6. File uploads, color pickers, smaller Multi-Select Card Grid (8 style cards). |
| ContentAvailabilitySection | Custom | Step 7. Checklist with conditional follow-ups that expand per item. |
| TechnicalRequirementsSection | Custom | Step 8. Radio groups + pill-based multi-select tag row for integrations. |
| TimelineBudgetSection | Custom | Step 9. Date input, custom segmented control, Range Slider. |
| StrategicIntelligenceSection | Custom | Step 10. 4 textareas (3 required, 2 optional). |
| ReviewPage | Custom | Summary view. 10 collapsible review cards. Sticky submit bar with confirmation checkbox. |
| SuccessPage | Custom | Standalone page. SVG draw animation, confetti, typewriter, 3-step timeline. |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| FormInput | Custom | All steps — text, email, tel, url, number, date inputs. Handles label, placeholder, error, focus ring, required asterisk. |
| TextareaField | Custom | Steps 1, 2, 4, 6, 7, 9, 10 — auto-resize, character counter, min/max height. |
| SelectDropdown | Custom | Steps 1, 2, 7, 8 — styled select with custom dropdown panel, GSAP open animation. |
| MultiSelectCard | Custom | Steps 3, 6 — toggleable card grid. Accepts icon, title, description, selected state. |
| FeatureChecklist | Custom | Steps 5, 7, 8 — checkbox with label + optional description. Category grouping wrapper included. |
| FileUploadZone | Custom | Steps 6, 7 — drag-and-drop zone with file list, progress bar, delete. |
| RangeSlider | Custom | Step 9 — styled range input with gradient fill, thumb styling, value labels. |
| WizardButtons | Custom | All 10 step sections — Back/Next/Skip button group with responsive stacking. |
| Tooltip | Custom | SuccessPage (copy feedback) — positioned tooltip with arrow. |
| RadioGroup | Custom | Step 8 — horizontal/vertical radio with conditional reveal. |
| SegmentedControl | Custom | Step 9 — urgency selector, animated background slide. |
| ColorPicker | Custom | Step 6 — native color input in custom wrapper + synced hex text field, add/remove rows. |
| ReviewCard | Custom | ReviewPage — collapsible card with section icon, edit link, field display, tag pills. |

### Hooks

| Hook | Purpose |
|------|---------|
| useAutoSave | Debounced auto-save to localStorage (2s delay). Returns save status, lastSaved timestamp, restore function. |
| useStepTransition | GSAP step change orchestration: exit current (fade+slide), update progress, enter next (staggered fields). Returns transition state to block interactions during animation. |
| useConfetti | GSAP particle system: spawns N colored particles at origin, applies random angle+force+gravity, fades over 1.5s. |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Step transitions (forward/back) | GSAP timeline | **Sequence**: (1) fade/slide out current content, (2) update ProgressNav state, (3) slide in new content, (4) stagger fields 0.05s. Forward: exit left (-40px), enter from right (+40px). Back: reverse. useStepTransition hook owns the timeline, takes direction param. | High 🔒 |
| Jump navigation (crossfade) | GSAP | Simple crossfade 0.25s out + 0.35s in with scale 0.98→1. No directional slide. | Medium |
| Staggered field reveal | GSAP | Per-step querySelectorAll on field wrappers, stagger fromTo opacity+y. Driven by useStepTransition after content enters. | Medium |
| Welcome headline split-text | GSAP SplitText | Split into words, stagger fade+slide per word (0.08s). Triggered on mount with 0.3s delay. SplitText plugin required. | Medium |
| Welcome elements sequence | GSAP timeline | Chained: subtitle fades after headline, button scales after subtitle, trust indicators after button. Single timeline on mount. | Low |
| Hero illustration parallax | CSS transform | mousemove listener on container, apply translate(-x*0.01, -y*0.01) with CSS transition. Lightweight, no library needed. | Low |
| Multi-select card pulse | GSAP | Scale 1→1.03→1 on selection toggle. Duration 0.3s, ease back.out(1.7). Inline on card click handler. | Low |
| Project type cards stagger entrance | GSAP | 12 cards: stagger 0.06s, fromTo opacity+y+scale. Triggered when step 3 mounts. | Low |
| Dropdown open | GSAP fromTo | opacity 0→1, y: -8→0. Duration 0.2s. Triggered on select focus/click. | Low |
| Error shake | GSAP | x: -4→4→-4→4→0 over 0.4s. Triggered on validation fail. | Low |
| Error message slide | GSAP | height: 0→auto + opacity 0→1, 0.25s. Triggered when error appears. | Low |
| Feature selection micro-animations | GSAP | Checkbox scale pulse 1→1.15→1 (0.2s) + category badge background flash to gold-light and back (0.3s). | Low |
| Category expand/collapse | GSAP | height: 0↔auto (0.3s) + chevron rotation 0↔180 (0.25s). Used in RequiredFeaturesSection and ReviewCard. | Low |
| Conditional field reveal | GSAP | height: 0→auto (0.3s). Used throughout: "Other" project type, custom software field, color picker add, content follow-ups, domain/hosting conditionals. | Low |
| Integration tag selection | CSS transition | background-color + color transition 0.25s. No JS animation needed. | Low |
| Segmented control slide | GSAP / CSS | Background pill slides to selected segment. Can use CSS transition on left/width if structured as absolute positioned element, or GSAP tween for smoother interpolation. | Low |
| Review cards stagger entrance | GSAP | 10 cards: stagger 0.08s, fromTo opacity+y (24px). Triggered on ReviewPage mount. | Low |
| Review card post-edit flash | GSAP | Background pulses to rgba(200,169,126,0.1) and back, 0.5s. Triggered when returning from edit. | Low |
| Success checkmark SVG draw | GSAP DrawSVG | stroke-dashoffset animation from full to 0, 0.6s. Requires DrawSVG plugin. | Medium |
| Success circle pulse | GSAP | Scale 1→1.05→1 (0.4s sine) then continuous 1→1.02 loop (2s). Part of post-checkmark timeline. | Low |
| Confetti burst | GSAP timeline | 50 particles: random angle (0-360°), random distance (80-200px), animate outward with physics easing (gsap physics2d or manual gravity simulation via y tween with ease none + x tween), fade opacity over 1.5s. Triggered 0.3s after checkmark completes. useConfetti hook. | High 🔒 |
| Submission ID typewriter | Custom hook | setInterval at 40ms per character, renders substring progressively. Cleanup on completion. | Low |
| What Happens Next timeline stagger | GSAP | 3 steps: stagger 0.15s, fromTo opacity+x (-16px). Delay 2.2s after page load. | Low |
| Progress bar fill | GSAP | Width tween on the fill element, 0.5s power2.out. Triggered on step change. | Low |
| Progress circle scale pulse | GSAP | Scale 1→1.2→1 on step completion, 0.3s. | Low |
| Auto-save indicator | GSAP | Opacity 0→1 (0.3s), hold 2s, fade out. Simple timeline on each save trigger. | Low |
| Smooth scrolling | Lenis | Global instance with lerp 0.1. Used for: general page scroll, validation error auto-scroll to first error field. | Low |

---

## State & Logic Plan

### Form Architecture

The wizard uses **@tanstack/react-form** (not react-hook-form) because the design requires:
- Field-level validation with debounced error display (validate on blur)
- Complex nested form types (file arrays, dynamic color rows, conditional follow-up fields)
- Array fields (feature selections, content checklist items)
- Deep partial submission for auto-save (all values as JSON to localStorage)

**Zod** provides the validation schemas — one per step. Each step validates independently on "Next". The review page validates the complete schema.

**Schema-per-step approach**: 10 Zod schemas, one for each step. The review page combines all 10 into a single master schema for full validation before submission. This avoids re-validating previous steps on every "Next" click.

### Step State Machine

The wizard is a finite state machine with 13 states: welcome (0), steps 1–10, review, success.

- **Transitions**: welcome→1 (start), N→N+1 (next, if valid), N→N-1 (back), review→N (edit jump), 10→review (next), review→success (submit)
- **State**: managed via React Router URL params (`/step/:number`, `/review`, `/success`, `/` for welcome). This enables browser back/forward navigation and direct URL access to specific steps.
- **Step data**: Each step's form data is stored in a single global form object (@tanstack/react-form with defaultValues). Individual step components subscribe only to their fields. No per-step state isolation — the form owns everything.
- **Progress indicator**: Derives current step from URL param, reads completion status from form validation state (has the step been visited and validated?).

### Conditional Field Logic

Several steps have fields that appear/hide based on other selections:

- **Step 3**: "Other" text input appears only when "Custom Software" card is selected.
- **Step 6**: Color picker rows can be dynamically added (max 5) or removed. Hex text and color picker stay in sync two-way.
- **Step 7**: Each checklist item has a conditional follow-up section that expands when the item is checked. Follow-up content varies per item (radio, number input, select, file upload, or textarea).
- **Step 8**: Domain name input appears when "No, we need help registering" is selected. Hosting provider input appears when "We have hosting" is selected. Custom integration text input appears when "Other" integration tag is selected.

Implementation: conditional rendering controlled by form field values accessed via @tanstack/react-form's `useField` or `useStore`. GSAP height animations wrap the conditional content for smooth expand/collapse.

### Auto-Save & Draft Restore

- **Trigger**: 2-second debounce after any field change (useAutoSave hook).
- **Storage**: localStorage key `melhek-draft-{timestamp}`. Stores form.values as JSON + metadata (current step, last saved).
- **Restore**: On initial load, check localStorage for existing draft. If found, show a toast notification offering restore. If accepted, hydrate form defaultValues from draft and navigate to last step.
- **Save indicator**: Pulses "Auto-saved" text in ProgressNav briefly on each save. Gold dot appears next to logo when unsaved changes exist (tracked via a dirty flag comparing current values to last saved).

### Submission Flow

1. User clicks "Submit" on review page (after confirmation checkbox).
2. Full Zod schema validation runs across all 10 steps.
3. If invalid: scroll to first error, highlight incomplete review cards with red border.
4. If valid: generate submission ID (`MT-{YYYY}-{XXXXX}` random), show loading state on button, POST to backend endpoint (placeholder — design specifies Google Sheets export, but backend integration is out of scope).
5. On success: navigate to `/success` route with submission ID passed via URL param or state.
6. On error: display error toast, keep user on review page.

### Data Export Structure

All form fields are structured as a flat JSON object with nested objects per section. Example:

```
{
  submissionId: "MT-2024-XXXXX",
  submittedAt: "ISO timestamp",
  companyInfo: { companyName, industry, contactPerson, ... },
  businessOverview: { description, productsServices, ... },
  projectType: ["website", "ecommerce"],
  projectGoals: { why, problem, success },
  requiredFeatures: ["auth", "payments", "analytics"],
  designPreferences: { logoFiles: [...], brandGuidelines: [...], colors: [...], style: [...], exampleWebsites },
  contentAvailability: { logo: { hasIt: true, needsHelp: false }, images: { hasIt: false, needsHelp: true, count: 0 }, ... },
  technicalRequirements: { domain, hosting, email, integrations: [...] },
  timelineBudget: { launchDate, urgency, budgetRange, budgetContext },
  strategicIntelligence: { challenges, manualProcesses, automate, growth, bottlenecks }
}
```

This structure is designed for direct mapping to Google Sheets columns (one top-level key per column group, JSON-stringified for nested data).

---

## Other Key Decisions

### Routing Strategy

React Router with 4 routes:
- `/` — WelcomeSection (step 0)
- `/step/:stepNumber` — WizardLayout + current step section (steps 1–10)
- `/review` — ReviewPage
- `/success` — SuccessPage (with submissionId param)

This gives the user browser history navigation (back button goes to previous step) and allows Melhek to link directly to any step. Route guards: accessing `/step/5` without having completed step 1 is allowed (no gating) — the form simply shows whatever data exists.

### File Upload Handling

File uploads are staged in memory as File objects (not uploaded to server during the wizard). The File Upload Zone component manages:
- Drag-and-drop via native HTML5 drag events
- File validation (type, size ≤ 10MB)
- File list state (add/remove)
- Visual progress simulation (GSAP-driven fill bar for UX, not actual upload)

On final submission, files would be sent as multipart/form-data. The design allows for max 10MB per file (up to 25MB for brand guidelines).

### No Component Library

The design's highly custom aesthetic (gold focus rings, coffee-colored buttons, specific radius values, card selection animations) means standard component libraries (shadcn, Material UI) would require more override work than building from scratch. All components are custom-built with Tailwind CSS, ensuring pixel-perfect adherence to the design tokens.

### GSAP Plugin Requirements

Three GSAP plugins are needed (all free as of 2025):
1. **SplitText** — Welcome headline word-by-word animation
2. **DrawSVG** — Success page checkmark stroke animation
3. **Physics2D** (optional) — Confetti particle gravity simulation. Can be replaced with manual tweens if plugin unavailable.

These are registered once at app initialization via `gsap.registerPlugin()`.

### Reduced Motion Support

A `useReducedMotion` hook (matchMedia `prefers-reduced-motion: reduce`) gates all GSAP animations: when active, all GSAP durations are set to 0 and CSS transitions are disabled via a global class. Form functionality remains fully intact.
