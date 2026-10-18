"use client"

import Link from 'next/link'
import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { AppLogo } from '@/components/ui/app-logo'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'
import { Globe, MapPin, Mail, Clock } from 'lucide-react'

export function LandingFooter() {
  const { t, language } = useLanguage()
  const { cms } = useLandingCMS()

  const whatsappNumber = cms.contact.whatsappNumber || "9779805330808"
  const defaultMsg = language === 'ne' ? cms.contact.whatsappMessageNe : cms.contact.whatsappMessageEn
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm py-12 sm:py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Section: Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand & Contact Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Inventory Lite Home">
              <AppLogo size={36} textColor="text-white" />
            </Link>
            <p className="text-slate-300 max-w-sm text-xs sm:text-sm leading-relaxed">
              {t('footer.subtitle')}
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              {cms.contact.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>{cms.contact.address}</span>
                </div>
              )}
              {cms.contact.supportEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <a href={`mailto:${cms.contact.supportEmail}`} className="hover:text-white transition-colors">
                    {cms.contact.supportEmail}
                  </a>
                </div>
              )}
              {cms.contact.businessHours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>{cms.contact.businessHours}</span>
                </div>
              )}
            </div>

            {/* Desktop WhatsApp CTA */}
            <div className="hidden md:block pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all text-xs sm:text-sm min-h-[44px]"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {t('nav.startFree')}
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3 sm:mb-4">
                {t('footer.productHeading')}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors inline-block">{t('footer.features')}</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors inline-block">{t('footer.pricing')}</a></li>
                <li><Link href="/demo" className="text-slate-400 hover:text-white transition-colors inline-block">{t('footer.interactiveDemo')}</Link></li>
                <li><Link href="/docs" className="text-slate-400 hover:text-white transition-colors inline-block">{t('footer.userGuide')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3 sm:mb-4">
                {t('footer.supportHeading')}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                    {t('footer.whatsapp')}
                  </a>
                </li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors inline-block">{t('footer.contact')}</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors inline-block">{t('footer.privacy')}</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors inline-block">{t('footer.terms')}</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-3 sm:mb-4">
                Administration
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link
                    href="/superadmin"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Landing CMS Studio</span>
                  </Link>
                </li>
                <li><Link href="/auth/login" className="text-slate-400 hover:text-white transition-colors inline-block">Staff / Owner Login</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
          <div className="flex items-center gap-3">
            <span>Built with precision for small businesses in Nepal</span>
            <span>·</span>
            <Link href="/superadmin" className="hover:text-slate-300 transition-colors">
              CMS Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
