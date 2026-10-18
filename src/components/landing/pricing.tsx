"use client"

import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Tag } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

function getWhatsAppUrl(planName: string, lang: string, whatsappNumber: string, promoCode?: string): string {
  let msg: string
  const num = whatsappNumber || "9779805330808"
  const codeText = promoCode ? ` (Promo Code: ${promoCode})` : ''

  if (lang === 'ne') {
    msg = `नमस्कार, मलाई Inventory Lite को ${planName} योजनामा रुचि छ।${codeText} कृपया थप जानकारी दिनुहोस्।`
  } else {
    msg = `Hello, I am interested in the Inventory Lite ${planName} plan.${codeText} Please provide more information.`
  }
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
}

export function LandingPricing() {
  const { t, language } = useLanguage()
  const { cms } = useLandingCMS()
  const isNe = language === 'ne'

  const headline = cms.pricing.headline || t('pricing.headline')
  const description = cms.pricing.description || t('pricing.description')
  const promoNotice = cms.pricing.promoNotice || (cms.offerBanner.enabled ? cms.offerBanner.text : null)
  const plans = cms.pricing.plans?.length ? cms.pricing.plans : []

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100">
            <Tag className="h-3.5 w-3.5 text-indigo-600" />
            <span>TRANSPARENT NEPAL PRICING</span>
          </div>

          <h2 className="text-[1.75rem] sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight leading-[1.18]">
            {headline}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
            {description}
          </p>

          {/* Optional Promo Offer Callout */}
          {promoNotice && (
            <div className="inline-flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <span>{promoNotice}</span>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const displayName = isNe && plan.nameNe ? plan.nameNe : plan.name
            const displayPeriod = isNe && plan.periodNe ? plan.periodNe : plan.period
            const whatsappUrl = getWhatsAppUrl(
              plan.name,
              language,
              cms.contact.whatsappNumber,
              cms.offerBanner.discountCode
            )

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 sm:p-7 lg:p-8 transition-all duration-200 ${
                  plan.isFeatured
                    ? 'border-indigo-600 bg-white shadow-xl ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Featured Badge */}
                {plan.isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md bg-indigo-600 ring-2 ring-white">
                      <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                      {plan.badgeText || t('pricing.bestValue')}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className={`mb-4 ${plan.isFeatured ? 'pt-2' : ''}`}>
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md inline-block ${
                      plan.isFeatured
                        ? 'text-indigo-800 bg-indigo-50 border border-indigo-200'
                        : 'text-slate-700 bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {displayName}
                  </h3>
                </div>

                {/* Pricing Box */}
                <div className="mb-6 border-b border-slate-100 pb-6">
                  {/* Regular Price Cross-out */}
                  {plan.regularPriceFormatted && (
                    <p className="text-xs sm:text-sm text-slate-400 font-mono line-through mb-1">
                      NPR {plan.regularPriceFormatted}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-500">NPR</span>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-slate-950 leading-none tracking-tight">
                      {plan.priceFormatted}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500">
                      {displayPeriod}
                    </span>
                  </div>

                  {/* Billing Note */}
                  {plan.billingNote && (
                    <p className="text-xs text-slate-500 font-medium mt-1.5">
                      {plan.billingNote}
                    </p>
                  )}

                  {/* Effective Monthly Price */}
                  {plan.effectiveMonthly && (
                    <p className="text-xs font-bold text-indigo-700 mt-2">
                      {plan.effectiveMonthly}
                    </p>
                  )}

                  {/* Savings Tag */}
                  {plan.savingsFormatted && (
                    <div className="mt-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Save NPR {plan.savingsFormatted} {plan.discountPercent ? `(${plan.discountPercent}% OFF)` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1 text-xs sm:text-sm text-slate-700">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  asChild
                  size="lg"
                  className={`w-full h-11 sm:h-12 font-bold text-sm rounded-xl transition-all ${
                    plan.isFeatured
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-4 w-4 mr-2 shrink-0" />
                    Get {displayName}
                  </a>
                </Button>
              </div>
            )
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 text-center text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <span className="font-semibold text-slate-850">
              Zero setup fees · No long-term lock-in · Free WhatsApp training & onboarding support
            </span>
          </div>
          <a
            href={getWhatsAppUrl('Custom Enterprise', language, cms.contact.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-bold hover:underline shrink-0"
          >
            Need Custom Multi-Branch Setup? →
          </a>
        </div>
      </div>
    </section>
  )
}
