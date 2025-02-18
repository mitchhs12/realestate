import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { PluginAPI } from "tailwindcss/types/config";

const config = {
  darkMode: "class",
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "8xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        charter: ["charter"],
      },
      filter: {
        white: "brightness(0) invert(1)",
      },
      height: {
        "screen-minus-header": "calc(100vh - 88px)",
        "screen-minus-header-footer": "calc(100vh - 88px - 100px)",
        "screen-minus-header-dvh": "calc(100dvh - 88px)",
        "screen-minus-header-svh": "calc(100svh - 88px)",
        "screen-minus-header-double-svh": "calc(100svh - 152px)",
        "screen-minus-header-double-dvh": "calc(100dvh - 152px)",
        "screen-minus-header-double-lvh": "calc(100lvh - 152px)",
      },
      minHeight: {
        "screen-minus-header-double-svh": "calc(100svh - 152px)",
        "screen-minus-header": "calc(100vh - 88px)",
        "screen-minus-header-footer": "calc(100vh - 88px - 100px)",
        "screen-minus-header-dvh": "calc(100dvh - 88px)",
        "screen-minus-header-svh": "calc(100svh - 88px)",
      },
      maxWidth: {
        "8xl": "1440px",
      },
      screens: {
        "2xs": "400px",
        xs: "510px",
        "3xl": "1920px",
        "8xl": "1440px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    plugin(({ addUtilities }: PluginAPI) => {
      addUtilities({
        ".filter-white": {
          filter: "brightness(0) invert(1)",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
