"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Define nav items with additional metadata
const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/inventory", label: "Inventory", icon: "📦" },
  { href: "/orders", label: "Orders", icon: "📝" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-slate-200/10 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Kenya Airways</span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
