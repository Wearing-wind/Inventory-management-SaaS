"use client"

import { useState } from 'react'
import { OfferBannerConfig } from '@/types/landing-cms'
import { Sparkles, ArrowRight, X, Copy, Check } from 'lucide-react'

interface OfferBannerProps {
  config: OfferBannerConfig
}

export function OfferBanner({ config }: OfferBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!config?.enabled || dismissed) return null

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (config.discountCode && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(config.discountCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Color themes
  const themeStyles = {
    indigo: 'bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900 text-white border-indigo-500/30',
    emerald: 'bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-900 text-white border-emerald-500/30',
    amber: 'bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 text-white border-amber-500/30',
    rose: 'bg-gradient-to-r from-rose-900 via-rose-700 to-rose-900 text-white border-rose-500/30',
    dark: 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-slate-700/50',
  }

  const badgeThemeStyles = {
    indigo: 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40',
    emerald: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40',
    amber: 'bg-amber-500/30 text-amber-200 border-amber-400/40',
    rose: 'bg-rose-500/30 text-rose-200 border-rose-400/40',
    dark: 'bg-slate-800 text-slate-200 border-slate-700',
  }

  const selectedTheme = themeStyles[config.bgTheme] || themeStyles.indigo
  const selectedBadge = badgeThemeStyles[config.bgTheme] || badgeThemeStyles.indigo

  return (
    <aside
      aria-label="Special Announcement"
      className={`relative z-50 w-full py-2.5 px-3 sm:px-6 border-b text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${selectedTheme}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left side / center offer info */}
        <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {config.badge && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider border shadow-2xs ${selectedBadge}`}
            >
              <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
              {config.badge}
            </span>
          )}

          <span className="leading-snug font-medium text-slate-100 text-center sm:text-left">
            {config.text}
          </span>

          {config.discountCode && (
            <button
              type="button"
              onClick={handleCopyCode}
              title="Click to copy code"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-[11px] font-mono font-bold text-amber-200 border border-white/20 ml-1"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-300">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 opacity-70" />
                  <span>{config.discountCode}</span>
                </>
              )}
            </button>
          )}

          {config.linkText && config.linkUrl && (
            <a
              href={config.linkUrl}
              className="inline-flex items-center gap-1 font-bold text-white underline underline-offset-4 hover:text-amber-200 transition-colors ml-1"
            >
              <span>{config.linkText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
