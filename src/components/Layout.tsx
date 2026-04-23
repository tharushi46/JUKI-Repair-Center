import type { PropsWithChildren } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BUSINESS, telHref } from '../config/business'
import logoUrl from '../assets/logo.png'

function NavItem({
  to,
  children,
}: PropsWithChildren<{
  to: string
}>) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-xl px-3 py-2 text-sm font-semibold transition',
          isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
      end
    >
      {children}
    </NavLink>
  )
}

export function Layout({ children }: PropsWithChildren) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="container-page flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <img
                src={logoUrl}
                alt={`${BUSINESS.name} logo`}
                className="h-full w-full object-contain p-1"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">
                {BUSINESS.name}
              </div>
              <div className="text-xs text-slate-500">
                Sewing machine repair & sales
              </div>
            </div>
          </Link>

          {!isAdminRoute ? (
            <nav className="flex items-center gap-1">
              <NavItem to="/">Home</NavItem>
            </nav>
          ) : (
            <div className="text-xs font-semibold text-slate-600">Admin</div>
          )}

          <a
            href={telHref(BUSINESS.phoneE164)}
            className="btn-secondary hidden sm:inline-flex"
          >
            Call {BUSINESS.phoneDisplay}
          </a>
        </div>
      </header>

      <main className="container-page py-8">{children}</main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur sm:hidden">
        <div className="container-page py-3">
          <a href={telHref(BUSINESS.phoneE164)} className="btn-primary w-full">
            Call {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>

      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="container-page py-10">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src={logoUrl}
                    alt="JUKI Repair Center logo"
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="leading-tight">
                  <div className="text-base font-black tracking-tight text-slate-900">
                    JUKI Repair Center
                  </div>
                  <div className="text-xs text-slate-500">Sewing machine repair & sales</div>
                </div>
              </div>

              <div className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                Professional repair, maintenance, and sales for Juki sewing machines. Quick diagnostics,
                quality parts, and reliable after‑service support.
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="text-sm font-extrabold text-slate-900">Contact details</div>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {BUSINESS.owner ? (
                  <div className="font-semibold text-slate-800">{BUSINESS.owner}</div>
                ) : null}
                {BUSINESS.address ? <div>{BUSINESS.address}</div> : null}
                <div>
                  <a className="font-semibold text-slate-900" href={telHref(BUSINESS.phoneE164)}>
                    {BUSINESS.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="text-sm font-extrabold text-slate-900">Quick actions</div>
              <div className="mt-3 flex flex-col gap-2">
                <a href={telHref(BUSINESS.phoneE164)} className="btn-primary w-full">
                  Call now
                </a>
                <Link to="/" className="btn-secondary w-full">
                  Browse machines
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>All Rights Reserved</div>
            <div>
              Created by <span className="font-semibold text-slate-700">TNSoftwares</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

