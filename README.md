# NL First 100

Mobile-first onboarding guide for international students in the Netherlands.

## What This Is

NL First 100 is a static Next.js prototype for testing a first-100-days onboarding flow with 5-10 students. It helps students complete onboarding, see a personalised dashboard, track checklist progress, search curated FAQs, read topic guides, and save local feedback for export.

The app is local-only. It does not use login, a database, backend API routes, external API calls, or an AI chatbot.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest
- Static JSON content in `src/data`
- Browser `localStorage` for profile, progress, and feedback

## How To Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

No environment variables are required.

## How To Test

Run unit tests:

```bash
npm run test
```

Run linting:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

Run a production build:

```bash
npm run build
```

## How To Deploy To Vercel

1. Push the project to a Git repository.
2. Import the repository in Vercel.
3. Use the default Next.js framework preset.
4. Leave environment variables empty.
5. Deploy.

The app statically prerenders all normal routes and dynamic task/topic pages. Routes such as `/dashboard`, `/checklist/housing_sos`, `/topics/housing`, `/ask`, and `/feedback` work on refresh from a Vercel preview URL.

## LocalStorage Usage

The app stores testing data only in the current browser:

- `nlFirst100:v1:profile`
- `nlFirst100:v1:taskProgress`
- `nlFirst100:v1:feedbackResponses`
- `nlFirst100:v1:onboardingCompleted`
- `nlFirst100:v1:contentVersion`
- `nlFirst100:v1:lastVisitedAt`

Clearing local data removes the profile, progress, feedback, onboarding flag, content version, and last visited timestamp. The feedback clear button removes only saved feedback.

## How To Edit Content JSON

Static content lives in `src/data`:

- `tasks.json`
- `topics.json`
- `official-sources.json`
- `student-tips.json`
- `ask-contacts.json`
- `faqs.json`
- `content-meta.json`

Keep IDs stable after testing starts, because saved task progress and feedback source IDs refer to those IDs. After editing content, run:

```bash
npm run test
npm run typecheck
npm run build
```

The content integrity test fails if duplicate IDs or broken references are introduced.

## Demo Flow

Use this path for a student test:

1. Open `/`.
2. Start onboarding.
3. Complete all five questions.
4. Review `/dashboard`.
5. Open `/checklist`.
6. Open a task guide and mark a task done.
7. Refresh the browser and confirm progress remains.
8. Search `/ask` for `BSN`.
9. Submit feedback.
10. Export feedback from `/feedback`.

On mobile, downloading JSON/CSV may depend on the browser. For a test session, export feedback on desktop if mobile download behavior is limited.

## Known MVP Limitations

- Data is stored only in one browser on one device.
- There is no account sync, admin panel, database, or analytics.
- Official source links are static seed data and should be reviewed before each test round.
- Feedback exports are manual JSON/CSV downloads.
- The FAQ search is curated keyword search over `faqs.json`, not a chatbot.
