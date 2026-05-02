# Singapore Private Property Microsite

A privacy-first, invitation-only property presentation platform for ultra-high-net-worth ($10M+ SGD) real estate consultants. Built with Next.js 14, TypeScript, Tailwind CSS, and deployed on Vercel.

## Features

- 🔒 **Password-Protected Access** - Single access code with rate limiting
- 📝 **NDA with Audit Trail** - Full-screen NDA modal, scroll-to-agree, logged submissions
- 🔖 **Watermarked Documents** - PDF documents with viewer identity watermark
- 📅 **Private Viewing Booking** - Calendly integration with lead capture
- 📊 **Consultant Analytics** - Admin dashboard with visitor insights
- 🌏 **Multi-language** - English and Chinese (中文) support
- 🎨 **Luxury Design** - Cormorant Garamond + Inter, gold accent, dark theme
- 🔐 **PDPA Compliant** - 90-day data retention, logged access

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your values

# Run development server
npm run dev
```

## Environment Variables

```env
PROPERTY_REF="32 Nassim Hill"
PROPERTY_CODE="D10"
CONSULTANT_NAME="Ramu N"
CONSULTANT_EMAIL=leanframes@gmail.com
ADMIN_CODE="your-admin-code"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-link"
RESEND_API_KEY="re_your_key"
```

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── gate/           # Access code entry
│   │   │   ├── private/        # Protected content
│   │   │   │   ├── home/       # Property showcase
│   │   │   │   ├── gallery/    # Image gallery
│   │   │   │   ├── documents/  # Gated PDFs
│   │   │   │   └── viewing/    # Calendly booking
│   │   │   └── admin/          # Analytics dashboard
│   │   └── api/
│   │       ├── auth/           # Access verification
│   │       ├── nda/            # NDA submission
│   │       ├── doc/            # Watermarked PDF delivery
│   │       └── lead/           # Viewing requests
│   ├── components/             # React components
│   ├── config/                 # Property & consultant config
│   ├── lib/                    # Utilities
│   └── types/                  # TypeScript types
├── content/                    # NDA markdown files
├── data/                       # JSON logs (gitignored)
├── messages/                   # i18n translations
├── private/docs/              # Source PDFs
└── public/images/             # Property images
```

---

## PDPA Compliance Notes

This platform is designed with Singapore's Personal Data Protection Act (PDPA) in mind:

### Data Collection

The following personal data is collected:

1. **NDA Submissions**: Name, email, company (optional), IP address, user agent, timestamp
2. **Document Downloads**: Viewer identity, filename, timestamp, IP address
3. **Viewing Requests**: Name, email, phone (optional), preferred date

### Data Storage

- All data is stored in JSON files on the Vercel deployment
- No external database is used
- Data is encrypted in transit (HTTPS)

### Data Retention

- **Retention Period**: 90 days
- **Automatic Cleanup**: The `cleanupOldData()` function removes data older than 90 days
- **Manual Deletion**: Available upon request via admin dashboard

### Access Logging

- All document accesses are logged with timestamps
- Watermarks enable traceability of any unauthorized distribution
- Admin can view complete audit trail

### Data Subject Rights

Individuals may request:
- Access to their personal data
- Correction of inaccurate data
- Deletion of their data

Contact: [Consultant Email]

### Security Measures

- HTTP-only cookies for session management
- Rate limiting on authentication endpoints
- CSP headers configured
- No public indexing (noindex, nofollow)
- Document watermarking for accountability

### Third-Party Data Sharing

Data may be shared with:
- **Resend**: For email delivery (NDA confirmations, lead notifications)
- **Calendly**: For viewing scheduling (separate privacy policy)

---

## Customization

### Adding a New Property

1. Edit `src/config/property.ts` with property details
2. Update environment variables
3. Add property images to `public/images/`
4. Add PDFs to `private/docs/`
5. Deploy

### Changing Design

- Colors: `tailwind.config.ts` → `colors`
- Fonts: `src/app/globals.css`
- Content: `messages/en.json` and `messages/zh.json`

## License

Private/Proprietary - Not for redistribution.
