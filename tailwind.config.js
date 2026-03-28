/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "surface": "#fef7ff",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#424658",
        "surface-container-high": "#ede5f4",
        "on-primary-fixed-variant": "#5a00c6",
        "surface-container-highest": "#e8dfee",
        "on-primary": "#ffffff",
        "primary-container": "#7c3aed",
        "outline-variant": "#ccc3d8",
        "on-primary-fixed": "#25005a",
        "tertiary-fixed": "#dee1f8",
        "inverse-on-surface": "#f6eefc",
        "on-secondary-fixed-variant": "#832600",
        "primary": "#630ed4",
        "surface-bright": "#fef7ff",
        "secondary-container": "#fe6a34",
        "on-background": "#1d1a24",
        "tertiary-container": "#626679",
        "surface-container-lowest": "#ffffff",
        "surface-dim": "#dfd7e6",
        "on-secondary-fixed": "#390c00",
        "surface-container": "#f3ebfa",
        "inverse-primary": "#d2bbff",
        "outline": "#7b7487",
        "on-tertiary-fixed": "#171b2b",
        "on-error": "#ffffff",
        "primary-fixed-dim": "#d2bbff",
        "on-error-container": "#93000a",
        "on-secondary-container": "#5d1900",
        "on-tertiary-container": "#e2e5fb",
        "inverse-surface": "#332f39",
        "surface-variant": "#e8dfee",
        "primary-fixed": "#eaddff",
        "tertiary": "#4a4e60",
        "secondary": "#ab3500",
        "on-surface": "#1d1a24",
        "background": "#fef7ff",
        "on-primary-container": "#ede0ff",
        "surface-tint": "#732ee4",
        "tertiary-fixed-dim": "#c2c5db",
        "on-tertiary": "#ffffff",
        "surface-container-low": "#f9f1ff",
        "secondary-fixed": "#ffdbd0",
        "secondary-fixed-dim": "#ffb59d",
        "on-surface-variant": "#4a4455",
        "on-secondary": "#ffffff"
      },
      fontFamily: {
        "headline": ["System"], // Ideally Manrope, using System as fallback
        "body": ["System"],    // Ideally Inter
        "label": ["System"]
      }
    },
  },
  plugins: [],
}
