# JudgyGPT Online - Product Requirements Document

## Original Problem Statement
Build a web application called "JudgyGPT" - a sarcastic, bossy, yet helpful AI chat assistant with subscription-based monetization.

## Product Overview
**Domain:** judgygptonline.com
**Tagline:** "AI Personalities with Attitude"

JudgyGPT Online is a hub for AI personalities that provide honest advice with unique personalities:
1. **JudgyGPT** - Sassy life coach (main app)
2. **The Diplomat** - Marriage & relationship advisor (JudgyGPT's ex-husband)

## Architecture

### Current Setup
```
judgygptonline.com (Hub Landing Page)
├── /chat → JudgyGPT AI Chat (hosted on Emergent)
├── /pricing → Subscription plans
├── /login, /register → Authentication
└── "The Diplomat" button → ChatGPT GPT (external link)
```

### Tech Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Python, FastAPI
- **Database:** MongoDB
- **AI:** OpenAI GPT-4o via Emergent LLM Key

## Subscription Plans
| Plan | Price | Messages/Day |
|------|-------|--------------|
| Judgement Lite | $0 | 5 |
| Talk to Me Nice | $6.99 | 50 |
| Bring the Whole Drama | $14.99 | Unlimited |

## Completed Features ✅
- [x] User authentication (register/login)
- [x] AI chat with JudgyGPT personality
- [x] Hub landing page with both AI personalities
- [x] Custom logos for both JudgyGPT and The Diplomat
- [x] Pricing page with 3 subscription tiers
- [x] Subscription confirmation modal
- [x] The Diplomat links to ChatGPT GPT
- [x] Responsive design
- [x] 3-panel chat layout

## In Progress 🔄
- [ ] Deploy to production
- [ ] Connect custom domain (judgygptonline.com) via Cloudflare

## Upcoming Tasks (P1)
- [ ] Integrate real Stripe payments
- [ ] Implement "Witnesses" feature (live audience)
- [ ] Add JudgyGPT "ex-husband" backstory to AI prompt

## Future Tasks (P2)
- [ ] **Build The Diplomat INTO JudgyGPT app** (bundle under one subscription)
- [ ] Real-time voice input/output
- [ ] Shout/curse detection for different AI modes
- [ ] Merch store integration (Printful/Shopify)
- [ ] Production email services (hello@, support@)

## Key Files
- `/app/backend/server.py` - API & AI logic
- `/app/frontend/src/pages/LandingPage.jsx` - Hub page
- `/app/frontend/src/pages/ChatPage.jsx` - Chat interface
- `/app/frontend/src/pages/PricingPage.jsx` - Subscription plans
- `/app/frontend/src/config/personalities.js` - AI personality configs

## External Links
- **The Diplomat (ChatGPT):** https://chatgpt.com/g/g-6987ec32bdd48191b905193f05f3477e-the-diplomat

## Deployment Notes
- Preview URL: https://ai-persona-hub-8.preview.emergentagent.com
- Production: Deploy via Emergent → Configure Cloudflare DNS
- Subdomains (optional): judgy.judgygptonline.com, diplomat.judgygptonline.com

## Last Updated
December 2025
