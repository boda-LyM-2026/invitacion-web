/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        champagne: {
          DEFAULT: "#E7DBCB",
          50: "#FBF9F6",
          100: "#F5F1EA",
          200: "#E7DBCB",
          300: "#DDD0B8",
          400: "#D4C4A8",
        },
        alabaster: {
          DEFAULT: "#F9F9EF",
          50: "#FDFDF8",
          100: "#F9F9EF",
        },
        pistachio: {
          DEFAULT: "#969D7B",
          50: "#F4F5F0",
          100: "#E6E8DD",
          200: "#CDD2BC",
          300: "#B3B99C",
          400: "#969D7B",
          500: "#7D8465",
          600: "#646B50",
          700: "#4B523C",
        },
        sage: {
          DEFAULT: "#CACEBE",
          light: "#D8DDD0",
          dark: "#A8AD9A",
        },
        olive: {
          DEFAULT: "#828661",
          50: "#E8E9DF",
          100: "#D1D3C3",
          200: "#B5B79F",
          300: "#999B7E",
          400: "#828661",
          500: "#6B6F4E",
          600: "#54583C",
          700: "#3D412A",
          900: "#2A2D1D",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          light: "#3d3d3d",
          muted: "#6b6b6b",
        },
        cinematic: {
          black: "#0a0a0a",
          dark: "#1a1a1a",
          gray: "#3d3d3d",
          muted: "#525252",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "'Fraunces'", "serif"],
        body: ["'Jost'", "system-ui", "sans-serif"],
        script: ["'Fraunces'", "serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
        cinematic: "0.25em",
      },
      backgroundImage: {
        "leaf-fade":
          "radial-gradient(120% 120% at 50% 0%, #F9F9EF 0%, #E7DBCB 45%, #CDD2BC 100%)",
        "olive-fade":
          "linear-gradient(180deg, #969D7B 0%, #828661 55%, #6B6F4E 100%)",
        "cinematic-gradient":
          "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)",
        "champagne-glow":
          "radial-gradient(ellipse at center, rgba(231,219,203,0.2) 0%, transparent 70%)",
        "olive-vignette":
          "radial-gradient(ellipse at center, transparent 30%, rgba(130,134,97,0.25) 100%)",
        "dark-vignette":
          "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.6) 100%)",
      },
      boxShadow: {
        soft: "0 20px 60px -25px rgba(130,134,97,0.4)",
        card: "0 10px 40px -12px rgba(26,26,26,0.2)",
        cinematic: "0 25px 80px -20px rgba(10,10,10,0.6)",
        "glow-olive": "0 0 40px rgba(130,134,97,0.3)",
        "glow-champagne": "0 0 30px rgba(231,219,203,0.4)",
        "glow-gold": "0 0 20px rgba(212,196,168,0.5)",
        glass: "0 8px 32px rgba(10,10,10,0.15)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "float-particle": {
          "0%, 100%": { transform: "translateY(0) translateX(0) scale(1)", opacity: "0.6" },
          "25%": { transform: "translateY(-20px) translateX(10px) scale(1.1)", opacity: "0.8" },
          "50%": { transform: "translateY(-10px) translateX(-5px) scale(0.95)", opacity: "0.5" },
          "75%": { transform: "translateY(-25px) translateX(15px) scale(1.05)", opacity: "0.7" },
        },
        "shimmer-gold": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(130,134,97,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(130,134,97,0.4)" },
        },
        "curtain-open": {
          "0%": { clipPath: "inset(0 50% 0 50%)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
        "float-particle": "float-particle 8s ease-in-out infinite",
        "shimmer-gold": "shimmer-gold 4s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "curtain-open": "curtain-open 1.5s ease-out forwards",
        "fade-in-up": "fade-in-up 1s ease-out forwards",
        "scale-in": "scale-in 0.8s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
