# Web_App_Registration_Janiser

Participant website and registration form for the clinical study **PB-TRD-2-Study 26/27**
(the JANISER probiotic study in recurrent depression), published at
**https://mdd-study.nutriminds.net/**.

It is a one-page React site in five languages (English, Deutsch, Español, Ελληνικά, Shqip).
There is no separate database: registrations are sent to the **NutriMinds Survey** WordPress
plugin on nutriminds.net and stored in its WordPress database, under the project
"TRD-2-STUDY26/27".

```
Visitor ──► mdd-study.nutriminds.net (this app, static files)
               │  POST JSON
               ▼
           nutriminds.net/wp-json/nms/v1/register  (nutriminds-survey plugin)
               │
               ├─► WordPress database (NutriMinds Survey → All Registrations)
               ├─► confirmation email to the registrant (EN/DE)
               └─► notification email to the study team (EN + DE)
```

For how the code is organised — which file does what, and the main functions — see
**[docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)**.

## Quick start

Requires Node.js 20+ (developed on Node 24).

```bash
npm install
cp .env.example .env.local   # then edit, see "Configuration"
npm run dev                  # http://localhost:5180
```

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Development server on **port 5180** (5173 is used by another project) |
| `npm run build`   | Type-checks and builds the static site into `dist/`       |
| `npm run preview` | Serves the built `dist/` on port 5181                     |
| `npm run lint`    | Runs oxlint                                               |

## Configuration

Two settings, read at build time from `.env.local` (development) or
`.env.production.local` (production build). Both files are ignored by git.

| Variable                     | Meaning                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| `VITE_REGISTRATION_ENDPOINT` | The plugin's REST endpoint, e.g. `https://nutriminds.net/wp-json/nms/v1/register` |
| `VITE_NMS_PROJECT_ID`        | WordPress ID of the "TRD-2-STUDY26/27" project (**698** on production)   |

If either is missing, the form runs in **demo mode**: it validates and shows the
confirmation, but sends nothing, and says so on the page.

For local development against the local WordPress (`http://localhost:8088`), use the local
endpoint and local project ID shown in `.env.example`, and allow the dev server in that
WordPress's `wp-config.php`:

```php
define( 'NMS_ALLOWED_ORIGINS', 'http://localhost:5180' );
```

## Deploying

1. Make sure the **nutriminds-survey** plugin on nutriminds.net is version **1.2.0 or later**
   (it provides the REST endpoint and the team notification email).
2. In wp-admin → NutriMinds Survey → Projects, check the ID of "TRD-2-STUDY26/27" and that it has no
   past end date.
3. Create `.env.production.local` with the production values from `.env.example`.
4. `npm run build`
5. Upload the **contents** of `dist/` to the document root of `mdd-study.nutriminds.net` on SiteGround.

The site is plain static files; no Node.js is needed on the server.

## Before launch

- Text marked `[ … ]` (highlighted yellow on the page) is a placeholder still to be supplied:
  response time, contact email/phone, compensation, sponsor, address, imprint, ethics committee.
- Translations of passages revised in `PB-TRD-2-Study.pdf` (hero, About, eligibility, Day 0,
  reminders, Register intro, blinding FAQ) and all interface text are new and need a native-speaker
  review. Consent wording must match the ethics-approved Participant Information Sheet and ICF.
- Document links (Participant Information Sheet, Privacy Notice, …) point to the Privacy section
  until the real files exist.
- "My Study Area" is descriptive only; the participant login is not built yet.
- Illustrations in `src/assets/illustrations/` are placeholders drawn for this site; they can be
  replaced with the final images from the design team.

## Source material

- `PB-TRD-2-Study.pdf` — current English copy (highlighted passages are the revised wording used). Kept locally, not in the repository.
- Copy deck with the five translations: sponsor email "MDD-study.org" of 29 July 2026
  (older wording; see "Before launch").
