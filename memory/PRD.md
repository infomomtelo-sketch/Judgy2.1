# JudgyGPT Online - Product Requirements Document

## Original Problem Statement
Build a web application called "JudgyGPT" - a sarcastic, bossy, yet helpful AI chat assistant with subscription-based monetization, plus "The Diplomat" - JudgyGPT's ex-husband for relationship advice.

## Product Overview
**Domain:** judgygptonline.com
**Tagline:** "AI Personalities with Attitude"

JudgyGPT Online is a hub for AI personalities that provide honest advice with unique personalities:
1. **JudgyGPT** - Sassy life coach (main app)
2. **The Diplomat** - Marriage & relationship advisor (JudgyGPT's ex-husband)

## Architecture

### URL Structure
```
judgygptonline.com → Hub Landing Page
judgygptonline.com/chat → JudgyGPT Chat
judgygptonline.com/diplomat → The Diplomat Chat
judgygptonline.com/pricing → Subscription Plans

diplomat.judgygptonline.com → The Diplomat (subdomain)
```

### Tech Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui
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
- [x] JudgyGPT AI chat with sassy personality
- [x] **The Diplomat AI chat** (built into app!)
- [x] Hub landing page with both AI personalities
- [x] Custom logos for both JudgyGPT and The Diplomat
- [x] Pricing page with 3 subscription tiers
- [x] Subscription confirmation modal
- [x] Subdomain support for diplomat.judgygptonline.com
- [x] Responsive design
- [x] SEO optimization (meta tags, Open Graph, sitemap)
- [x] Navigation between both AIs

## Cloudflare DNS Settings
```
Type    Name        Target                              Proxy
CNAME   @           [deployed-url].emergentagent.com    ✅ Proxied
CNAME   www         judgygptonline.com                  ✅ Proxied  
CNAME   diplomat    [deployed-url].emergentagent.com    ✅ Proxied
```

## In Progress 🔄
- [ ] Deploy to production
- [ ] Configure Cloudflare DNS

## Upcoming Tasks (P1)
- [ ] Integrate real Stripe payments
- [ ] Add Google Analytics
- [ ] Implement "Witnesses" feature (live audience)

## Future Tasks (P2)
- [ ] Real-time voice input/output
- [ ] Merch store integration
- [ ] Email marketing setup
- [ ] Mobile app version

## Key Files
- `/app/backend/server.py` - API & both AI personalities
- `/app/frontend/src/pages/LandingPage.jsx` - Hub page
- `/app/frontend/src/pages/ChatPage.jsx` - JudgyGPT chat
- `/app/frontend/src/pages/DiplomatChatPage.jsx` - The Diplomat chat
- `/app/frontend/src/pages/PricingPage.jsx` - Subscription plans
- `/app/frontend/public/sitemap.xml` - SEO sitemap
- `/app/memory/GROWTH_PLAN.md` - Marketing & growth guide

## AI Personalities

### JudgyGPT
- **Tone:** Sassy, bossy, playful roasts
- **Style:** "Bless your heart" energy
- **Emojis:** 🙄 💅 ✨

### The Diplomat  
- **Tone:** Warm, self-deprecating, wise
- **Style:** "Dad friend who's been through stuff"
- **Backstory:** JudgyGPT's ex-husband, married 7 years
- **Emojis:** 😅 🤝 💪

## External Resources
- **The Diplomat (ChatGPT GPT):** https://chatgpt.com/g/g-6987ec32bdd48191b905193f05f3477e-the-diplomat
- **Growth Plan:** /app/memory/GROWTH_PLAN.md

## Last Updated
December 2025
