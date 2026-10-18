"use client"

import Link from 'next/link'
import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

export function LandingCTA() {
  const { t, language } = useLanguage()
  const { cms } = useLandingCMS()

  const whatsappNumber = cms.contact.whatsappNumber || "9779805330808"
  const defaultMsg = language === 'ne' ? cms.contact.whatsappMessageNe : cms.contact.whatsappMessageEn
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-indigo-950 text-white text-left relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 [background-image:radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-300 bg-white/10 border border-white/20">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>START YOUR FREE TRIAL TODAY</span>
          </div>

          <h2 className="text-[1.75rem] sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-[1.16]">
            {t('cta.headline')}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed font-normal">
            {t('cta.description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-12 sm:h-13 px-7 sm:px-8 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-600/30 text-sm sm:text-base rounded-xl transition-all"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 mr-2 shrink-0" />
              {t('cta.startFree')}
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-7 border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-xl backdrop-blur-xs transition-all"
          >
            <Link href="/demo">
              {t('cta.seeHow')} <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
