# JudgyGPT (The Judgy) - Product Requirements Document

## Product Overview
A multi-expert AI chat platform at thejudgy.com. 6 AI experts with unique personalities give real, expert-level answers. Built for viral sharing and organic growth.

## Core Requirements
1. **Multi-Expert Chat**: 6 AI experts — The Judgy, LinguaBot, PropWhiz, CodeForge, ViralMind, IronCoach
2. **Landing Page Flow**: Hero → Experts → Samples → Viral Tools → Social Proof → How it Works → Chat
3. **Token Economy**: 50 free tokens on signup. 1 per message. Stripe one-time purchases.
4. **Viral Tools**: Roast My Bio, Red Flag Detector, Who's Right — shareable results
5. **Admin Dashboard**: Overview stats + Content Generator with AI-powered post creation & 7-day calendar
6. **Light/Dark Mode**: Warm courtroom theme with toggle
7. **Auth**: Email/password + Google OAuth + Resend password recovery

## What's Implemented
- [x] 6 AI expert personas with unique system prompts
- [x] Guided landing page with full onboarding flow
- [x] Anonymous chat (5 free messages per expert)
- [x] Light/Dark mode toggle
- [x] Token economy + Stripe purchases (3 packages: $5/$15/$50)
- [x] Viral tools with share buttons (Twitter, native, download, copy)
- [x] Admin Dashboard with stats, charts, recent activity
- [x] **AI Content Generator** — generate platform-specific posts (TikTok/Instagram/Twitter/LinkedIn/Reddit)
- [x] **7-Day Content Calendar** — AI generates a full week of posting ideas with platforms, times, and expert features
- [x] SEO meta tags, Open Graph, Twitter Cards
- [x] Google OAuth + email auth + password reset
- [x] Social proof on landing page

## Admin Dashboard (/admin)
- **Access**: hello@thejudgy.com only
- **Overview Tab**: Stats cards, expert usage chart, 14-day signups chart, recent signups/transactions
- **Content Generator Tab**: 
  - Generate Post: Pick platform + type + topic → AI generates ready-to-copy caption with hashtags and pro tips
  - Weekly Calendar: One-click 7-day content plan with specific ideas, platforms, times, and which expert to feature
  - Quick topic suggestions for common viral content ideas

## Backlog
- [ ] (P1) Apple Sign-In (requires Apple Developer account setup)
- [ ] (P2) Refactor server.py into modular routes
- [ ] (P2) Form builder / mini-DocuSign
- [ ] (P3) Community Wall
- [ ] (P3) Referral system (invite friend → both get tokens)
