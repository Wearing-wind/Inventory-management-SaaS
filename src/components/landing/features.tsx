"use client"

import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { en } from '@/locales/en'
import { ne } from '@/locales/ne'

export function LandingFeatures() {
  const { language } = useLanguage()
  const { cms } = useLandingCMS()

  const defaultList = language === 'ne' ? ne.features.list : en.features.list
  const featureItems = cms.features.items?.length
    ? cms.features.items.map((item) => item.title)
    : defaultList

  const badge = cms.features.badge || (language === 'ne' ? ne.features.badge : en.features.badge)
  const headline = cms.features.headline || (language === 'ne' ? ne.features.headline : en.features.headline)
  const description = cms.features.description || (language === 'ne' ? ne.features.description : en.features.description)

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>{badge}</span>
          </div>

          <h2 className="text-[1.75rem] sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight leading-[1.18]">
            {headline}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Feature Grid - Fixed flex-1 layout without max-w-24 bug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 pt-2">
          {featureItems.map((feat: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:border-indigo-300 hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="flex-1 text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
