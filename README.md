# Bunny's Academy - AI LMS Starter

An approachable AI-powered LMS starter. Upload courses, stream lessons, and chat with an AI tutor about your content. Simple enough for beginners to run, flexible enough to grow.

## Live Demo

Not deployed yet - run locally with the steps below.

## What You Can Do

- AI Tutor: Ask questions about your course content and get quick answers.
- Lessons and Modules: Browse courses, modules, and lessons with gated tiers.
- Admin and Studio: Manage content via a custom admin plus Sanity Studio fallback.
- Auth and Billing: Clerk-powered sign-in and tiered access (Free/Pro/Ultra).

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- Sanity (content), Clerk (auth/billing), Mux (video), OpenAI (AI tutor)

## Getting Started

Clone and install:

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

- Main app: `/`
- Admin: `/admin`
- Sanity Studio: `/studio`

## Environment Variables

Create `.env.local` with your keys:

- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- OpenAI: `OPENAI_API_KEY`
- Mux: `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`, `MUX_SIGNING_KEY_ID`, `MUX_SIGNING_KEY_PRIVATE`

## Deploying (Vercel)

1. Push to GitHub.  
2. Import into Vercel.  
3. Add the env vars above.  
4. Deploy.

## Credits

- Built and customized for Bunny's Academy.  
- Learned to code and inspired by Sonny Sangha (PapaReact). Check out his work:
  - Website: https://www.papareact.com
  - YouTube: https://www.youtube.com/@SonnySangha
  - Twitter: https://twitter.com/SonnySangha

## License

This project includes adaptations of work by Sonny Sangha (PapaReact) and is provided under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may not use the material for commercial purposes. See https://creativecommons.org/licenses/by-nc/4.0/ for full terms.
