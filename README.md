# GradeMate — Nuxt 3 Rewrite

> Your academic journey, tracked. A full-product GPA calculator built with Nuxt 3, Pinia, and Chart.js.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

---

## Project structure

```
grademate/
├── app/
│   ├── app.vue                    # Root with page transitions
│   ├── error.vue                  # 404 page
│   ├── components/
│   │   └── ColorModeToggle.vue    # Dark/light toggle
│   ├── layouts/
│   │   ├── default.vue            # Marketing layout (header + footer)
│   │   ├── auth.vue               # Auth layout (centered card, blurred bg)
│   │   └── dashboard.vue          # App layout (sidebar + topbar)
│   ├── middleware/
│   │   ├── auth.ts                # Redirect unauthenticated users → /login
│   │   └── guest.ts               # Redirect authenticated users → /dashboard
│   ├── pages/
│   │   ├── index.vue              # Landing page
│   │   ├── login.vue              # Sign in
│   │   ├── register.vue           # Create account
│   │   └── dashboard/
│   │       ├── index.vue          # Overview — CGPA, chart, stats
│   │       ├── semesters.vue      # Academic years + course entry
│   │       ├── forecast.vue       # Target grade forecaster
│   │       └── settings.vue       # Profile, scale, data export
│   └── stores/
│       ├── auth.ts                # User auth state (localStorage-backed)
│       └── academic.ts            # Years → Semesters → Courses + GPA logic
├── assets/css/
│   └── main.css                   # Design tokens, reset, utilities, buttons
├── nuxt.config.ts
└── package.json
```

---

## Pages

| Route                  | Layout    | Auth       | Description                                              |
|------------------------|-----------|------------|----------------------------------------------------------|
| `/`                    | default   | public     | Landing page — hero, features, how-it-works, scales, CTA |
| `/login`               | auth      | guest-only | Sign in form with demo shortcut                          |
| `/register`            | auth      | guest-only | Registration with scale selection + password strength    |
| `/dashboard`           | dashboard | required   | Overview — CGPA ring, stats, GPA chart, recent semesters |
| `/dashboard/semesters` | dashboard | required   | Add years/semesters, course entry table                  |
| `/dashboard/forecast`  | dashboard | required   | Target CGPA forecaster + scenarios table                 |
| `/dashboard/settings`  | dashboard | required   | Profile, theme, grading scale, data export               |

---

## Design system

All tokens live in `assets/css/main.css` as CSS custom properties.

**Palette:** Navy base (`--navy-*`) with amber accent (`--amber-*`, `--accent`).  
**Typography:** `Fraunces` (display headings, numbers) + `DM Sans` (UI text).  
**Dark/light:** Class-based via `@nuxtjs/color-mode`. Override with `.light {}` selectors.  
**Breakpoints:** Mobile ≤480px, tablet ≤768px, desktop ≥900px.

---

## Data model

```
User (localStorage: grademate_user)
  └── AcademicYear[]  (localStorage: grademate_years)
        └── Semester[]
              └── Course[]
                    ├── name, code
                    ├── credits (number)
                    ├── grade (string — from active scale)
                    └── gradePoints (number)
```

Computed: `Semester.gpa`, `Semester.totalCredits`, `Store.cgpa` (weighted average across all semesters).

---

## Grading scales

| Scale              | Max | Configured grades            |
|--------------------|-----|------------------------------|
| 4.0 (US)           | 4.0 | A+ through F (11 grades)     |
| 5.0 (NG)           | 5.0 | A through F (6 grades)       |
| UK Classifications | 4.0 | First, 2:1, 2:2, Third, Fail |

Switch in `/dashboard/settings`. Switching recalculates GPA values; raw grades remain stored.

---

## Connecting a real backend

The auth store (`stores/auth.ts`) currently mocks login/register with a setTimeout.  
Replace those functions with real API calls:

```typescript
// stores/auth.ts — replace mock login
async function login(email: string, password: string) {
    isLoading.value = true
    const res = await $fetch('/api/auth/login', {
        method: 'POST', body: {email, password}
    })
    user.value = res.user
    // store token in httpOnly cookie via useRuntimeConfig or useCookie
    isLoading.value = false
}
```

For the academic data store, replace `persist()` calls with API syncs and keep localStorage as an optimistic cache.

**Recommended backend:** Laravel (as planned) with these endpoints:

- `POST /api/auth/login|register|logout`
- `GET|POST|DELETE /api/years`
- `GET|POST|DELETE /api/years/:id/semesters`
- `GET|POST|PUT|DELETE /api/semesters/:id/courses`

---

## Next steps (from roadmap)

- [ ] **PDF export** — use `jsPDF` + `html2canvas` on the semester view
- [ ] **Course templates** — pre-filled degree templates (Phase 4 growth lever)
- [ ] **Laravel backend** — replace mock auth + localStorage with real API
- [ ] **SEO landing pages** — `/calculator/4-0-gpa`, `/calculator/uk`, etc. (needs Nuxt SSR)
- [ ] **Keyboard navigation** — Tab/Enter traversal across the course input table

---

## Scripts

```bash
npm run dev       # Dev server at localhost:3000
npm run build     # Production build
npm run generate  # Static site generation (for Netlify/Vercel)
npm run preview   # Preview production build locally
```

Deploy to Netlify: set build command to `npm run generate`, publish dir to `.output/public`.
