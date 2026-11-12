"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } =
    useSidebarStore();
  const { currentUser, role, logout } = useAuthStore();

  const handleSignOut = () => {
    logout();
    router.push("/auth/login");
    router.refresh();
  };

  const roleName = role || currentUser?.role?.name?.toLowerCase() || "staff";

  const roleBadgeColors: Record<string, string> = {
    admin:
      "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30",
    doctor:
      "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
    nurse:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    cashier:
      "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
  };

  const roleBadgeIcons: Record<string, string> = {
    admin: "⚡",
    doctor: "🩺",
    nurse: "💉",
    cashier: "💳",
  };

  const navLinks = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      name: "Patients",
      href: "/dashboard/patients",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          />
          <circle cx="9" cy="7" r="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M23 21v-2a4 4 0 00-3-3.87"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 3.13a4 4 0 010 7.75"
          />
        </svg>
      ),
    },
    {
      name: "Appointments",
      href: "/dashboard#appointments",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
          <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      name: "Clinical Queue",
      href: "/dashboard#queue",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline
            points="12 6 12 12 16 14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Add Patient",
      href: "/dashboard/patients/new",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" strokeLinecap="round" />
          <line x1="23" y1="11" x2="17" y2="11" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "Analytics & Reports",
      href: "/dashboard#analytics",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <polyline
            points="23 6 13.5 15.5 8.5 10.5 1 18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="17 6 23 6 23 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Notifications",
      href: "/dashboard#notifications",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.73 21a2 2 0 01-3.46 0"
          />
        </svg>
      ),
    },
    {
      name: "Billing & Invoices",
      href: "/dashboard#billing",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
          />
          <polyline
            points="14 2 14 8 20 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
          <polyline
            points="10 9 9 9 8 9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Clinic Services",
      href: "/dashboard#services",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
          />
          <polyline
            points="3.27 6.96 12 12.01 20.73 6.96"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      name: "Partners & Facility",
      href: "/dashboard#facility",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="9" y1="22" x2="9" y2="18" />
          <line x1="15" y1="22" x2="15" y2="18" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <circle cx="9" cy="7" r="1" fill="currentColor" />
          <circle cx="15" cy="7" r="1" fill="currentColor" />
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "Payments & POS",
      href: "/dashboard#payments",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/dashboard#settings",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-Out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white p-5 shadow-2xl transition-transform duration-200 ease-in-out dark:border-zinc-800 dark:bg-[#0c1017] lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25">
              BF
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              BookFlow
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/dashboard" && pathname === "/dashboard");
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold dark:bg-slate-800 dark:text-blue-400 dark:border dark:border-slate-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              Theme
            </span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Desktop Fixed Viewport Sidebar */}
      <aside
        className={`hidden h-screen sticky top-0 flex-col shrink-0 border-r border-slate-200/90 bg-white transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-[#0c1017] lg:flex ${
          sidebarCollapsed ? "w-[72px] px-2.5 py-4" : "w-64 p-5"
        }`}
      >
        {/* Pinned Top Brand */}
        <div
          className={`shrink-0 flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
        >
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25">
              BF
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  BookFlow
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                  Clinical Workspace
                </span>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>
        {/* Independently Scrollable Navigation Links */}
        <nav
          className={`mt-5 flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-0.5 ${sidebarCollapsed ? "flex flex-col items-center" : ""}`}
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/dashboard" && pathname === "/dashboard");
            return (
              <div
                key={link.name}
                className="relative group w-full flex justify-center"
              >
                <Link
                  href={link.href}
                  className={`flex items-center transition-all ${
                    sidebarCollapsed
                      ? `h-10 w-10 justify-center rounded-xl ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 dark:bg-slate-800/90 dark:text-blue-400 dark:border dark:border-slate-700/80"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                        }`
                      : `w-full gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold dark:bg-blue-600/15 dark:text-blue-400"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                        }`
                  }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="truncate">{link.name}</span>
                  )}
                </Link>

                {/* Floating Tooltip in collapsed mode */}
                {sidebarCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-3 hidden rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-xl whitespace-nowrap group-hover:block dark:bg-zinc-800 dark:text-zinc-100 border border-slate-700/30 dark:border-zinc-700 z-50">
                    {link.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Pinned Bottom User & Collapse Button */}
        <div className="shrink-0 border-t border-slate-200/80 pt-2 dark:border-zinc-800">
          <button
            onClick={toggleSidebar}
            className={`flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100 transition-colors cursor-pointer ${
              sidebarCollapsed
                ? "mx-auto h-9 w-9 mb-2"
                : "w-full gap-2 px-3 py-2 text-xs font-medium mb-3"
            }`}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          {!sidebarCollapsed ? (
            <div>
              <div className="flex items-center gap-3 px-2 py-1.5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white uppercase shadow-sm">
                  {currentUser?.full_name?.charAt(0) || "U"}
                </div>
                <div className="truncate">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                    {currentUser?.full_name}
                  </p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:border-red-900/40 transition-colors cursor-pointer"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="group relative flex justify-center">
              <button
                onClick={handleSignOut}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white uppercase shadow-sm cursor-pointer"
                title="Sign out"
              >
                {currentUser?.full_name?.charAt(0) || "U"}
              </button>
              <div className="pointer-events-none absolute left-full ml-3 hidden rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-xl whitespace-nowrap group-hover:block dark:bg-zinc-800 dark:text-zinc-100 z-50">
                {currentUser?.full_name || "Staff User"} (Click to sign out)
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
