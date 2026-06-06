---
version: alpha
name: BlogForge Prestige
description: Dark premium editorial system for an autonomous AI blog. Inspired by Linear, Vercel, and premium SaaS dashboards. Indigo accent on void-black surfaces with glass morphism and tight editorial typography.
colors:
  bg: "#0b0c10"
  panel: "#111318"
  elevated: "#1a1d24"
  input: "#22262f"
  hover: "#2a2f3a"
  border: "rgba(255,255,255,0.07)"
  borderStrong: "rgba(255,255,255,0.13)"
  inkPrimary: "#f3f4f6"
  inkSecondary: "#c9cdd4"
  inkTertiary: "#9ca3af"
  inkMuted: "#6b7280"
  inkFaint: "#4b5563"
  accent: "#6366f1"
  accentStrong: "#818cf8"
  accentMuted: "#4f46e5"
  accentSubtle: "rgba(99,102,241,0.13)"
  accentRing: "rgba(129,140,248,0.28)"
  success: "#10b981"
  warn: "#f59e0b"
  danger: "#ef4444"
  shadowSm: "rgba(0,0,0,0.35) 0px 1px 2px"
  shadowMd: "rgba(0,0,0,0.45) 0px 4px 14px"
  shadowLg: "rgba(99,102,241,0.18) 0px 18px 52px"
typography:
  brand: Geist, Inter, system-ui
  mono: Geist Mono, JetBrains Mono, monospace
  display: Geist, Inter, system-ui
  scale:
    xs: 0.75rem
    sm: 0.875rem
    base: 1rem
    md: 1.125rem
    lg: 1.25rem
    xl: 1.5rem
    "2xl": 1.875rem
    "3xl": 2.25rem
    "4xl": 3rem
    "5xl": 3.75rem
  weight:
    thin: 100
    light: 300
    normal: 400
    medium: 500
    semibold: 600
    bold: 700
    heavy: 900
  letterSpacing:
    tight: -0.025em
    snug: -0.01em
    normal: 0em
    wide: 0.025em
    ultra: 0.05em
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  "24": 96px
  "32": 128px
  px: 1px
radius:
  none: 0px
  sm: 6px
  md: 10px
  lg: 16px
  xl: 22px
  "2xl": 28px
  "3xl": 36px
  full: 9999px
elevation:
  "1": "0 1px 2px rgba(0,0,0,0.4)"
  "2": "0 6px 16px rgba(0,0,0,0.45)"
  "3": "0 14px 34px rgba(0,0,0,0.55)"
  "4": "0 28px 72px rgba(0,0,0,0.65)"
  accentGlow: "0 18px 52px rgba(99,102,241,0.22)"
motion:
  durationFast: 120ms
  durationNormal: 200ms
  durationSlow: 320ms
  easing: cubic-bezier(0.4,0,0.2,1)
  easingOut: cubic-bezier(0,0,0.2,1)
  easingIn: cubic-bezier(0.4,0,1,1)
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{radius.md}"
    padding: 10px 18px
    typography: "{typography.base}:500"
    elevation: "{elevation.accentGlow}"
  button-primary-hover:
    backgroundColor: "{colors.accentStrong}"
    textColor: "#ffffff"
    rounded: "{radius.md}"
    padding: 10px 18px
    elevation: "{elevation.4}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.inkSecondary}"
    rounded: "{radius.md}"
    padding: 10px 18px
    border: "1px solid {colors.borderStrong}"
  button-ghost-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.inkPrimary}"
    rounded: "{radius.md}"
    padding: 10px 18px
  card:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.inkPrimary}"
    rounded: "{radius.xl}"
    border: "1px solid {colors.border}"
    elevation: "{elevation.1}"
  card-interactive:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.inkPrimary}"
    rounded: "{radius.xl}"
    border: "1px solid {colors.border}"
    elevation: "{elevation.2}"
  input:
    backgroundColor: "{colors.input}"
    textColor: "{colors.inkPrimary}"
    rounded: "{radius.md}"
    border: "1px solid {colors.border}"
    padding: 10px 14px
  input-focus:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.inkPrimary}"
    rounded: "{radius.md}"
    border: "1px solid {colors.accent}"
    boxShadow: "0 0 0 4px {colors.accentSubtle}"
overview: |
  BlogForge Prestige is a dark editorial design system tuned for clarity, speed, and depth.
  The palette is anchored by void-black surfaces and an indigo accent.
  Motion is minimal and intentional, supporting hierarchy without decoration.
  Components use consistent radius, elevation, and typography scales so the interface
  stays coherent across pages as it grows.
colors:
  primary: "#6366f1"
  secondary: "#818cf8"
  background: "#0b0c10"
  surface: "#111318"
  success: "#10b981"
  warning: "#f59e0b"
  error: "#ef4444"
typography:
  fontFamily: Geist, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial
  fontSize: 16px
  fontWeight: 500
  lineHeight: 1.6
components:
  button:
    background: linear-gradient(135deg, #6366f1, #4f46e5)
    color: white
    borderRadius: 12px
    padding: 10px 18px
    boxShadow: 0 6px 20px rgba(99,102,241,0.35)
  card:
    background: #1a1d24
    border: 1px solid rgba(255,255,255,0.07)
    borderRadius: 20px
