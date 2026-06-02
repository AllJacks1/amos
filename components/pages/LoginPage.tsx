"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import TermsOfServiceModal from "../sections/TermsModal";

const BRAND = "#430062";
const BRAND_DARK = "#2d0044";
const BRAND_LIGHT = "#6b1a8f";

const FEATURES = [
  "Integrated Marketing Workflow",
  "Real-time Campaign Tracking",
  "Collaborative Client Experience",
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      setUser({ ...data.user, type: data.type });
      router.push("/content");
    } catch {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "block w-full pl-10 pr-3 py-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#430062]/25 focus:border-[#430062]/40 focus:bg-white transition-all duration-200 sm:text-sm shadow-sm";

  return (
    <div className="fixed inset-0 flex h-dvh max-h-dvh w-full overflow-hidden overscroll-none bg-[#f8f7fa]">
      <div className="relative hidden shrink-0 overflow-hidden lg:flex lg:w-[52%]">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(145deg, ${BRAND} 0%, ${BRAND_DARK} 55%, #1a0028 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] rounded-full bg-[#9d4edd]/30 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 text-white w-full">
          <div className="relative h-20 w-56">
            <Image
              src="/logos/axiscommand_white.png"
              alt="Axis Command Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <div className="max-w-lg space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Marketing operations platform
            </div>

            <div>
              <h2 className="text-4xl xl:text-[2.75rem] font-semibold leading-[1.15] tracking-tight">
                Welcome back to{" "}
                <span className="text-white/95">Axis Command</span>
              </h2>
              <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-md">
                Manage content, campaigns, reporting, and approvals in one
                streamlined marketing workspace.
              </p>
            </div>

            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  </span>
                  <span className="text-sm font-medium text-white/90">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/50">
            © 2026{" "}
            <a
              href="https://www.astragroupph.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline-offset-2 hover:underline transition-colors"
            >
              Astra Group of Companies, Inc.
            </a>{" "}
            All rights reserved.
          </p>
        </div>
      </div>

      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-y-auto overscroll-y-contain p-6 sm:p-10 lg:w-[48%]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(67, 0, 98, 0.08), transparent),
              radial-gradient(ellipse 60% 40% at 100% 100%, rgba(107, 26, 143, 0.06), transparent)
            `,
          }}
        />

        <div className="relative w-full max-w-[420px]">
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logos/axiscommand_primary.png"
              alt="Axis Command Logo"
              width={220}
              height={74}
              className="object-contain"
              priority
            />
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-8 sm:p-9 shadow-xl shadow-gray-900/[0.04] ring-1 ring-gray-900/[0.03]">
            <div className="mb-8 text-center lg:text-left">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: BRAND_LIGHT }}
              >
                AMOS
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-[#430062]/70 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-[#430062]/70 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors rounded-r-xl"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-md shadow-[#430062]/20 hover:shadow-lg hover:shadow-[#430062]/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#430062]/40 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)`,
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-xs text-gray-500 leading-relaxed">
        By signing in, you agree to our{" "}
        <button
          type="button"
          onClick={() => setIsTermsOpen(true)}
          className="font-medium hover:underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer"
          style={{ color: BRAND }}
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <button
          type="button"
          //onClick={() => setIsPrivacyOpen(true)}
          className="font-medium hover:underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer"
          style={{ color: BRAND }}
        >
          Privacy Policy
        </button>
      </p>
            </div>
          </div>
        </div>
      </div>
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}
