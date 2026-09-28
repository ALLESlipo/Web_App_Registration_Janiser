# Developer guide

What each file does, how the pieces fit together, and how to make the common changes.
Setup, configuration and deployment are in the [README](../README.md).

## Contents

1. [Architecture](#architecture)
2. [File map](#file-map)
3. [Languages and copy](#languages-and-copy)
4. [Components](#components)
5. [Registration flow](#registration-flow)
6. [WordPress plugin side](#wordpress-plugin-side)
7. [Styling](#styling)
8. [Common tasks](#common-tasks)
9. [Testing checklist](#testing-checklist)

## Architecture

- **React 19 + TypeScript**, built with **Vite**. A single page; the menu links jump to sections
  (`#about`, `#register`, …). There is no router and no state library.
- **All visible text lives in `src/content/`**, one file per language. Components never contain
  copy; they read it from the current language through `useLanguage()`.
- **No backend in this repo.** The registration form posts to the `nutriminds-survey` WordPress
  plugin (separate repo: `NutriMinds/wp-content/plugins/nutriminds-survey`), which stores the
  registration and sends the emails.
- **Everything is self-hosted** (fonts, flags, icons, illustrations are bundled). The page makes no
  requests to third parties — relevant for GDPR on a health-study site.

```
main.tsx
 └─ LanguageProvider            picks the language, provides { lang, setLang, t }
     └─ App                     page skeleton, section order
         ├─ Header              brand, LanguageSwitcher, section menu
         ├─ Hero, About, Eligibility, Timeline, Privacy,
         │  RegisterForm, StudyArea, Faq, Contact   (each reads its part of `t`)
         ├─ Footer
         └─ SafetyStrip         emergency notice pinned to the bottom of the screen
```

## File map

### Root

| File | Purpose |
| --- | --- |
| `index.html` | HTML shell; Vite injects the scripts. Title and meta description. |
| `vite.config.ts` | Vite config. Dev server port **5180**, preview **5181** (`strictPort`, so a busy port is an error rather than a silent switch). |
| `package.json` | Scripts (`dev`, `build`, `preview`, `lint`) and dependencies. |
| `tsconfig*.json` | TypeScript settings (strict, bundler resolution). |
| `.oxlintrc.json` | Linter rules. |
| `.env.example` | Template for `VITE_REGISTRATION_ENDPOINT` and `VITE_NMS_PROJECT_ID`. Real values go in `.env.local` / `.env.production.local` (ignored by git). |
| `PB-TRD-2-Study.pdf` | Source of the current English copy (local only, not committed). |
| `public/favicon.svg` | Browser tab icon. |

### `src/`

| File | Purpose |
| --- | --- |
| `main.tsx` | Entry point. Imports the bundled fonts and global CSS, wraps `App` in `LanguageProvider`. |
| `App.tsx` | Page skeleton: skip link, header, the sections in display order, footer, safety strip. |
| `index.css` | All styles. Design tokens (colors, fonts, radius, shadow) are CSS variables at the top in `:root`. |

### `src/content/` — site copy

| File | Purpose |
| --- | --- |
| `types.ts` | `Content` type (the shape every language must fill), `SECTION_IDS` (menu/section order and anchor ids), `STUDY_NAME`. |
| `en.ts` | English copy, from the PDF. The reference language. |
| `de.ts`, `es.ts`, `el.ts`, `sq.ts` | German, Spanish, Greek, Albanian copy. Same shape as `en.ts`; TypeScript reports anything missing. |

Inside copy strings, two light markups are rendered by `Text`:
`*text*` → **bold**, and `[ text ]` → highlighted placeholder (content still to be supplied).

### `src/i18n/` — language handling

| File | Exports | Purpose |
| --- | --- | --- |
| `languages.ts` | `LANGUAGES` | The list of languages: code, native name, flag image, content object. **Add a language here.** |
| | `LanguageCode` | Type of the codes (`'en' \| 'de' \| 'es' \| 'el' \| 'sq'`). |
| | `isLanguageCode(value)` | Type guard for untrusted input (URL, storage). |
| | `detectLanguage()` | Initial language: `?lang=` in the URL → last choice in `localStorage` → browser languages → English. |
| | `rememberLanguage(code)` | Saves the choice to `localStorage` and puts `?lang=` in the URL (shareable links). Storage errors are ignored. |
| `context.ts` | `LanguageContext`, `LanguageState` | The React context object and its value type. |
| `LanguageProvider.tsx` | `LanguageProvider` | Holds the current language in state, keeps `<html lang>` in sync, provides `{ lang, setLang, t }`. |
| `useLanguage.ts` | `useLanguage()` | Hook every component uses to get `t` (the current `Content`), `lang` and `setLang`. |

### `src/components/`

| File | Purpose |
| --- | --- |
| `Header.tsx` | Sticky header: brand, flag switcher, section menu (hamburger under 900 px). Highlights the section in view (IntersectionObserver) and publishes the header height as `--header-offset` (ResizeObserver) so anchor jumps are not hidden under it. |
| `LanguageSwitcher.tsx` | Row of flag buttons (`aria-pressed` marks the current one). Rendered twice by `Header`: in the bar, and inside the mobile menu (CSS shows one or the other). |
| `Section.tsx` | Shared section wrapper: anchor id, heading, optional subtitle, `tone="tinted"` for the cream background. |
| `Text.tsx` | Renders a copy string, turning `*bold*` and `[ placeholder ]` into markup. |
| `Hero.tsx` | Headline, intro, the two call-to-action buttons, gut–brain illustration. |
| `About.tsx` | Study description, probiotic illustration, fact cards. `FACT_ICONS` maps icons to facts **by position**. |
| `Eligibility.tsx` | Self-check list, medication warning, button to the form. |
| `Timeline.tsx` | "What to Expect" day-by-day timeline. |
| `Privacy.tsx` | Privacy intro, shield illustration, cards. `POINT_ICONS` maps icons to points by position. |
| `RegisterForm.tsx` | The registration form — see [Registration flow](#registration-flow). |
| `StudyArea.tsx` | Description of the future participant portal; login button disabled. `FEATURE_ICONS` by position. |
| `Faq.tsx` | Questions as native `<details>` accordions. |
| `Contact.tsx` | Contact cards (general, nurse, emergency). |
| `Footer.tsx` | Sponsor/legal placeholders, links, GCP statement, crisis note. |
| `SafetyStrip.tsx` | Emergency notice with a `tel:112` link, pinned to the bottom of the viewport on every screen. Required by the copy deck; keep it visible. |

### `src/assets/illustrations/`

`gut-brain.svg` (hero), `probiotic.svg` (About), `privacy-shield.svg` (Privacy). Hand-written SVG in
the site palette, used as decorative `<img alt="">`. To use photos instead, replace the file (or the
import in the component) — no other change is needed.

## Languages and copy

- `en.ts` is the reference. Every language file is typed as `Content`, so a missing or misspelled
  key fails `npm run build`.
- Arrays that the components pair with icons or ids by position must keep the **same order and
  length** in every language: `about.facts`, `privacy.points`, `studyArea.features`,
  `register.consents` (the `id`s are stored with each registration), `register.genders` and
  `register.contactTimes` (their `value`s are stored; only `label`s are translated).
- Language names in the "Preferred language" dropdown come from `LANGUAGES` and are always shown in
  their own language (e.g. "Deutsch"), so the stored value is the same whichever language the
  visitor used.

## Registration flow

`RegisterForm.tsx`:

1. **State** — `fields` (the inputs), `consents` (`{ [consentId]: boolean }`), `errors`, `status`
   (`idle` → `submitting` → `done`), and `honeypot` (a hidden field only bots fill).
2. **`validate(fields, consents, consentIds)`** — required fields, email format, phone format
   (`isValidPhone`, the same rule the plugin applies), a plausible date of birth, all consents ticked.
   Returns **error keys** (e.g. `'required'`), not text, so messages re-translate when the visitor
   switches language.
3. **`handleSubmit`** — on errors, focuses the first invalid field. Otherwise POSTs JSON to
   `VITE_REGISTRATION_ENDPOINT`:

   ```json
   {
     "first_name": "…", "last_name": "…", "birthday": "YYYY-MM-DD",
     "gender": "female|male", "phone": "…", "email": "…",
     "country": "…", "city": "…", "preferred_language": "Deutsch",
     "contact_time": "morning|afternoon|evening|any|",
     "project_id": 698, "consent": true,
     "consents": { "age": true, "pis": true, "voluntary": true, "data": true, "treatment": true },
     "language": "en|de", "website": ""
   }
   ```

   `language` controls the language of the plugin's confirmation email; the plugin only has English
   and German, so other site languages send `en`.
4. **`errorForStatus(status)`** — maps the plugin's HTTP status to a translated message:
   409 → already registered for this study, 429 → too many attempts, 400 → check your details,
   anything else → could not send.
5. **Demo mode** — if `VITE_REGISTRATION_ENDPOINT` or `VITE_NMS_PROJECT_ID` is missing, nothing is
   sent and an English developer notice is shown.

## WordPress plugin side

The plugin lives in the NutriMinds repo (`wp-content/plugins/nutriminds-survey/nutriminds-survey.php`,
class `NutriMinds_Survey`). The parts this site depends on (added in v1.2.0):

| Method / constant | Purpose |
| --- | --- |
| `register_rest_routes()` | Registers `POST /wp-json/nms/v1/register`. |
| `check_rest_origin()` | Accepts the request only if the browser's `Origin` is allowed: `ALLOWED_ORIGINS` (`https://mdd-study.nutriminds.net`), plus the `NMS_ALLOWED_ORIGINS` constant in `wp-config.php` and the `nms_allowed_origins` filter. Otherwise 403. |
| `handle_rest_registration()` | Reads the JSON body and calls `process_registration()`. |
| `process_registration()` | Shared by the REST endpoint and the plugin's own AJAX form: rate limit (8/hour/IP), honeypot, validation, duplicate check, storage, emails. Returns `{ success, status, message }`. |
| `registration_exists_for()` | Duplicate check: same email **or** phone **within the same project** → 409. |
| `OPTIONAL_TEXT_FIELDS` | Extra fields stored when present: `country`, `city`, `preferred_language`, `contact_time`. `consents` is stored as a comma list of ids. All appear in the CSV export. |
| `send_confirmation_email()` | Email to the registrant, in English or German. |
| `send_admin_notification()` | Email to the study team on every new registration, in English and German. Contains only the project, a reference number, the count so far and a dashboard link — no personal data. |
| `get_notification_recipients()` | Recipients from **NutriMinds Survey → Notifications** in wp-admin; falls back to the site admin email. |
| `MAIL_FROM` | All plugin emails are sent from `noreply@nutriminds.net`. |

Registrations are viewed and exported in wp-admin under **NutriMinds Survey → All Registrations**.

## Styling

- One stylesheet, `src/index.css`, organised by section with `/* ---------- … ---------- */` headings.
- **Tokens** in `:root`: palette after serafeimcare.eu — sky `#78b3ce`, sage `#80b7ad`,
  cream `#f6f4ee`, charcoal `#3b3b3b`. These light tones are for backgrounds and illustrations; text
  and buttons use the deeper `--color-primary` (`#2f6f8c`) and `--color-accent-deep` (`#356b62`),
  which meet WCAG AA contrast.
- **Fonts** (bundled via `@fontsource-variable/*`, imported in `main.tsx`): Jost for headings and
  Quicksand for body, as on serafeimcare.eu. Neither has Greek letters, so Manrope and Comfortaa follow
  in the font stacks; the browser downloads them only when Greek text is on screen.
- **Icons** come from `lucide-react`; **flags** from `flag-icons` (SVG files bundled at build time).
- Breakpoints: menu becomes a hamburger at 900 px; flags move into the menu at 560 px; hero and
  illustration columns stack at 860 px / 760 px.

## Common tasks

**Change some text** — edit it in every file under `src/content/` (the same key in each).

**Add a language** (e.g. Italian):
1. Copy `src/content/en.ts` to `it.ts`, rename the export to `it`, translate.
2. In `src/i18n/languages.ts`, import the flag (`flag-icons/flags/4x3/it.svg`) and the content, and
   add `{ code: 'it', name: 'Italiano', flag, content: it }` to `LANGUAGES`.
3. If the language needs other characters (like Greek), check that the fonts cover them.

**Add a section**:
1. Add its id to `SECTION_IDS` in `content/types.ts` (position = menu order) and a menu label under
   `nav` in every language file.
2. Add its text to `Content` and every language file.
3. Create the component using `<Section id=… title=…>` and place it in `App.tsx`.

**Add a form field**:
1. Add the label under `register.fields` in `Content` and every language file.
2. In `RegisterForm.tsx`: add it to `Fields` and the initial state, to `required` if mandatory, render
   it with `field(...)` or `select(...)`, and include it in the POST body.
3. In the plugin, store it (e.g. add it to `OPTIONAL_TEXT_FIELDS`) and add a CSV export column.

**Replace an illustration** — overwrite the file in `src/assets/illustrations/`, or change the import
in the component to a new image (keep a sensible `width`/`height` to avoid layout shift).

**Point to another project or environment** — change `VITE_NMS_PROJECT_ID` /
`VITE_REGISTRATION_ENDPOINT` and rebuild. A new origin (another study subdomain) must also be added
to the plugin's allowed origins.

## Testing checklist

Before a release, with `npm run build && npm run preview` and the local WordPress running:

- `npm run build` and `npm run lint` pass.
- Each flag switches the text, the URL gets `?lang=…`, and a reload keeps the language.
- The page does not scroll sideways at 390 px width in any language.
- Submitting an empty form shows an error on every required field and the consent box.
- A valid registration shows the confirmation and appears in wp-admin under the TRD project with
  country, city, preferred language, contact time and consents; the team notification email arrives.
- Submitting the same email again shows the "already registered for this study" message.
