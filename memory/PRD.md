# JudgyGPT (The Judgy) - Product Requirements Document

## Product Overview
A full-stack AI chat application with a sarcastic, "judgy" but helpful personality. Built for thejudgy.com. Users get brutally honest advice with a sophisticated courtroom-themed UI.

## Core Requirements
1. **Landing = Chat**: Landing page serves directly as the chat interface. 5 free anonymous messages before requiring signup.
2. **Token Economy**: 50 free tokens on signup. 1 token per message. No subscriptions.
3. **Stripe Payments**: One-time token purchases via Stripe Checkout (Starter $5/50 tokens, Growth $15/200 tokens, Power $50/500 tokens).
4. **Light/Dark Mode**: Warm courtroom light theme (default) with dark mode toggle.
5. **Auth**: Email/password + Google OAuth. Resend-based password recovery.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: Python FastAPI (monolithic server.py)
- **Database**: MongoDB
- **Integrations**: OpenAI (Emergent LLM Key), Resend (emails), Google OAuth (Emergent Auth), Stripe (payments)

## What's Implemented
- [x] Anonymous chat (5 free messages) on landing page
- [x] Light/Dark mode toggle with courtroom aesthetic
- [x] Token-based economy (50 free on signup, 1 per message)
- [x] Stripe one-time token purchases (3 packages)
- [x] Google OAuth sign-in/sign-up
- [x] Email/password authentication
- [x] Password reset via Resend
- [x] Pricing page with live Buy buttons
- [x] Chat page with token tracking
- [x] Theme persists across sessions (localStorage)

## Backlog
- [ ] (P1) Apple Sign-In (requires Apple Developer account)
- [ ] (P2) Refactor server.py into modular routes (auth, chat, payments, viral_tools)
- [ ] (P2) Admin Dashboard (track signups, tokens, messages)
- [ ] (P2) Viral marketing tools (Roast My Bio, Red Flag Detector)
- [ ] (P3) Community/Wall of Shame feature

## Key API Endpoints
- `POST /api/chat/anonymous` - Anonymous chat (5 free)
- `POST /api/chat` - Authenticated chat (1 token/msg)
- `GET /api/tokens/packages` - List token packages
- `POST /api/tokens/checkout` - Create Stripe checkout session
- `GET /api/tokens/checkout/status/{session_id}` - Poll payment status
- `POST /api/webhook/stripe` - Stripe webhook handler
- `POST /api/auth/register` / `POST /api/auth/login`
- `GET /api/auth/me` - Current user + token balance
- `POST /api/auth/forgot-password` / `POST /api/auth/reset-password`

## DB Schema
- `users`: {id, email, name, password_hash, tokens, auth_provider, subscription_plan, created_at}
- `payment_transactions`: {session_id, user_id, user_email, plan_id, amount, currency, status, payment_status, metadata}
- `password_reset_tokens`: {token, email, expires_at}
- `chat_messages`: {session_id, role, content, timestamp}
