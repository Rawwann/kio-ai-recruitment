# KIO Frontend

This repository contains the Next.js frontend for the KIO AI-powered recruitment platform.

The app provides:
- a marketing landing page for recruiters and candidates
- login/signup and password reset flows
- candidate dashboard with CV upload, GitHub connection, application tracking, and simulation status
- company/recruiter dashboard with project management, candidate sourcing, analytics, and billing
- role-based access control for candidate and company users
- PWA support, offline page, and modern animations

## Key features

### Candidate experience
- account creation and login via email/password
- candidate profile onboarding and CV upload
- GitHub connection flow for code activity analysis
- active simulations, application history, and personalized dashboard stats
- separate candidate routes behind authentication

### Company/recruiter experience
- company dashboard with KPIs, applicant funnel, and live recruitment alerts
- project creation, editing, and candidate review pages
- billing and upgrade flows powered by Stripe
- company profile management and team settings
- separate recruiter/company routes with RBAC enforced in middleware

### Platform and integration
- Next.js 16 app router
- NextAuth for authentication and session management
- custom credentials provider that authenticates against a Django backend
- social auth callback support via GitHub OAuth
- dynamic backend API integration through `DJANGO_BASE_URL` and `NEXT_PUBLIC_DJANGO_URL`
- `next-pwa` for offline support and installable experience

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth
- `react-hook-form` + Zod validation
- `next-pwa`
- `framer-motion`, `motion`, `recharts` and `react-icons`
- `react-dropzone` for file uploads
- `sonner` for toast notifications

## Project structure

- `src/app/` — route definitions and server/client page components
- `src/components/` — UI components, landing sections, auth forms, dashboard widgets
- `src/hooks/` — custom hooks for candidates, companies, projects, dashboards
- `src/lib/` — providers, auth config, API fetch helpers, and constants
- `src/types/` — shared TypeScript models for auth, company, candidate, billing, and project data
- `public/` — static assets, PWA manifest, icons, and marketing graphics

## Environment variables

The app depends on the following variables in a `.env` file or your environment:

- `DJANGO_BASE_URL` — backend API base URL (default: `http://127.0.0.1:8000`)
- `NEXT_PUBLIC_DJANGO_URL` — public backend URL for browser-side OAuth redirects
- `NEXT_PUBLIC_GITHUB_REDIRECT_URI` — GitHub OAuth redirect callback URI
- `NEXTAUTH_SECRET` — secret for NextAuth JWT session signing

## Running locally

```bash
cd d:\vsCode\kio-front-c0\gp-kio-v1
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build and deploy

```bash
npm run build
npm start
```

Because the app uses `next-pwa`, the service worker is only enabled outside of development mode.

## Notes

- This frontend is built to work with a Django backend service that exposes authentication, candidate, and project APIs.
- Route protection is implemented in `src/proxy.ts` and handles redirecting unauthenticated users and isolating candidate/company routes.
- OAuth social login flow is handled by the `/auth/social-callback` page and backend GitHub connect endpoints.
- Candidate CV upload is proxied through `src/lib/api/candidateService.ts` and sent to the backend as multipart form data.

## Useful commands

- `npm run dev` — start development server
- `npm run build` — build production app
- `npm start` — start production server
- `npm run lint` — run ESLint

```
gp-kio-v1
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ bg-gradients.png
│  ├─ bg-lines.svg
│  ├─ feature-1.png
│  ├─ feature-2.png
│  ├─ feature-3.png
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ hero-bg.png
│  ├─ hero-img.png
│  ├─ heroBG.png
│  ├─ herosection-img.png
│  ├─ logo.svg
│  ├─ next.svg
│  ├─ placeholder.png
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  ├─ privacy-policy
│  │  │  │  └─ page.tsx
│  │  │  ├─ reset-password
│  │  │  │  └─ page.tsx
│  │  │  ├─ signup
│  │  │  │  └─ page.tsx
│  │  │  └─ terms-and-conditions
│  │  │     └─ page.tsx
│  │  ├─ (dashboard)
│  │  │  ├─ company
│  │  │  │  ├─ candidates
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ profile
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ projects
│  │  │  │     ├─ create
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ edit
│  │  │  │     │  └─ [id]
│  │  │  │     │     └─ page.tsx
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ [id]
│  │  │  │        └─ page.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (public)
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ api
│  │  │  └─ auth
│  │  │     └─ [...nextauth]
│  │  │        └─ route.ts
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  ├─ components
│  │  ├─ aceternity
│  │  │  ├─ card-hover-effect.tsx
│  │  │  └─ moving-border.tsx
│  │  ├─ auth
│  │  │  ├─ CVLoadingScreen.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ login-form.tsx
│  │  │  ├─ reset-password
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ InfoPanel.tsx
│  │  │  │  ├─ Step1_ForgotPassword.tsx
│  │  │  │  ├─ Step2_VerifyCode.tsx
│  │  │  │  ├─ Step3_ResetForm.tsx
│  │  │  │  └─ Stepper.tsx
│  │  │  └─ signup-form.tsx
│  │  ├─ billing
│  │  │  ├─ AddCardDialog.tsx
│  │  │  ├─ CreditCardUI.tsx
│  │  │  └─ UpgradePlanDialog.tsx
│  │  ├─ company
│  │  │  ├─ CompanyProfilePage.tsx
│  │  │  ├─ CompanySidebar.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ LinkedInSyncDialog.tsx
│  │  │  ├─ LogoUpload.tsx
│  │  │  ├─ MagicSearchBar.tsx
│  │  │  ├─ StatusBadge.tsx
│  │  │  └─ tabs
│  │  │     ├─ BillingTab.tsx
│  │  │     ├─ GeneralInfoTab.tsx
│  │  │     ├─ index.ts
│  │  │     ├─ NotificationsTab.tsx
│  │  │     ├─ SecurityTab.tsx
│  │  │     └─ TeamMembersTab.tsx
│  │  ├─ dashboard
│  │  │  ├─ ChartsSection.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ KPIStats.tsx
│  │  │  ├─ LiveFeed.tsx
│  │  │  ├─ RightPanel.tsx
│  │  │  └─ TopHeader.tsx
│  │  ├─ landing
│  │  │  ├─ ComparisonSection.tsx
│  │  │  ├─ CTASection.tsx
│  │  │  ├─ FaqSection.tsx
│  │  │  ├─ FeaturesSection.tsx
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ HowItWorksSection.tsx
│  │  │  └─ PricingSection.tsx
│  │  ├─ layout
│  │  │  ├─ footer.tsx
│  │  │  └─ navbar.tsx
│  │  ├─ legal
│  │  │  ├─ PrivacyPolicy.tsx
│  │  │  └─ TermsAndConditions.tsx
│  │  ├─ magicui
│  │  │  ├─ animated-list.tsx
│  │  │  ├─ border-beam.tsx
│  │  │  ├─ confetti.tsx
│  │  │  ├─ number-ticker.tsx
│  │  │  ├─ retro-grid.tsx
│  │  │  └─ shimmer-button.tsx
│  │  ├─ shared
│  │  │  ├─ ProjectForm.tsx
│  │  │  ├─ Providers
│  │  │  │  └─ Provider.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  └─ Wrapper
│  │  │     ├─ HeroFeaturesLayout.tsx
│  │  │     └─ PageBackground.tsx
│  │  ├─ signup
│  │  │  ├─ SignupStepper.tsx
│  │  │  ├─ Step1Role.tsx
│  │  │  ├─ Step2Details.tsx
│  │  │  └─ Step3CV.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ date-picker-custom.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ field.tsx
│  │     ├─ form.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ Stepper.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     └─ textarea.tsx
│  ├─ hooks
│  │  ├─ useCompanyProfilePage.ts
│  │  ├─ useCVLoadingSteps.ts
│  │  ├─ useGeneralInfoTab.ts
│  │  ├─ useLoginForm.ts
│  │  ├─ useSecurityTab.ts
│  │  ├─ useSignupForm.ts
│  │  ├─ useSignupFormHandler.ts
│  │  └─ useTeamMembersTab.ts
│  ├─ lib
│  │  ├─ auth
│  │  │  ├─ authOptions.ts
│  │  │  └─ next-auth.d.ts
│  │  ├─ constants
│  │  │  ├─ generalInfoOptions.ts
│  │  │  ├─ index.ts
│  │  │  ├─ notificationRows.ts
│  │  │  ├─ pricingTiers.ts
│  │  │  ├─ projectStatus.ts
│  │  │  ├─ roles.ts
│  │  │  ├─ stepper.ts
│  │  │  └─ tabConfig.ts
│  │  ├─ contexts
│  │  │  ├─ CompanyContext.tsx
│  │  │  └─ ProjectContext.tsx
│  │  ├─ schemas
│  │  │  ├─ auth.schema.ts
│  │  │  ├─ company.schema.ts
│  │  │  └─ index.ts
│  │  └─ utils.ts
│  └─ types
│     ├─ auth..ts
│     ├─ billing.ts
│     ├─ common.ts
│     ├─ company.ts
│     └─ index.ts
├─ structure.txt
├─ tsconfig.json
└─ __mocks__
   └─ company.mock.ts

```