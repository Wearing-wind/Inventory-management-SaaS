"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Menu } from 'lucide-react'
import { isRouteActive } from '@/lib/utils'

interface MobileBottomBarProps {
  onOpenMore: () => void
}

export function MobileBottomBar({ onOpenMore }: MobileBottomBarProps) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Home', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/app/products', icon: Package },
    { name: 'POS', href: '/app/sales/new', icon: ShoppingCart },
    { name: 'Customers', href: '/app/customers', icon: Users },
  ]

  const currentPath = pathname || ''

  return (
    <nav
      aria-label="Mobile navigation bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const allTabHrefs = tabs.map((t) => t.href)
          const isActive = isRouteActive(tab.href, currentPath, allTabHrefs)
          const isPos = tab.name === 'POS'
          const Icon = tab.icon

          if (isPos) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[50px] active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/25 ring-2 ring-indigo-300'
                    : 'bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200 hover:bg-indigo-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight uppercase font-black">{tab.name}</span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[50px] active:scale-95 ${
                isActive
                  ? 'text-indigo-600 font-bold bg-indigo-50/70'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-indigo-600" />
              )}
              <Icon className={`h-5 w-5 transition-transform ${isActive ? 'text-indigo-600 scale-105' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-1 tracking-tight font-medium leading-none">{tab.name}</span>
            </Link>
          )
        })}

        {/* More Menu Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Open navigation menu drawer"
          className="relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 min-h-[50px] font-medium active:scale-95"
        >
          <Menu className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] mt-1 tracking-tight font-medium leading-none">More</span>
        </button>
      </div>
    </nav>
  )
}
