export interface OfferBannerConfig {
  enabled: boolean
  badge: string
  text: string
  linkText: string
  linkUrl: string
  discountCode: string
  bgTheme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'dark'
}

export interface HeroTrustBadge {
  id: string
  text: string
}

export interface HeroConfig {
  badge: string
  titleLine1: string
  titleLine2: string
  description: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  pricingHint: string
  storeNameDemo: string
  trustBadges: HeroTrustBadge[]
}

export interface StatItem {
  id: string
  value: string
  label: string
  sublabel?: string
}

export interface StatsConfig {
  enabled: boolean
  items: StatItem[]
}

export interface PricingPlanConfig {
  id: string
  name: string
  nameNe?: string
  price: number
  priceFormatted: string
  period: string
  periodNe?: string
  regularPriceFormatted?: string
  savingsFormatted?: string
  discountPercent?: number
  effectiveMonthly?: string
  billingNote?: string
  isFeatured: boolean
  badgeText?: string
  features: string[]
}

export interface PricingConfig {
  headline: string
  description: string
  promoNotice?: string
  plans: PricingPlanConfig[]
}

export interface FeatureItem {
  id: string
  title: string
  description?: string
  category?: string
}

export interface FeaturesConfig {
  badge: string
  headline: string
  description: string
  items: FeatureItem[]
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FAQConfig {
  badge: string
  headline: string
  items: FAQItem[]
}

export interface ContactConfig {
  whatsappNumber: string
  whatsappMessageEn: string
  whatsappMessageNe: string
  supportEmail: string
  supportPhone: string
  address: string
  businessHours: string
}

export interface LandingCMSData {
  lastUpdated: string
  version: number
  offerBanner: OfferBannerConfig
  hero: HeroConfig
  stats: StatsConfig
  pricing: PricingConfig
  features: FeaturesConfig
  faq: FAQConfig
  contact: ContactConfig
}
