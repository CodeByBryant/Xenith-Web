<div align="center">

# ✦ Xenith

**Discipline · Intention · Execution**

A minimalist productivity platform for students and young professionals who are done drifting.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=flat&logo=vercel&logoColor=white)](https://xenith.life/)

[Live Site](https://xenith.life/) · [Join the Waitlist](https://xenith.life/#waitlist) · [Follow @xenith.life](https://x.com/xenith.life)

</div>

---

## What is Xenith?

Most productivity apps are engineered to keep you coming back — not to make you better. Xenith is built differently. No streaks designed to create anxiety. No gamification or confetti. No checkbox theater. Just a clean, intentional system that compounds over time.

Xenith is for people who are serious about execution. Set intentions, track your life across every dimension, do the deep work, and reflect with honesty. That's the loop.

---

## Features

| Feature | Description |
|---|---|
| **Daily Intentions** | Purpose-driven planning. Every action connects to your larger goals — or it doesn't belong. |
| **Life Dimensions** | Track 8 key areas of life with a radar chart. See exactly where you're thriving and where you're slipping. |
| **Focus Studio** | Deep-work sessions with energy tracking. Custom durations, distraction logging, and Pomodoro built-in. |
| **Reflection** | Daily and weekly reviews that actually challenge you to grow. |
| **Growth Path** | Build the six core traits: Discipline, Focus, Consistency, Endurance, Insight, and Resolve. |
| **Insights** | Pattern recognition across your data. Understand your tendencies. Optimize ruthlessly. |

---

## Tech Stack

- **Framework** — [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool** — [Vite](https://vitejs.dev/)
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Animations** — [Framer Motion](https://www.framer.com/motion/)
- **Backend / Auth / DB** — [Supabase](https://supabase.com/)
- **Data Fetching** — [TanStack Query](https://tanstack.com/query)
- **Forms & Validation** — [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Routing** — [React Router v6](https://reactrouter.com/)
- **Deployment** — [Vercel](https://vercel.com/)
- **Testing** — [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Bun](https://bun.sh/) (recommended) or npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/CodeByBryant/Xenith-Web.git
cd Xenith-Web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## Project Structure

```
src/
├── components/
│   ├── sections/      # Page sections (Hero, Features, Pricing, …)
│   ├── ui/            # Reusable UI primitives (shadcn/ui)
│   └── …              # Header, Footer, WaitlistForm, etc.
├── hooks/             # Custom React hooks
├── pages/             # Route-level page components
├── context/           # React context providers
├── lib/               # Utilities and helpers
└── styles/            # Global styles
```

---

## Pricing

| | Free | Pro |
|---|:---:|:---:|
| Daily intentions | Up to 3 | Unlimited |
| Life dimensions tracking | ✓ | ✓ |
| Custom focus durations | — | ✓ |
| Distraction logging | — | ✓ |
| Reflection & mood tracking | ✓ | ✓ |
| Unlimited routines | — | ✓ |
| Full analytics history | — | ✓ |
| Data export | — | ✓ |
| **Price** | **$0** | **$4.99/mo** _(or $3.49/mo billed annually)_ |

Currently in **free beta** — no credit card required.

---

## Contributing

Xenith is in active development. If you spot a bug or have a feature idea, [open an issue](https://github.com/CodeByBryant/Xenith-Web/issues).

---

## License

© 2026 Xenith. All rights reserved. Built for the ambitious. By the ambitious.
