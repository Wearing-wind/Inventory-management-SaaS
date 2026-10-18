"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  Building,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

export function LandingHero() {
  const { t, language } = useLanguage()
  const { cms } = useLandingCMS()
  const [imgError, setImgError] = useState(false)

  // Use CMS WhatsApp or fallback
  const whatsappNumber = cms.contact.whatsappNumber || "9779805330808"
  const defaultMsg = language === 'ne' ? cms.contact.whatsappMessageNe : cms.contact.whatsappMessageEn
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`

  // Use CMS hero overrides if customized
  const badgeText = cms.hero.badge || t('hero.badge')
  const title1 = cms.hero.titleLine1 || t('hero.titleLine1')
  const title2 = cms.hero.titleLine2 || t('hero.titleLine2')
  const desc = cms.hero.description || t('hero.description')
  const primaryText = cms.hero.primaryCtaText || t('hero.startFree')
  const secondaryText = cms.hero.secondaryCtaText || t('hero.seeProduct')
  const pricingHint = cms.hero.pricingHint || t('hero.pricingHint')
  const storeName = cms.hero.storeNameDemo || t('hero.storeName')
  const trustBadges = cms.hero.trustBadges?.length
    ? cms.hero.trustBadges
    : [
        { id: '1', text: t('hero.trustBadge1') },
        { id: '2', text: t('hero.trustBadge2') },
        { id: '3', text: t('hero.trustBadge3') },
        { id: '4', text: t('hero.trustBadge4') },
      ]

  return (
    <section className="relative py-10 sm:py-16 lg:py-20 bg-slate-50/70 border-b border-slate-200 overflow-hidden">
      {/* Subtle modern geometric background mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-5 text-left space-y-5">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-full border border-indigo-200/80 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[1.75rem] sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
              <span className="block">{title1}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 mt-1 sm:mt-2">
                {title2}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-lg font-normal">
              {desc}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 sm:h-13 px-6 sm:px-7 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-600/20 text-sm sm:text-base transition-all rounded-xl"
              >
                <a href={cms.hero.primaryCtaLink?.startsWith('http') ? cms.hero.primaryCtaLink : whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5 mr-2 shrink-0" />
                  {primaryText}
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 sm:h-13 px-5 sm:px-6 border-slate-300/80 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base transition-all rounded-xl shadow-2xs"
              >
                <Link href={cms.hero.secondaryCtaLink || '/demo'}>
                  {secondaryText} <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-indigo-600" />
                </Link>
              </Button>
            </div>

            {/* Pricing hint */}
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {pricingHint}
            </p>

            {/* 4 Trust Indicators Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-slate-700 font-semibold">
              {trustBadges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="leading-snug">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: High-polish Product Showcase */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-2.5 sm:p-4 lg:p-5 text-left overflow-hidden ring-1 ring-slate-800/80 transition-all">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2 hidden sm:inline">
                    inventorylite.app/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold bg-slate-900 px-2.5 sm:px-3 py-1 rounded-md border border-slate-800">
                  <Building className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-none text-[11px] sm:text-xs">
                    {storeName}
                  </span>
                </div>
              </div>

              {/* Real Screenshot or Fallback UI */}
              {!imgError ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950 group">
                  <Image
                    src="/screenshots/hero-dashboard.png"
                    alt="Inventory Lite Dashboard — Stock, sales, Udhaar and business overview"
                    priority
                    unoptimized
                    width={1280}
                    height={800}
                    className="w-full h-auto object-cover object-top max-h-[380px] sm:max-h-[480px] lg:max-h-[540px] transition-transform duration-500 group-hover:scale-[1.01]"
                    onError={() => setImgError(true)}
                  />
                  {/* Callout badges overlaid on screenshot */}
                  <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex flex-wrap gap-1.5 sm:gap-2">
                    {[
                      { label: 'hero.calloutSales', text: 'Live POS Billing', color: 'bg-emerald-600/90 text-white backdrop-blur-xs' },
                      { label: 'hero.calloutStock', text: 'Realtime Stock Ledger', color: 'bg-blue-600/90 text-white backdrop-blur-xs' },
                      { label: 'hero.calloutUdhaar', text: 'Customer Udhaar Khata', color: 'bg-amber-600/90 text-white backdrop-blur-xs' },
                      { label: 'hero.calloutReports', text: 'VAT Tax Reports', color: 'bg-indigo-600/90 text-white backdrop-blur-xs' },
                    ].map((c) => (
                      <span
                        key={c.label}
                        className={`text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-md border border-white/20 shadow-xs ${c.color}`}
                      >
                        {t(c.label) || c.text}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Fallback UI */
                <div className="space-y-3 sm:space-y-4 bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">
                        <span>{t('hero.todaysSales')}</span>
                        <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <div className="text-sm sm:text-lg font-bold font-mono text-emerald-400 mt-1">Rs. 14,250</div>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">
                        <span>{t('hero.thisMonth')}</span>
                        <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-400 shrink-0" />
                      </div>
                      <div className="text-sm sm:text-lg font-bold font-mono text-white mt-1">Rs. 185,400</div>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">
                        <span>{t('hero.products')}</span>
                        <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-400 shrink-0" />
                      </div>
                      <div className="text-sm sm:text-lg font-bold font-mono text-white mt-1">{t('hero.itemsCount')}</div>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">
                        <span>{t('hero.lowStock')}</span>
                        <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400 shrink-0" />
                      </div>
                      <div className="text-sm sm:text-lg font-bold font-mono text-amber-400 mt-1">{t('hero.alertsCount')}</div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                      <span className="text-[10px] sm:text-xs font-bold text-white flex items-center gap-1.5">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-400" /> {t('hero.liveActivity')}
                      </span>
                      <span className="text-[10px] sm:text-xs text-emerald-400 font-mono">{t('hero.realtime')}</span>
                    </div>
                    <table className="w-full text-left text-[10px] sm:text-xs min-w-[280px]">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800">
                          <th className="pb-1.5">{t('hero.colSaleNo')}</th>
                          <th className="pb-1.5">{t('hero.colCustomer')}</th>
                          <th className="pb-1.5">{t('hero.colPayment')}</th>
                          <th className="pb-1.5 text-right">{t('hero.colTotal')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        <tr>
                          <td className="py-1.5 sm:py-2 text-indigo-400 font-bold">#INV-1048</td>
                          <td className="py-1.5 sm:py-2 text-slate-200 font-sans">Ram Bahadur Construction</td>
                          <td className="py-1.5 sm:py-2 text-slate-400 font-sans">{t('hero.fonepay')}</td>
                          <td className="py-1.5 sm:py-2 text-right text-emerald-400 font-bold">Rs. 4,800</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 sm:py-2 text-indigo-400 font-bold">#INV-1047</td>
                          <td className="py-1.5 sm:py-2 text-slate-200 font-sans">{t('hero.walkinCustomer')}</td>
                          <td className="py-1.5 sm:py-2 text-slate-400 font-sans">{t('hero.cash')}</td>
                          <td className="py-1.5 sm:py-2 text-right text-emerald-400 font-bold">Rs. 1,250</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
