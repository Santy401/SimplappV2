/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // 👇 ESTO ES LO QUE PERMITE USAR UI SIN ESTILOS ROTOS
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};
