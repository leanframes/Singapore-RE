import { PropertyConfig, ConsultantConfig } from '@/types';

// High-quality demo images from Unsplash (free to use)
const DEMO_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  exterior1: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  interior1: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
  interior2: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
  pool: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
  view: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  kitchen: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80',
  bathroom: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
  garden: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
};

// Property configuration - edit this for each new property
export const propertyConfig: PropertyConfig = {
  ref: process.env.NEXT_PUBLIC_PROPERTY_REF || '32 Nassim Hill',
  name: '32 Nassim Hill',
  tagline: 'An Iconic Residence in Prime District 10',
  address: '32 Nassim Hill, Singapore 258459',
  district: 'District 10 - Tanglin / Holland',
  propertyType: 'Good Class Bungalow',
  tenure: 'Freehold',
  landArea: '15,000 sq ft',
  builtUpArea: '12,000 sq ft',
  bedrooms: 6,
  bathrooms: 7,
  yearBuilt: 2018,
  architect: 'SCDA Architects',
  features: [
    'Private lift and car park for 4 vehicles',
    'Infinity pool with city views',
    'Wine cellar and tasting room',
    'Home automation system',
    'Landscaped tropical garden',
    'Staff quarters',
  ],
  heroMedia: {
    type: 'image',
    src: DEMO_IMAGES.hero,
    poster: DEMO_IMAGES.hero,
  },
  gallery: [
    { id: '1', src: DEMO_IMAGES.exterior1, alt: 'Exterior facade', category: 'exterior' },
    { id: '2', src: DEMO_IMAGES.interior1, alt: 'Living room', category: 'interior' },
    { id: '3', src: DEMO_IMAGES.interior2, alt: 'Master suite', category: 'interior' },
    { id: '4', src: DEMO_IMAGES.pool, alt: 'Infinity pool', category: 'amenity' },
    { id: '5', src: DEMO_IMAGES.view, alt: 'City view', category: 'view' },
    { id: '6', src: DEMO_IMAGES.kitchen, alt: 'Gourmet kitchen', category: 'interior' },
    { id: '7', src: DEMO_IMAGES.bathroom, alt: 'Spa bathroom', category: 'interior' },
    { id: '8', src: DEMO_IMAGES.garden, alt: 'Tropical garden', category: 'exterior' },
  ],
  sections: [
    {
      id: 'residence',
      titleKey: 'property.theResidence',
      content: 'A masterpiece of modern tropical architecture, this Good Class Bungalow represents the pinnacle of residential luxury in Singapore. Meticulously crafted by SCDA Architects, the residence seamlessly blends indoor and outdoor living across three levels of thoughtfully designed space.',
    },
    {
      id: 'architecture',
      titleKey: 'property.architecture',
      content: 'The architectural vision draws inspiration from traditional tropical vernacular while embracing contemporary minimalism. Floor-to-ceiling glazing frames curated garden views, while carefully positioned skylights bathe the interiors in natural light throughout the day.',
    },
    {
      id: 'provenance',
      titleKey: 'property.provenance',
      content: 'Nassim Hill has been the address of choice for distinguished families and diplomatic residences since Singapore\'s colonial era. This particular site has been held by a single family for three generations before this rare offering.',
    },
  ],
  documents: [
    { id: 'floorplan', nameKey: 'documents.floorPlan', filename: 'floorplan.pdf', type: 'floorplan', restricted: true },
    { id: 'brochure', nameKey: 'documents.brochure', filename: 'brochure.pdf', type: 'brochure', restricted: true },
  ],
};

// Consultant configuration
export const consultantConfig: ConsultantConfig = {
  name: process.env.NEXT_PUBLIC_CONSULTANT_NAME || 'Ramu N',
  title: 'Senior Associate Director',
  agency: 'Knight Frank Singapore',
  ceaNo: 'R012345A',
  email: process.env.CONSULTANT_EMAIL || 'consultant@example.com',
  phone: '+65 9XXX XXXX',
  whatsapp: '+65 9XXX XXXX',
};

// Site configuration
export const siteConfig = {
  propertyCode: process.env.PROPERTY_CODE,
  adminCode: process.env.ADMIN_CODE,
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/your-link',
  resendApiKey: process.env.RESEND_API_KEY,
  whatsappToken: process.env.WHATSAPP_TOKEN,
  whatsappPhoneId: process.env.WHATSAPP_PHONE_ID,
};
