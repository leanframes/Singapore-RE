# Setup Instructions: What's Missing & Next Steps

## 🔴 Required Before Launch

### 1. Environment Variables

Create `.env.local` with your actual values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# REQUIRED
PROPERTY_REF="32 Nassim Hill"
PROPERTY_CODE="D10"                    # Access code for viewers
ADMIN_CODE="your-secure-admin-code"    # Dashboard access

# CONSULTANT INFO
CONSULTANT_NAME="Ramu N"
CONSULTANT_EMAIL=leanframes@gmail.com
NEXT_PUBLIC_CONSULTANT_NAME="Ramu N"
NEXT_PUBLIC_PROPERTY_REF="32 Nassim Hill"

# OPTIONAL BUT RECOMMENDED
RESEND_API_KEY="re_xxxxx"              # For email notifications
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-link"

# NEW: Sovereignty Portal
FAMILY_OFFICE_PARTNER_EMAIL="partner@example.com"  # FO consultation leads
CONCIERGE_EMAIL="concierge@example.com"            # Concierge requests
MAPBOX_TOKEN="pk.xxxxx"                            # Optional: Interactive maps
```

### 2. Property Images

Add to `public/images/`:

| File | Purpose | Recommended Size |
|------|---------|------------------|
| `hero.jpg` | Main hero background | 1920x1080, compressed |
| `og-image.jpg` | Social media preview | 1200x630, blurred |
| `favicon.ico` | Browser tab icon | 32x32 or 64x64 |

Add to `public/images/gallery/`:

| File | Category |
|------|----------|
| `exterior-1.jpg` | Exterior |
| `interior-1.jpg` | Interior |
| `interior-2.jpg` | Interior |
| `pool.jpg` | Amenity |
| `view.jpg` | View |

### 3. Property Documents

Add to `private/docs/`:

| File | Purpose |
|------|---------|
| `floorplan.pdf` | Floor plans (watermarked on download) |
| `brochure.pdf` | Property brochure (watermarked on download) |

### 4. Calendly Setup

1. Create a Calendly account at [calendly.com](https://calendly.com)
2. Create an event type for "Private Property Viewing"
3. Copy the event link
4. Add to `.env.local` as `NEXT_PUBLIC_CALENDLY_URL`
5. (Optional) Set up webhook to `https://your-domain.com/api/lead` (PUT method)

### 5. Resend Email Setup

1. Create account at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Get API key from dashboard
4. Add to `.env.local` as `RESEND_API_KEY`

---

## 🟡 Recommended Customizations

### Update Property Details

Edit `src/config/property.ts`:

```typescript
export const propertyConfig: PropertyConfig = {
  ref: '32 Nassim Hill',              // Update
  name: '32 Nassim Hill',             // Update
  tagline: 'Your tagline here',       // Update
  address: 'Full address',            // Update
  district: 'District 10',            // Update
  propertyType: 'Good Class Bungalow',// Update
  tenure: 'Freehold',                 // Update
  landArea: '15,000 sq ft',           // Update
  builtUpArea: '12,000 sq ft',        // Update
  bedrooms: 6,                        // Update
  bathrooms: 7,                       // Update
  yearBuilt: 2018,                    // Update
  architect: 'SCDA Architects',       // Update
  features: [                         // Update list
    'Feature 1',
    'Feature 2',
    // ...
  ],
  // ...
};
```

### Update Consultant Info

Edit `src/config/property.ts`:

```typescript
export const consultantConfig: ConsultantConfig = {
  name: 'Your Name',
  title: 'Senior Associate Director',
  agency: 'Your Agency',
  ceaNo: 'R012345A',      // Your CEA number
  email: 'your@email.com',
  phone: '+65 9XXX XXXX',
  whatsapp: '+65 9XXX XXXX',
};
```

### Update NDA Content

Edit `content/nda-en.md` and `content/nda-zh.md` with your legal team's approved text.

### Update Briefing Content (NEW)

Edit `content/briefing_global.json` for Global Sovereignty briefing:
- Tax scorecard comparisons
- Family Office pathway steps
- Healthcare facilities and distances
- Education schools
- Lifestyle clubs

Edit `content/briefing_local.json` for Local Provenance briefing:
- Title & land details
- Recent transaction comparables
- URA Master Plan assessments
- Yield scenario data

### Update Translations

Edit `messages/en.json`, `messages/zh.json`, and `messages/id.json` for any property-specific wording.

Key new translation sections:
- `selectBriefing` - Buyer type selection
- `briefing.global` - Sovereignty dashboard
- `briefing.local` - Provenance dossier
- `concierge` - Concierge modal
- `scarcity` - Digital scarcity banner

---

## 🚀 Deployment Steps

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Deploy**
   - Vercel will auto-deploy on push to main

5. **Add Custom Domain** (Optional)
   - In Vercel dashboard, go to Settings → Domains
   - Add your domain (e.g., `32nassimhill.sg`)

---

## ✅ Testing Checklist

### Pre-Launch Testing

- [ ] Access gate works with correct code
- [ ] Access gate rejects wrong code
- [ ] Rate limiting blocks after 5 attempts
- [ ] **Buyer type selection appears after gate** (NEW)
- [ ] **Selecting Global shows Sovereignty briefing** (NEW)
- [ ] **Selecting Local shows Provenance briefing** (NEW)
- [ ] NDA modal appears on first visit
- [ ] NDA requires scrolling to enable checkbox
- [ ] NDA submission logs to `/data/nda_log.json`
- [ ] **Briefing completion redirects to /private/home** (NEW)
- [ ] **Concierge FAB appears on all private pages** (NEW)
- [ ] **Concierge requests logged to `/data/concierge_requests.json`** (NEW)
- [ ] **Family Office leads logged to `/data/fo_leads.json`** (NEW)
- [ ] **Digital scarcity banner shows after briefing** (NEW)
- [ ] Email notifications sent (if Resend configured)
- [ ] PDF documents have watermark
- [ ] Download logs to `/data/download_log.json`
- [ ] Calendly widget loads
- [ ] Language toggle works (EN/中文/ID)
- [ ] Mobile responsive
- [ ] Admin login works
- [ ] Admin dashboard shows analytics
- [ ] **Admin shows buyer type breakdown** (NEW)
- [ ] **Admin shows FO leads count** (NEW)
- [ ] **Admin shows concierge requests** (NEW)

### Security Testing

- [ ] Cannot access /private without cookie
- [ ] Cannot download PDFs without NDA signed
- [ ] Cannot access /admin without admin cookie
- [ ] Pages have noindex, nofollow meta
- [ ] CSP headers present in response

---

## 🔧 Troubleshooting

### "Module not found" Errors

```bash
rm -rf node_modules
npm install
```

### PDF Watermarking Fails

- Ensure PDF files exist in `private/docs/`
- Check file names match exactly (case-sensitive)
- Ensure PDFs are not password-protected

### Calendly Not Loading

- Check CSP headers allow calendly.com
- Verify NEXT_PUBLIC_CALENDLY_URL is set
- Check browser console for errors

### Emails Not Sending

- Verify RESEND_API_KEY is set
- Check Resend dashboard for errors
- Ensure email addresses are valid

### Cookies Not Setting

- Verify NODE_ENV is not causing secure cookie issues in dev
- Check browser allows cookies from site
- Try clearing browser cookies and retrying

---

## 📞 Support

For issues or questions:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Contact: [Your Support Email]
