# How to Customize for Next Deal in 15 Minutes

This guide shows how to adapt this Sovereignty & Family Continuity Assurance Portal for a new property.

## Quick Setup Checklist

### 1. Property Configuration (5 min)
Edit `src/config/property.ts`:

```typescript
export const propertyConfig: PropertyConfig = {
  ref: 'Your Property Reference',
  name: 'Property Name',
  tagline: 'Your Property Tagline',
  address: 'Full Address',
  district: 'District X - Area Name',
  propertyType: 'Good Class Bungalow', // or 'Penthouse', 'Landed', etc.
  tenure: 'Freehold', // or '999-year', '99-year'
  landArea: '15,000 sq ft',
  builtUpArea: '12,000 sq ft',
  bedrooms: 6,
  bathrooms: 7,
  yearBuilt: 2020,
  architect: 'Architect Name',
  // ... update features array
};

export const consultantConfig: ConsultantConfig = {
  name: 'Your Name',
  title: 'Your Title',
  agency: 'Your Agency',
  ceaNo: 'RXXXXXX',
  email: 'your@email.com',
  phone: '+65 XXXX XXXX',
};
```

### 2. Briefing Content (5 min)

#### Global Briefing: `content/briefing_global.json`
Update these key sections:
- `scorecard.comparisons` - Latest tax/stability data
- `familyOffice.steps` - Path specific to deal structure  
- `familyOS.health.facilities` - Nearby hospitals with distances
- `familyOS.education.schools` - Relevant international schools
- `familyOS.lifestyle.clubs` - Nearby private clubs
- `roi.data` - Latest price index data

#### Local Briefing: `content/briefing_local.json`
Update these sections:
- `titleLand.details` - Actual lot number, plot ratio, GPR
- `architecture` - Architect, year, awards
- `transactions.recentTransactions` - Latest D10 GCB sales from URA REALIS
- `yield` - Actual rental estimates from Knight Frank

### 3. Environment Variables (2 min)

```env
# Required
PROPERTY_CODE=YOUR_ACCESS_CODE
ADMIN_CODE=YOUR_ADMIN_CODE

# Email Notifications
RESEND_API_KEY=your_resend_api_key
CONSULTANT_EMAIL=your@email.com
FAMILY_OFFICE_PARTNER_EMAIL=partner@email.com  # NEW
CONCIERGE_EMAIL=concierge@email.com            # NEW

# Optional - Maps
MAPBOX_TOKEN=your_mapbox_token                 # NEW - For interactive maps

# Existing
NEXT_PUBLIC_PROPERTY_REF=32 Nassim Hill
NEXT_PUBLIC_CONSULTANT_NAME=Consultant Name
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-link
```

### 4. Images (3 min)

Replace images in `public/images/`:
- `hero.jpg` - Main property hero (1920x1080 min)
- `gallery/` - Property gallery images
- `logo.png` - Your agency/consultant logo (optional)

For demo, the system uses Unsplash placeholders. Replace with actual property photos before going live.

## Data Files

All data is stored in `data/`:
- `nda_log.json` - NDA signatures
- `buyer_type_log.json` - Buyer type selections (global/local)
- `fo_leads.json` - Family Office consultation requests
- `concierge_requests.json` - Concierge service requests
- `analytics.json` - Page views and engagement

These are auto-created on first use. Delete them to reset for a new property.

## Translations

Update locale files in `messages/`:
- `en.json` - English
- `zh.json` - Chinese (家办 = Family Office, 传承 = Continuity)
- `id.json` - Indonesian

Key sections to customize:
- `propertyContent.*` - Property descriptions
- `briefing.global.*` - Sovereignty briefing text
- `briefing.local.*` - Provenance briefing text

## Design Tokens

Colors are in `src/app/globals.css`:
```css
:root {
  --background: #0A0A0A;
  --foreground: #FAFAF9;
  --gold: #B9975B;
  --gold-light: #D4B87A;
  --gold-dark: #96794A;
}
```

## New Features in This Version

### Buyer Type Selector
After password gate, buyers choose their profile:
- **Global Family Relocation** → Sovereignty Dashboard
- **Singapore Citizen/PR** → Provenance Dossier

### Sovereignty Dashboard (Global Buyers)
- Capital Protection Scorecard (SG vs Dubai vs Swiss vs UK)
- Family Office 13O/13U Pathway
- Family Operating System (Health, Education, Security, Lifestyle, Pets)
- Wealth Preservation ROI Chart

### Provenance Dossier (Local Buyers)
- Title & Land Analysis
- Architectural Pedigree
- Transaction Intelligence with scatter plot
- URA Master Plan 2025 Impact
- Yield Scenario Analysis

### Concierge FAB
Floating action button on all private pages:
- Wealth Structuring Specialist
- Education Admission Consultant
- Medical Concierge
- Security Consultant

### Digital Scarcity Banner
"Invitation Only – 1 of 3 active viewings Q4 2026"

### Admin Dashboard Enhancements
- Buyer Type Breakdown (Global vs Local)
- Family Office Leads
- Concierge Requests

## Deployment

```bash
# Install dependencies (includes recharts for charts)
npm install

# Run locally
npm run dev

# Deploy to Vercel
vercel --prod
```

## Support

For customization assistance, contact the development team.

---

*This is a private, invitation-only property portal. Not intended for public listing sites.*
