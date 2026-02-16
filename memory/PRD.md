# JudgyGPT Online - Product Requirements Document

## Product Overview
**Name:** JudgyGPT  
**Domain:** judgygptonline.com  
**Tagline:** "Go ahead... Test Me 💅"

An AI chatbot with personality that gives brutally honest advice with sass.

---

## ✅ COMPLETED FEATURES

### Core Features:
- [x] User authentication (register/login)
- [x] Password reset via email
- [x] JudgyGPT AI chat with sassy personality
- [x] "Test Me" interactive landing page
- [x] Challenge-based chat prompts
- [x] 3-tier subscription system
- [x] Real Stripe payment integration
- [x] Chat history & sessions
- [x] Mobile responsive design

### UI/UX:
- [x] Modern "Test Me" landing page
- [x] Challenge cards in chat
- [x] Navigation in chat header (Home, Share, etc.)
- [x] User dropdown menu with quick actions
- [x] Forgot password flow
- [x] Payment success/error handling

### Technical:
- [x] Health check endpoints for deployment
- [x] SEO meta tags & Open Graph
- [x] Sitemap & robots.txt
- [x] Stripe checkout sessions
- [x] Resend email integration

---

## 📋 SUBSCRIPTION PLANS

| Plan | Price | Messages/Day |
|------|-------|--------------|
| Judgement Lite | $0 | 5 |
| Talk to Me Nice | $6.99/mo | 50 |
| Bring the Whole Drama | $14.99/mo | Unlimited |

---

## 🗂️ FILE STRUCTURE

```
/app
├── backend/
│   ├── server.py          # FastAPI backend
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # React components
│   │   └── context/       # Auth context
│   └── public/            # Static files
└── memory/
    ├── PRD.md             # This file
    ├── MARKETING_STRATEGY.md
    ├── WEEKLY_CALENDAR.md
    ├── MARKETING_RESOURCES.md
    ├── SOCIAL_MEDIA_KIT.md
    └── GROWTH_PLAN.md
```

---

## 🔧 ENVIRONMENT VARIABLES

### Backend (.env):
```
MONGO_URL=mongodb://...
DB_NAME=test_database
EMERGENT_LLM_KEY=sk-emergent-...
STRIPE_API_KEY=sk_test_...
RESEND_API_KEY=re_...
SENDER_EMAIL=onboarding@resend.dev
```

### Frontend (.env):
```
REACT_APP_BACKEND_URL=https://...
```

---

## 📊 API ENDPOINTS

### Auth:
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`
- GET `/api/auth/me`

### Chat:
- POST `/api/chat`
- GET `/api/chat/{session_id}/history`
- DELETE `/api/chat/{session_id}`

### Subscriptions:
- GET `/api/subscriptions/plans`
- GET `/api/subscriptions/status`
- POST `/api/subscriptions/subscribe`

### Payments:
- POST `/api/checkout/create`
- GET `/api/checkout/status/{session_id}`
- POST `/api/webhook/stripe`

### Utility:
- GET `/api/health`
- GET `/health`
- GET `/sitemap.xml`
- GET `/robots.txt`

---

## 📈 MARKETING ASSETS

Created marketing materials at:
- `/app/memory/MARKETING_STRATEGY.md` - Complete 90-day strategy
- `/app/memory/WEEKLY_CALENDAR.md` - Daily posting schedule
- `/app/memory/MARKETING_RESOURCES.md` - Tools & templates
- `/app/memory/SOCIAL_MEDIA_KIT.md` - Ready-to-post content
- `/app/memory/GROWTH_PLAN.md` - Growth tracker

---

## 🎯 UPCOMING TASKS

### P0 (Critical):
- [x] **FIXED: Payment Security Bug** (Feb 16, 2025) - Users could upgrade to paid plans without payment. Fixed by:
  - `/api/subscriptions/subscribe` now rejects paid plans with 403 error
  - Only `/api/checkout/create` -> Stripe -> webhook flow can upgrade to paid plans
  - Added transaction ownership verification to checkout status endpoint
- [ ] Deploy to production
- [ ] Configure production email (Resend)

### P1 (Important):
- [ ] Google Analytics integration
- [ ] Email verification on signup
- [ ] User profile page
- [ ] Chat export feature

### P2 (Nice to Have):
- [ ] Multiple chat sessions
- [ ] Admin dashboard
- [ ] Voice input/output
- [ ] Animated background for chat message bubbles

---

## 📱 SOCIAL MEDIA ACCOUNTS TO CREATE

- [ ] TikTok: @judgygpt
- [ ] Instagram: @judgygptonline
- [ ] Twitter/X: @judgygpt
- [ ] YouTube: JudgyGPT

---

## 🔒 SECURITY NOTES

### Payment Flow (SECURE):
1. User clicks "Subscribe" on paid plan
2. Frontend calls `/api/checkout/create` → Returns Stripe checkout URL
3. User completes payment on Stripe
4. Stripe webhook calls `/api/webhook/stripe` OR user polls `/api/checkout/status`
5. Backend verifies payment with Stripe API before updating subscription

### Blocked Attack Vectors:
- Direct calls to `/api/subscriptions/subscribe` with paid plan → 403 Forbidden
- Checking another user's checkout status → 403 Forbidden

---

## Last Updated
February 16, 2025
