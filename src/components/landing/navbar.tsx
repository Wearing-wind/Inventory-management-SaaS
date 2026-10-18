"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useLanguage } from '@/context/language-context'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { Menu, X, LayoutDashboard, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppLogo } from '@/components/ui/app-logo'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

export function LandingNavbar() {
  const { user, activeBusiness, memberships } = useAuth()
  const { t, language } = useLanguage()
  const { cms } = useLandingCMS()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentRole = memberships?.find((m) => m.businessId === activeBusiness?.$id)?.role || 'owner'
  const isOwnerOrAdmin = user && (currentRole === 'owner' || currentRole === 'admin')

  const whatsappNumber = cms.contact.whatsappNumber || "9779805330808"
  const defaultMsg = language === 'ne' ? cms.contact.whatsappMessageNe : cms.contact.whatsappMessageEn
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`

  const hasPortalAccess = !!user

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Inventory Lite Home">
          <AppLogo size={34} />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600" aria-label="Main navigation">
          <a href="#product" className="hover:text-indigo-600 transition-colors">
            {t('nav.product')}
          </a>
          <a href="#workflow" className="hover:text-indigo-600 transition-colors">
            {t('nav.workflow')}
          </a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">
            {t('nav.features')}
          </a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">
            {t('nav.pricing')}
          </a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">
            {t('nav.faq')}
          </a>
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <LanguageSwitcher />

          {/* Quick CMS Access for Admin/Owner */}
          {isOwnerOrAdmin && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 font-bold text-xs h-9"
              title="Edit Landing Page Content"
            >
              <Link href="/superadmin">
                <Globe className="mr-1.5 h-3.5 w-3.5 text-indigo-600" /> Landing CMS
              </Link>
            </Button>
          )}

          {hasPortalAccess ? (
            <Button
              asChild
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs text-xs h-9 rounded-lg"
            >
              <Link href={activeBusiness || memberships.length > 0 ? "/app/dashboard" : "/onboarding"}>
                <LayoutDashboard className="mr-1.5 h-3.5 w-3.5 shrink-0" /> {t('nav.goToDashboard')}
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                asChild
                size="sm"
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs h-9 rounded-lg"
              >
                <Link href="/demo">Try Demo</Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs h-9"
              >
                <Link href="/auth/login">{t('nav.login')}</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs text-xs h-9 rounded-lg"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  {t('nav.startFree')}
                </a>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Controls: WhatsApp Icon + Language + Hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          {!hasPortalAccess && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              aria-label="Contact on WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          )}
          <LanguageSwitcher align="right" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={t('nav.toggleMenu')}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-700" aria-label="Mobile navigation">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-indigo-600 transition-colors"
            >
              {t('nav.product')}
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-indigo-600 transition-colors"
            >
              {t('nav.workflow')}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-indigo-600 transition-colors"
            >
              {t('nav.features')}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-indigo-600 transition-colors"
            >
              {t('nav.pricing')}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-indigo-600 transition-colors"
            >
              {t('nav.faq')}
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {isOwnerOrAdmin && (
              <Button
                asChild
                variant="outline"
                className="w-full justify-center h-10 border-indigo-200 bg-indigo-50 text-indigo-700 font-bold text-xs"
              >
                <Link href="/superadmin" onClick={() => setMobileMenuOpen(false)}>
                  <Globe className="mr-2 h-4 w-4" /> Edit Landing Page (SuperAdmin CMS)
                </Link>
              </Button>
            )}

            {hasPortalAccess ? (
              <Button
                asChild
                className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 text-xs rounded-xl shadow-xs"
              >
                <Link
                  href={activeBusiness || memberships.length > 0 ? "/app/dashboard" : "/onboarding"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> {t('nav.goToDashboard')}
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-center border-slate-300 font-semibold h-10 text-xs rounded-xl"
                >
                  <Link href="/demo" onClick={() => setMobileMenuOpen(false)}>
                    Try Interactive Demo
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-center text-slate-700 font-semibold h-10 text-xs"
                >
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    {t('nav.login')}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs rounded-xl shadow-xs"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-4 w-4 mr-2" /> {t('nav.startFree')}
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
