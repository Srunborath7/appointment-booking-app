'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/auth';
import { ApiError } from '@/types/api.type';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Account Autofill
  const handleAutoFill = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMessage(null);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authApi.login({
        email: email.trim(),
        password,
      });

      if (response && response.data) {
        const userRole = response.data.user?.role?.name?.toLowerCase();
        // Redirect: Patients only access home page, staff access dashboard
        if (userRole === 'patient') {
          router.push('/');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unable to sign in. Please verify your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 font-sans selection:bg-blue-600 selection:text-white">
      {/* =========================================================================
          LEFT PANEL: Showcase & Hero Showcase (Visible on large screens)
      ========================================================================== */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-zinc-950 p-12 text-white lg:flex xl:p-16">
        {/* Ambient Gradient Lights */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        {/* Subtle Background Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">BookFlow</span>
              <span className="ml-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                PRO
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Cloud API
          </div>
        </div>

        {/* Middle Showcase: Mock Booking Dashboard Cards */}
        <div className="relative z-10 my-auto space-y-5 max-w-lg">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl">
              Effortless bookings, <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                intelligent scheduling.
              </span>
            </h1>
            <p className="mt-3 text-base text-zinc-400 leading-relaxed">
              Automate client appointments, sync provider availability, and manage role-based permissions in one unified dashboard.
            </p>
          </div>

          {/* Interactive Feature Cards Stack */}
          <div className="space-y-3.5 pt-2">
            {/* Card 1: Active Appointment */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl shadow-2xl shadow-black/40 transition-all hover:bg-white/[0.08]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                    10:30
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Executive Strategy Review</h4>
                    <p className="text-xs text-zinc-400">Dr. Sarah Adams • 45 mins session</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Card 2: Micro-metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Avg. Response Time
                </div>
                <div className="mt-1.5 text-xl font-bold text-white">&lt; 1.2s</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Conflict-free SLA
                </div>
                <div className="mt-1.5 text-xl font-bold text-white">100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="mt-2 text-xs italic text-zinc-300">
            &ldquo;Setting up roles and connecting our Supabase database was seamless. The booking flow handles dozens of daily appointments without a hitch.&rdquo;
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-400">
            — Product Team, Sronoh Operations
          </p>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: Authentication Form
      ========================================================================== */}
      <div className="flex flex-1 flex-col justify-between px-6 py-10 sm:px-12 md:px-16 lg:px-20 xl:px-24 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">BookFlow</span>
          </div>

          <div className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Center Card / Form */}
        <div className="mx-auto my-auto w-full max-w-sm sm:max-w-md space-y-6 pt-6 pb-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in with your email and password to continue.
            </p>
          </div>

          {/* Quick Demo Autofill Roles */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                Quick Login as:
              </span>
              <span className="text-[10px] text-blue-600/80 dark:text-blue-400">1-click test</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleAutoFill('doctor@example.com', 'Doctor123456!')}
                className="rounded-lg bg-white py-1 px-2 text-center text-xs font-medium text-zinc-800 shadow-2xs hover:bg-blue-600 hover:text-white transition-all dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                🩺 Doctor
              </button>
              <button
                type="button"
                onClick={() => handleAutoFill('nurse@example.com', 'Nurse123456!')}
                className="rounded-lg bg-white py-1 px-2 text-center text-xs font-medium text-zinc-800 shadow-2xs hover:bg-blue-600 hover:text-white transition-all dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                💉 Nurse
              </button>
              <button
                type="button"
                onClick={() => handleAutoFill('admin@example.com', 'Admin123456!')}
                className="rounded-lg bg-white py-1 px-2 text-center text-xs font-medium text-zinc-800 shadow-2xs hover:bg-blue-600 hover:text-white transition-all dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                ⚡ Admin
              </button>
              <button
                type="button"
                onClick={() => handleAutoFill('cashier@example.com', 'Cashier123456!')}
                className="rounded-lg bg-white py-1 px-2 text-center text-xs font-medium text-zinc-800 shadow-2xs hover:bg-blue-600 hover:text-white transition-all dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                💳 Cashier
              </button>
              <button
                type="button"
                onClick={() => handleAutoFill('patient@example.com', 'Patient123456!')}
                className="col-span-2 sm:col-span-1 rounded-lg bg-white py-1 px-2 text-center text-xs font-medium text-zinc-800 shadow-2xs hover:bg-blue-600 hover:text-white transition-all dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                🧑‍💼 Patient
              </button>
            </div>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 animate-in fade-in duration-200">
              <svg className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                &times;
              </button>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="name@company.com"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-800"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link will be sent to your registered email.');
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onKeyUp={handleKeyUp}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* CapsLock Warning Helper */}
              {capsLockActive && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Caps Lock is ON</span>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-md border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-zinc-600 dark:text-zinc-400 select-none cursor-pointer"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-600/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Sign in
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Social / OAuth Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500 font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert('Social OAuth integration is ready to connect with your provider!')}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition-colors dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => alert('Social OAuth integration is ready to connect with your provider!')}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition-colors dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 cursor-pointer"
            >
              <svg className="h-4 w-4 fill-current text-zinc-900 dark:text-zinc-100" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-xs text-zinc-500 sm:flex-row dark:text-zinc-500">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>256-bit SSL encrypted & secure</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-zinc-800 dark:hover:text-zinc-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-zinc-800 dark:hover:text-zinc-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
