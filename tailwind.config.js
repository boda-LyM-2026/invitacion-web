/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        champagne: {
          DEFAULT: "#EBE3D5",
          50: "#FBF9F6",
          100: "#F5F1EA",
          200: "#EBE3D5",
          300: "#DDD0B8",
        },
        alabaster: {
          DEFAULT: "#F1F0E8",
          50: "#FBFBF8",
        },
        pistachio: {
          DEFAULT: "#93A27D",
          50: "#F1F3ED",
          100: "#E1E6D8",
          200: "#C4CEB2",
          300: "#A7B78D",
          400: "#93A27D",
          500: "#7E8F67",
          600: "#697851",
          700: "#54613F",
        },
        sage: {
          DEFAULT: "#7C8B65",
          dark: "#616E4D",
        },
        olive: {
          DEFAULT: "#616E4D",
          900: "#3E4732",
        },
        ink: "#2C3324",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Jost'", "system-ui", "sans-serif"],
        script: ["'Fraunces'", "serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      backgroundImage: {
        "leaf-fade":
          "radial-gradient(120% 120% at 50% 0%, #F1F0E8 0%, #EBE3D5 45%, #C4CEB2 100%)",
        "olive-fade":
          "linear-gradient(180deg, #93A27D 0%, #7C8B65 55%, #616E4D 100%)",
      },
      boxShadow: {
        soft: "0 20px 60px -25px rgba(97, 110, 77, 0.45)",
        card: "0 10px 40px -12px rgba(44, 51, 36, 0.25)",
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
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};
