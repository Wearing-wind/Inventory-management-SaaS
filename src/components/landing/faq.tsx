"use client"

import { useState } from 'react'
import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { ChevronDown, HelpCircle } from 'lucide-react'

export function LandingFAQ() {
  const { t } = useLanguage()
  const { cms } = useLandingCMS()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Use CMS items if available, or fallback to i18n
  const fallbackItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') },
    { q: t('faq.q9'), a: t('faq.a9') },
    { q: t('faq.q10'), a: t('faq.a10') },
  ]

  const items = cms.faq.items?.length
    ? cms.faq.items.map((item) => ({ q: item.question, a: item.answer }))
    : fallbackItems

  const badge = cms.faq.badge || t('faq.badge')
  const headline = cms.faq.headline || t('faq.headline')

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100">
            <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
            <span>{badge}</span>
          </div>

          <h2 className="text-[1.75rem] sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight leading-[1.18]">
            {headline}
          </h2>
        </div>

        {/* Clean Accordion List */}
        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} className="transition-colors">
                <button
                  id={`faq-trigger-${idx}`}
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full flex items-center justify-between text-left min-h-[56px] py-4 sm:py-5 text-sm sm:text-base lg:text-lg font-bold text-slate-900 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg gap-4 transition-colors"
                >
                  <span className="leading-snug pr-2">{item.q}</span>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${idx}`}
                    className="pb-5 sm:pb-6 text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed pr-4 sm:pr-8 animate-fade-in"
                  >
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
