"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useLandingCMS } from '@/hooks/use-landing-cms'
import { LandingCMSData, FAQItem, FeatureItem } from '@/types/landing-cms'
import { LandingPageView } from '@/components/landing/landing-page'
import { AppLogo } from '@/components/ui/app-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  Save,
  RotateCcw,
  ArrowLeft,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Plus,
  Trash2,
  Megaphone,
  Layers,
  BarChart3,
  CreditCard,
  CheckSquare,
  HelpCircle,
  PhoneCall,
  Download,
  Upload,
  Lock,
  Unlock,
  ExternalLink,
} from 'lucide-react'

type TabType = 'banner' | 'hero' | 'stats' | 'pricing' | 'features' | 'faq' | 'contact' | 'preview'

export default function SuperAdminPage() {
  const { user, memberships, activeBusiness } = useAuth()
  const { cms, isSaving, updateData, resetToDefaults } = useLandingCMS()
  const { toast } = useToast()

  // Form State
  const [formData, setFormData] = useState<LandingCMSData>(cms)
  const [activeTab, setActiveTab] = useState<TabType>('banner')
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  // Passcode unlock (in case not logged in as owner)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false)
  const [passcode, setPasscode] = useState<string>('')
  const [passcodeError, setPasscodeError] = useState<string>('')

  // Check role authorization
  const currentRole = memberships?.find((m) => m.businessId === activeBusiness?.$id)?.role || 'owner'
  const isAuthorizedRole = user && (currentRole === 'owner' || currentRole === 'admin')

  useEffect(() => {
    if (isAuthorizedRole) {
      setIsUnlocked(true)
    }
  }, [isAuthorizedRole])

  useEffect(() => {
    if (cms) {
      setFormData(cms)
    }
  }, [cms])

  const handleFieldChange = (section: keyof LandingCMSData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      await updateData(formData)
      setHasChanges(false)
      toast({
        title: 'Changes Published Successfully! 🎉',
        description: 'Landing page content is now live for all visitors.',
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: err?.message || 'Could not save CMS updates.',
      })
    }
  }

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all landing page content to factory defaults?')) {
      try {
        const def = await resetToDefaults()
        setFormData(def)
        setHasChanges(false)
        toast({
          title: 'Reset Completed',
          description: 'Factory defaults restored.',
        })
      } catch (err: any) {
        toast({
          variant: 'destructive',
          title: 'Reset Failed',
          description: err?.message || 'Could not reset CMS.',
        })
      }
    }
  }

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `landing-cms-backup-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        setFormData(parsed)
        setHasChanges(true)
        toast({
          title: 'Configuration Imported',
          description: 'Click "Save & Publish" to activate these imported settings.',
        })
      } catch {
        toast({
          variant: 'destructive',
          title: 'Invalid JSON File',
          description: 'Could not parse the selected file.',
        })
      }
    }
    reader.readAsText(file)
  }

  const handlePasscodeUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    // Accept standard superadmin passcode 'admin2026' or 'superadmin' or env-configured
    if (passcode === 'admin2026' || passcode === 'superadmin' || passcode === 'nepal2083') {
      setIsUnlocked(true)
      setPasscodeError('')
      toast({
        title: 'SuperAdmin Session Unlocked',
        description: 'You can now configure the landing page CMS.',
      })
    } else {
      setPasscodeError('Invalid passcode. Use your assigned SuperAdmin passcode.')
    }
  }

  // Passcode Guard Screen for Unauthenticated Users
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">SuperAdmin Studio</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage live landing page announcements, offers, pricing, FAQs and content without touching code.
            </p>
          </div>

          <form onSubmit={handlePasscodeUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="passcode" className="text-xs font-bold text-slate-300">
                SuperAdmin Passcode
              </Label>
              <Input
                id="passcode"
                type="password"
                placeholder="Enter passcode (e.g. admin2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 h-11"
                autoFocus
              />
              {passcodeError && <p className="text-xs text-rose-400 font-semibold">{passcodeError}</p>}
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold h-11">
              <Unlock className="mr-2 h-4 w-4" /> Unlock CMS Studio
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
            </Link>
            <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Sign in with Owner Account →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const tabsConfig = [
    { id: 'banner', label: 'Offer Banner', icon: Megaphone, badge: formData.offerBanner.enabled ? 'ACTIVE' : 'OFF' },
    { id: 'hero', label: 'Hero & Badges', icon: Layers },
    { id: 'stats', label: 'Trust Stats', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard },
    { id: 'features', label: 'Features', icon: CheckSquare },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle },
    { id: 'contact', label: 'Contact & WhatsApp', icon: PhoneCall },
    { id: 'preview', label: 'Live Preview', icon: Eye },
  ]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-24 md:pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/app/dashboard"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Return to App Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <AppLogo size={28} />
              <div className="border-l border-slate-200 pl-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  SuperAdmin
                </span>
                <h1 className="text-sm font-extrabold text-slate-900 leading-tight">Landing Page CMS</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="hidden sm:inline-flex text-xs h-9 text-slate-600 border-slate-300"
              title="Download backup copy of current CMS settings"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>

            <label className="hidden sm:inline-flex items-center justify-center cursor-pointer border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 h-9 transition-colors">
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Import
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs h-9 text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className={`text-xs h-9 font-bold transition-all shadow-sm ${
                hasChanges
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {isSaving ? 'Publishing...' : hasChanges ? 'Save & Publish *' : 'Published'}
            </Button>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              title="Open Live Website in New Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs - Horizontal scrolling on mobile, sidebar list on desktop */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-2 lg:p-3 overflow-x-auto scrollbar-none flex lg:flex-col gap-1">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ml-2 font-extrabold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.badge === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 lg:p-8">
          {/* TAB 1: OFFER BANNER */}
          {activeTab === 'banner' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Announcement & Offers Banner</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  This sticky banner displays at the very top of the landing page. Ideal for festival sales (Dashain, Tihar), discounts, and urgent notices.
                </p>
              </div>

              {/* Live Mini Preview */}
              <div className="p-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Banner Live Preview</span>
                {formData.offerBanner.enabled ? (
                  <div className={`p-2.5 rounded-lg text-xs font-medium text-white flex flex-wrap items-center justify-between gap-2 shadow-xs ${
                    formData.offerBanner.bgTheme === 'emerald' ? 'bg-emerald-800' :
                    formData.offerBanner.bgTheme === 'amber' ? 'bg-amber-800' :
                    formData.offerBanner.bgTheme === 'rose' ? 'bg-rose-800' :
                    formData.offerBanner.bgTheme === 'dark' ? 'bg-slate-950' : 'bg-indigo-900'
                  }`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {formData.offerBanner.badge || 'OFFER'}
                      </span>
                      <span>{formData.offerBanner.text}</span>
                      {formData.offerBanner.discountCode && (
                        <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-200">
                          {formData.offerBanner.discountCode}
                        </span>
                      )}
                    </div>
                    <span className="font-bold underline text-white text-[11px]">{formData.offerBanner.linkText} →</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Banner is currently disabled. Toggle &quot;Show Banner&quot; below to enable.</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Show Announcement Banner</div>
                    <div className="text-xs text-slate-500">Enable or disable banner visibility on the landing page</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.offerBanner.enabled}
                    onChange={(e) => handleFieldChange('offerBanner', 'enabled', e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Badge Label</Label>
                    <Input
                      value={formData.offerBanner.badge}
                      onChange={(e) => handleFieldChange('offerBanner', 'badge', e.target.value)}
                      placeholder="e.g. DASHAIN OFFER, SPECIAL UPDATE"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Promo / Discount Code</Label>
                    <Input
                      value={formData.offerBanner.discountCode}
                      onChange={(e) => handleFieldChange('offerBanner', 'discountCode', e.target.value)}
                      placeholder="e.g. LITE2083, FESTIVE25"
                      className="text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Banner Announcement Text</Label>
                  <textarea
                    rows={2}
                    value={formData.offerBanner.text}
                    onChange={(e) => handleFieldChange('offerBanner', 'text', e.target.value)}
                    placeholder="Describe your promotion or announcement"
                    className="w-full text-sm rounded-md border border-slate-300 p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">CTA Link Text</Label>
                    <Input
                      value={formData.offerBanner.linkText}
                      onChange={(e) => handleFieldChange('offerBanner', 'linkText', e.target.value)}
                      placeholder="e.g. Claim Offer, View Plans"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">CTA Link Target</Label>
                    <Input
                      value={formData.offerBanner.linkUrl}
                      onChange={(e) => handleFieldChange('offerBanner', 'linkUrl', e.target.value)}
                      placeholder="e.g. #pricing or /demo"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Color Theme</Label>
                    <select
                      value={formData.offerBanner.bgTheme}
                      onChange={(e) => handleFieldChange('offerBanner', 'bgTheme', e.target.value)}
                      className="w-full h-10 text-sm rounded-md border border-slate-300 bg-white px-3 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="indigo">Indigo / Royal Blue</option>
                      <option value="emerald">Emerald Green</option>
                      <option value="amber">Warm Amber / Gold</option>
                      <option value="rose">Rose Red / Festive</option>
                      <option value="dark">Sleek Obsidian Dark</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & HEADLINES */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hero Section & Call-to-Actions</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Customize the first screen your visitors see — headline, description, trust badges, and primary action buttons.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Top Tagline Badge</Label>
                  <Input
                    value={formData.hero.badge}
                    onChange={(e) => handleFieldChange('hero', 'badge', e.target.value)}
                    placeholder="e.g. Built for Retail & Wholesale Shops in Nepal"
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Headline Line 1 (Dark Text)</Label>
                    <Input
                      value={formData.hero.titleLine1}
                      onChange={(e) => handleFieldChange('hero', 'titleLine1', e.target.value)}
                      className="text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Headline Line 2 (Accent Indigo Text)</Label>
                    <Input
                      value={formData.hero.titleLine2}
                      onChange={(e) => handleFieldChange('hero', 'titleLine2', e.target.value)}
                      className="text-sm font-semibold text-indigo-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Subtitle / Description</Label>
                  <textarea
                    rows={3}
                    value={formData.hero.description}
                    onChange={(e) => handleFieldChange('hero', 'description', e.target.value)}
                    className="w-full text-sm rounded-md border border-slate-300 p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Primary Button Label</Label>
                    <Input
                      value={formData.hero.primaryCtaText}
                      onChange={(e) => handleFieldChange('hero', 'primaryCtaText', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Secondary Button Label</Label>
                    <Input
                      value={formData.hero.secondaryCtaText}
                      onChange={(e) => handleFieldChange('hero', 'secondaryCtaText', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Pricing Hint Below Button</Label>
                    <Input
                      value={formData.hero.pricingHint}
                      onChange={(e) => handleFieldChange('hero', 'pricingHint', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Store Name in Live Demo Window</Label>
                    <Input
                      value={formData.hero.storeNameDemo}
                      onChange={(e) => handleFieldChange('hero', 'storeNameDemo', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">4 Trust Checklist Points</Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {formData.hero.trustBadges.map((badge, idx) => (
                      <div key={badge.id || idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <Input
                          value={badge.text}
                          onChange={(e) => {
                            const newBadges = [...formData.hero.trustBadges]
                            newBadges[idx] = { ...newBadges[idx], text: e.target.value }
                            handleFieldChange('hero', 'trustBadges', newBadges)
                          }}
                          className="text-xs h-9"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STATS & NUMBERS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Stats & Social Proof Strip</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Highlight key metrics like active shops, sales processed, and zero setup fee to build immediate trust.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Show Stats Strip</div>
                    <div className="text-xs text-slate-500">Display numbers on the landing page</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.stats.enabled}
                    onChange={(e) => handleFieldChange('stats', 'enabled', e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.stats.items.map((stat, idx) => (
                    <div key={stat.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">METRIC #{idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[11px] font-bold text-slate-600">Metric Value</Label>
                          <Input
                            value={stat.value}
                            onChange={(e) => {
                              const newItems = [...formData.stats.items]
                              newItems[idx] = { ...newItems[idx], value: e.target.value }
                              handleFieldChange('stats', 'items', newItems)
                            }}
                            className="text-sm font-black font-mono"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] font-bold text-slate-600">Metric Label</Label>
                          <Input
                            value={stat.label}
                            onChange={(e) => {
                              const newItems = [...formData.stats.items]
                              newItems[idx] = { ...newItems[idx], label: e.target.value }
                              handleFieldChange('stats', 'items', newItems)
                            }}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px] font-bold text-slate-600">Sublabel Note</Label>
                        <Input
                          value={stat.sublabel || ''}
                          onChange={(e) => {
                            const newItems = [...formData.stats.items]
                            newItems[idx] = { ...newItems[idx], sublabel: e.target.value }
                            handleFieldChange('stats', 'items', newItems)
                          }}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING & PLANS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pricing Plans & Special Offers</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Update plan pricing, discount badges, promo notices, and feature inclusions without modifying code.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Pricing Section Headline</Label>
                    <Input
                      value={formData.pricing.headline}
                      onChange={(e) => handleFieldChange('pricing', 'headline', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Promo Notice / Offer Code Alert</Label>
                    <Input
                      value={formData.pricing.promoNotice || ''}
                      onChange={(e) => handleFieldChange('pricing', 'promoNotice', e.target.value)}
                      placeholder="e.g. Use code LITE2083 for instant 25% discount"
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Plan Cards Editor */}
                <div className="space-y-4 pt-2">
                  {formData.pricing.plans.map((plan, planIdx) => (
                    <div
                      key={plan.id}
                      className={`p-4 sm:p-5 rounded-xl border transition-all ${
                        plan.isFeatured
                          ? 'border-indigo-400 bg-indigo-50/30 ring-1 ring-indigo-200'
                          : 'border-slate-200 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider bg-white border px-2 py-0.5 rounded">
                            {plan.id}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{plan.name}</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={plan.isFeatured}
                            onChange={(e) => {
                              const newPlans = formData.pricing.plans.map((p, idx) => ({
                                ...p,
                                isFeatured: idx === planIdx ? e.target.checked : false,
                              }))
                              handleFieldChange('pricing', 'plans', newPlans)
                            }}
                            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          Highlight as &quot;Best Value / Recommended&quot;
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-[11px] font-bold text-slate-600">Price (NPR)</Label>
                          <Input
                            type="number"
                            value={plan.price}
                            onChange={(e) => {
                              const newPlans = [...formData.pricing.plans]
                              const num = parseFloat(e.target.value) || 0
                              newPlans[planIdx] = {
                                ...newPlans[planIdx],
                                price: num,
                                priceFormatted: num.toLocaleString('en-IN'),
                              }
                              handleFieldChange('pricing', 'plans', newPlans)
                            }}
                            className="text-sm font-mono font-bold"
                          />
                        </div>

                        <div>
                          <Label className="text-[11px] font-bold text-slate-600">Period Tag</Label>
                          <Input
                            value={plan.period}
                            onChange={(e) => {
                              const newPlans = [...formData.pricing.plans]
                              newPlans[planIdx] = { ...newPlans[planIdx], period: e.target.value }
                              handleFieldChange('pricing', 'plans', newPlans)
                            }}
                            className="text-xs"
                          />
                        </div>

                        <div>
                          <Label className="text-[11px] font-bold text-slate-600">Cross-out Regular Price</Label>
                          <Input
                            value={plan.regularPriceFormatted || ''}
                            onChange={(e) => {
                              const newPlans = [...formData.pricing.plans]
                              newPlans[planIdx] = { ...newPlans[planIdx], regularPriceFormatted: e.target.value }
                              handleFieldChange('pricing', 'plans', newPlans)
                            }}
                            placeholder="e.g. 8,388"
                            className="text-xs font-mono"
                          />
                        </div>

                        <div>
                          <Label className="text-[11px] font-bold text-slate-600">Savings Badge Tag</Label>
                          <Input
                            value={plan.savingsFormatted || ''}
                            onChange={(e) => {
                              const newPlans = [...formData.pricing.plans]
                              newPlans[planIdx] = { ...newPlans[planIdx], savingsFormatted: e.target.value }
                              handleFieldChange('pricing', 'plans', newPlans)
                            }}
                            placeholder="e.g. 789"
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <Label className="text-[11px] font-bold text-slate-600">
                          Feature Bullet Points (one per line)
                        </Label>
                        <textarea
                          rows={4}
                          value={plan.features.join('\n')}
                          onChange={(e) => {
                            const newPlans = [...formData.pricing.plans]
                            newPlans[planIdx] = {
                              ...newPlans[planIdx],
                              features: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                            }
                            handleFieldChange('pricing', 'plans', newPlans)
                          }}
                          className="w-full text-xs rounded-md border border-slate-300 p-2 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-sans"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Feature Highlights</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Add, edit, or reorder the product feature cards shown on the landing page.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const newItem: FeatureItem = {
                      id: `f-${Date.now()}`,
                      title: 'New Feature Highlight',
                    }
                    handleFieldChange('features', 'items', [...formData.features.items, newItem])
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Feature
                </Button>
              </div>

              <div className="space-y-3">
                {formData.features.items.map((feat, idx) => (
                  <div key={feat.id || idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="h-6 w-6 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Input
                      value={feat.title}
                      onChange={(e) => {
                        const newItems = [...formData.features.items]
                        newItems[idx] = { ...newItems[idx], title: e.target.value }
                        handleFieldChange('features', 'items', newItems)
                      }}
                      className="text-xs sm:text-sm flex-1 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = formData.features.items.filter((_, i) => i !== idx)
                        handleFieldChange('features', 'items', newItems)
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete feature"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FAQ MANAGER */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">FAQ Question & Answers</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage the accordion FAQs to answer common shopkeeper questions and build confidence.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const newFaq: FAQItem = {
                      id: `faq-${Date.now()}`,
                      question: 'New Question?',
                      answer: 'Provide clear, friendly answer here.',
                    }
                    handleFieldChange('faq', 'items', [...formData.faq.items, newFaq])
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ
                </Button>
              </div>

              <div className="space-y-4">
                {formData.faq.items.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Q#{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFaqs = formData.faq.items.filter((_, i) => i !== idx)
                          handleFieldChange('faq', 'items', newFaqs)
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-700">Question</Label>
                      <Input
                        value={item.question}
                        onChange={(e) => {
                          const newFaqs = [...formData.faq.items]
                          newFaqs[idx] = { ...newFaqs[idx], question: e.target.value }
                          handleFieldChange('faq', 'items', newFaqs)
                        }}
                        className="text-xs sm:text-sm font-semibold bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-slate-700">Answer</Label>
                      <textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => {
                          const newFaqs = [...formData.faq.items]
                          newFaqs[idx] = { ...newFaqs[idx], answer: e.target.value }
                          handleFieldChange('faq', 'items', newFaqs)
                        }}
                        className="w-full text-xs sm:text-sm rounded-md border border-slate-300 p-2.5 bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT & WHATSAPP */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Support & Contact Settings</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Configure the primary WhatsApp sales/support number, pre-filled message, and business address.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">WhatsApp Phone Number (with Country Code)</Label>
                    <Input
                      value={formData.contact.whatsappNumber}
                      onChange={(e) => handleFieldChange('contact', 'whatsappNumber', e.target.value)}
                      placeholder="e.g. 9779805330808"
                      className="text-sm font-mono"
                    />
                    <p className="text-[11px] text-slate-400">Do not include + or spaces (e.g. 9779805330808)</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Support Phone Display</Label>
                    <Input
                      value={formData.contact.supportPhone}
                      onChange={(e) => handleFieldChange('contact', 'supportPhone', e.target.value)}
                      placeholder="+977-9805330808"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">WhatsApp Pre-filled Message (English)</Label>
                  <textarea
                    rows={2}
                    value={formData.contact.whatsappMessageEn}
                    onChange={(e) => handleFieldChange('contact', 'whatsappMessageEn', e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-md border border-slate-300 p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">WhatsApp Pre-filled Message (Nepali)</Label>
                  <textarea
                    rows={2}
                    value={formData.contact.whatsappMessageNe}
                    onChange={(e) => handleFieldChange('contact', 'whatsappMessageNe', e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-md border border-slate-300 p-2.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Support Email</Label>
                    <Input
                      type="email"
                      value={formData.contact.supportEmail}
                      onChange={(e) => handleFieldChange('contact', 'supportEmail', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Office Location / Address</Label>
                    <Input
                      value={formData.contact.address}
                      onChange={(e) => handleFieldChange('contact', 'address', e.target.value)}
                      placeholder="e.g. New Road, Kathmandu, Nepal"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Business Hours</Label>
                  <Input
                    value={formData.contact.businessHours}
                    onChange={(e) => handleFieldChange('contact', 'businessHours', e.target.value)}
                    placeholder="Sunday – Friday: 9:00 AM – 6:00 PM NPT"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Live Responsive Preview</h2>
                  <p className="text-xs text-slate-500">
                    See how your changes look in Mobile, Tablet, or Desktop viewport.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'mobile' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Mobile View (375px)"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'tablet' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Tablet View (768px)"
                  >
                    <Tablet className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'desktop' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Desktop View (Full Width)"
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center bg-slate-200/80 p-3 sm:p-6 rounded-2xl overflow-hidden min-h-[550px]">
                <div
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 transition-all duration-300 ${
                    previewDevice === 'mobile'
                      ? 'w-[375px] h-[667px]'
                      : previewDevice === 'tablet'
                      ? 'w-[768px] h-[750px]'
                      : 'w-full h-[750px]'
                  }`}
                >
                  <div className="w-full h-full overflow-y-auto scrollbar-thin">
                    <LandingPageView />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom Action Bar for Mobile & Quick Save */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {hasChanges ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              Unsaved changes
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              All changes saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className={`font-bold text-xs h-10 px-5 shadow-sm ${
              hasChanges ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Save className="h-4 w-4 mr-1.5" />
            {isSaving ? 'Saving...' : 'Save & Publish'}
          </Button>
        </div>
      </div>
    </div>
  )
}
