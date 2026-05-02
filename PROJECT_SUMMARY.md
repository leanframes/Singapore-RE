# Project Summary: Singapore Private Property Microsite

## Overview

A production-ready Next.js 14 microsite designed for Singapore ultra-high-net-worth property consultants. The platform presents exclusive properties ($10M+ SGD) in a privacy-focused, invitation-only environment.

**Implementation Date**: April 25, 2026

## Project Status: ✅ Core Implementation Complete

### Completed Features

| Feature | Status | Description |
|---------|--------|-------------|
| Password Gate | ✅ Done | Single access code, rate limiting (5/hr/IP) |
| **Buyer Type Selector** | ✅ Done | Global (Sovereignty) vs Local (Provenance) briefing paths |
| **Global Sovereignty Briefing** | ✅ Done | Tax scorecard, Family Office 13O pathway, Family OS tabs |
| **Local Provenance Briefing** | ✅ Done | Title analysis, transaction intelligence, yield scenarios |
| Session Management | ✅ Done | HTTP-only cookies, 90-day duration |
| NDA Modal | ✅ Done | Scroll-to-agree, audit logging, email notifications |
| Watermarked PDFs | ✅ Done | Viewer identity on every page, diagonal watermarks |
| **Concierge FAB** | ✅ Done | Floating button: Wealth, Education, Medical, Security |
| **Digital Scarcity Banner** | ✅ Done | "1 of 3 active viewings" urgency messaging |
| Private Viewing | ✅ Done | Calendly integration, webhook handling |
| Admin Dashboard | ✅ Done | Analytics, buyer types, FO leads, concierge requests |
| Multi-language | ✅ Done | EN/ZH/ID with next-intl |
| Design System | ✅ Done | Cormorant Garamond + Inter, gold accent, custom cursor |
| Security Headers | ✅ Done | CSP, HSTS, X-Frame-Options |
| PDPA Compliance | ✅ Done | 90-day retention, audit trail |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel Edge                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Middleware (middleware.ts)          │   │
│  │  - Locale detection (next-intl)                  │   │
│  │  - Access cookie validation                      │   │
│  │  - Buyer type + Briefing flow enforcement        │   │
│  │  - Rate limiting (in-memory)                     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  /gate   │    │ /private │    │  /admin  │
    │  Public  │    │ Protected│    │ Protected│
    └──────────┘    └──────────┘    └──────────┘
          │
          ▼
  ┌───────────────────┐
  │ /select-briefing  │
  │ Global vs Local   │
  └───────────────────┘
          │
          ▼
  ┌─────────────────┐
  │   NDA Modal     │
  │ (if not signed) │
  └─────────────────┘
          │
          ▼
  ┌─────────────────────────────┐
  │     /private/briefing       │
  │ Sovereignty OR Provenance   │
  └─────────────────────────────┘
          │
          ├───────────────┬───────────────┐
          ▼               ▼               ▼
    ┌──────────┐   ┌───────────┐   ┌──────────┐
    │  /home   │   │ /documents│   │ /viewing │
    │ Showcase │   │   PDFs    │   │ Calendly │
    └──────────┘   └───────────┘   └──────────┘
          │
          └── [Concierge FAB on all pages]
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| i18n | next-intl |
| PDF | pdf-lib |
| Email | Resend |
| Charts | Recharts |
| Deployment | Vercel |
| State | Cookies + JSON files |

### Data Flow

1. **Visitor Entry**: Gate → Access Code → Cookie Set → Redirect to /select-briefing
2. **Buyer Profiling**: Select Global/Local → Log choice → Set buyer_type cookie → Redirect to /private
3. **NDA Flow**: First visit → Modal → Scroll → Form → API → Log + Email → Cookie
4. **Briefing Flow**: NDA signed → Sovereignty Dashboard OR Provenance Dossier → briefing_viewed cookie
5. **Document Access**: Request → Cookie Check → PDF Load → Watermark → Stream
6. **Concierge**: FAB click → Select service → POST /api/concierge → Email consultant
7. **Family Office Lead**: Request 13O call → POST /api/family-office-lead → Priority email
8. **Booking**: Calendly Widget → Webhook → /api/lead → Log + Email

### File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── gate/page.tsx           # Access code entry
│   │   ├── select-briefing/page.tsx # NEW: Buyer type selection
│   │   ├── private/
│   │   │   ├── layout.tsx          # NDA check + Concierge FAB
│   │   │   ├── briefing/page.tsx   # NEW: Sovereignty/Provenance router
│   │   │   ├── home/page.tsx       # Property showcase
│   │   │   ├── gallery/page.tsx    # Image gallery
│   │   │   ├── documents/page.tsx
│   │   │   └── viewing/page.tsx    # Calendly
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       └── page.tsx            # Dashboard + new analytics
│   └── api/
│       ├── auth/verify/route.ts
│       ├── buyer-type/route.ts     # NEW: Buyer type selection
│       ├── briefing-complete/route.ts # NEW: Mark briefing viewed
│       ├── family-office-lead/route.ts # NEW: FO consultation requests
│       ├── concierge/route.ts      # NEW: Concierge service requests
│       ├── nda/route.ts
│       ├── doc/route.ts
│       ├── lead/route.ts
│       └── admin/
│           ├── verify/route.ts
│           └── analytics/route.ts  # Extended with new metrics
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── NDAModal.tsx
│   ├── GlobalSovereigntyBriefing.tsx # NEW: Full sovereignty dashboard
│   ├── ProvenanceBriefing.tsx       # NEW: Asset provenance dossier
│   ├── ConciergeFAB.tsx             # NEW: Floating concierge button
│   └── DigitalScarcityBanner.tsx    # NEW: Urgency banner
├── config/
│   └── property.ts                  # Schema-driven config
├── lib/
│   ├── cookies.ts
│   ├── data.ts
│   ├── date.ts
│   ├── email.ts
│   └── pdf.ts
├── types/
│   └── index.ts
└── i18n/
    └── request.ts

content/
├── briefing_global.json   # NEW: Editable global briefing data
├── briefing_local.json    # NEW: Editable local briefing data
├── nda-en.md
└── nda-zh.md

docs/
└── CUSTOMIZATION_README.md # NEW: 15-minute setup guide
```

### Security Measures

- ✅ HTTP-only cookies (no XSS exposure)
- ✅ Rate limiting on auth endpoints
- ✅ CSP headers configured
- ✅ noindex, nofollow meta tags
- ✅ Document watermarking
- ✅ Audit logging
- ✅ HTTPS enforced (Vercel)

### Scalability Notes

This is a **single-property microsite** by design. For multiple properties:

1. Deploy separate Vercel projects per property
2. Or extend with multi-tenancy (add property ID to routes/data)

### Estimated Costs

| Service | Cost |
|---------|------|
| Vercel (Hobby) | Free |
| Vercel (Pro) | $20/mo |
| Resend (Free tier) | Free (100 emails/day) |
| Domain | ~$12-15/year |

---

## Next Steps

See `SETUP_INSTRUCTIONS.md` for:
1. Required assets to add
2. Environment variable configuration
3. Deployment steps
4. Testing checklist
