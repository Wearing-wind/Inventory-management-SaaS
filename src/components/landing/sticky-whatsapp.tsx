"use client"

import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

export function StickyWhatsAppCTA() {
  const { t, language } = useLanguage()
  const { cms } = useLandingCMS()

  const whatsappNumber = cms.contact.whatsappNumber || "9779805330808"
  const defaultMsg = language === 'ne' ? cms.contact.whatsappMessageNe : cms.contact.whatsappMessageEn
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
          aria-label={t('nav.startFree')}
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span>{t('nav.startFree')}</span>
        </a>
      </div>
    </div>
  )
}
