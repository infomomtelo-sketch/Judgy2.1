# JudgyGPT (The Judgy) - Product Requirements Document

## Product Overview
A multi-expert AI chat platform at thejudgy.com. 6 AI experts with unique personalities give real, expert-level answers. Built for viral sharing and organic growth.

## Core Requirements
1. **Multi-Expert Chat**: 6 AI experts — The Judgy (sarcastic advice), LinguaBot (translator), PropWhiz (real estate), CodeForge (coding), ViralMind (social media), IronCoach (fitness)
2. **Landing Page Flow**: Hero → Meet the Experts → Sample Conversations → Viral Tools → Social Proof → How it Works → Chat
3. **Token Economy**: 50 free tokens on signup. 1 token per message. One-time Stripe purchases.
4. **Viral Tools**: Roast My Bio, Red Flag Detector, Who's Right — all with shareable results (Twitter, native share, download image, copy text)
5. **Light/Dark Mode**: Warm courtroom theme (default light) with toggle
6. **Auth**: Email/password + Google OAuth. Resend-based password recovery.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: Python FastAPI (server.py)
- **Database**: MongoDB
- **Integrations**: OpenAI via Emergent LLM Key, Resend, Google OAuth, Stripe

## What's Implemented
- [x] 6 AI expert personas with unique system prompts
- [x] Guided landing page (Hero → Experts → Samples → Tools → Social Proof → How it Works → Chat)
- [x] Anonymous chat with 5 free messages per expert
- [x] Light/Dark mode toggle with courtroom aesthetic
- [x] Token-based economy (50 free on signup, 1 per message)
- [x] Stripe one-time token purchases (3 packages: $5/$15/$50)
- [x] Viral tools: Roast My Bio, Red Flag Detector, Who's Right
- [x] Share results: Twitter, native share, download image, copy text
- [x] SEO meta tags, Open Graph, Twitter Cards for thejudgy.com
- [x] Structured data (schema.org) for search engines
- [x] Social proof stats on landing page
- [x] Google OAuth sign-in/sign-up
- [x] Email/password authentication
- [x] Password reset via Resend

## Backlog
- [ ] (P1) Apple Sign-In (requires Apple Developer account)
- [ ] (P2) Refactor server.py into modular routes
- [ ] (P2) Admin Dashboard
- [ ] (P2) Form builder / mini-DocuSign feature
- [ ] (P3) Community Wall of Shame

## Key API Endpoints
- `GET /api/experts` - List all 6 AI expert personas
- `POST /api/chat/anonymous` - Anonymous chat with personality param
- `POST /api/chat` - Authenticated chat (1 token/msg)
- `GET /api/tokens/packages` - List token packages
- `POST /api/tokens/checkout` - Stripe checkout for tokens
- `POST /api/viral/roast-bio` - Roast a bio
- `POST /api/viral/red-flags` - Detect red flags
- `POST /api/viral/whos-right` - Settle an argument
