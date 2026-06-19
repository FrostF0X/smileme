/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
              "on-tertiary-fixed": "#000766",
              "outline-variant": "#593f4d",
              "surface-container-low": "#26171f",
              "on-error": "#690005",
              "on-secondary-fixed-variant": "#4a4900",
              "inverse-surface": "#f7dbe7",
              "inverse-primary": "#b20087",
              "primary-container": "#ff38c4",
              "on-tertiary-fixed-variant": "#001de0",
              "on-primary-container": "#55003e",
              "surface": "#1d0f17",
              "surface-container": "#2b1b23",
              "on-secondary": "#333200",
              "on-background": "#f7dbe7",
              "error-container": "#93000a",
              "surface-container-lowest": "#180a12",
              "tertiary-container": "#7885ff",
              "surface-tint": "#ffaedb",
              "on-secondary-container": "#616000",
              "secondary-fixed": "#ebe91d",
              "surface-container-high": "#36252e",
              "on-primary-fixed": "#3c002b",
              "error": "#ffb4ab",
              "tertiary": "#bdc2ff",
              "on-tertiary-container": "#000e8e",
              "tertiary-fixed-dim": "#bdc2ff",
              "secondary-container": "#e0de02",
              "primary-fixed-dim": "#ffaedb",
              "on-primary": "#610048",
              "on-tertiary": "#0012a1",
              "inverse-on-surface": "#3d2b34",
              "on-error-container": "#ffdad6",
              "on-primary-fixed-variant": "#880066",
              "primary": "#ffaedb",
              "background": "#1d0f17",
              "on-secondary-fixed": "#1d1d00",
              "surface-container-highest": "#413039",
              "secondary": "#fdfb35",
              "surface-variant": "#413039",
              "tertiary-fixed": "#dfe0ff",
              "primary-fixed": "#ffd8ea",
              "outline": "#a78897",
              "surface-bright": "#46343d",
              "on-surface-variant": "#e0bdcd",
              "on-surface": "#f7dbe7",
              "secondary-fixed-dim": "#cecd00",
              "surface-dim": "#1d0f17"
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "spacing": {
              "unit": "4px",
              "container-max": "1440px",
              "margin-desktop": "64px",
              "gutter": "24px",
              "margin-mobile": "20px",
              "panel-padding": "16px",
              "inspector-width": "280px",
              "toolbar-width": "56px"
      },
      "fontFamily": {
              "headline-lg": [
                      "Syne"
              ],
              "label-sm": [
                      "Geist"
              ],
              "body-md": [
                      "Hanken Grotesk"
              ],
              "headline-lg-mobile": [
                      "Syne"
              ],
              "display-lg": [
                      "Syne"
              ]
      },
      "fontSize": {
              "headline-lg": [
                      "40px",
                      {
                              "lineHeight": "48px",
                              "letterSpacing": "-0.02em",
                              "fontWeight": "700"
                      }
              ],
              "label-sm": [
                      "12px",
                      {
                              "lineHeight": "16px",
                              "letterSpacing": "0.05em",
                              "fontWeight": "600"
                      }
              ],
              "body-md": [
                      "16px",
                      {
                              "lineHeight": "24px",
                              "letterSpacing": "0em",
                              "fontWeight": "400"
                      }
              ],
              "headline-lg-mobile": [
                      "32px",
                      {
                              "lineHeight": "36px",
                              "letterSpacing": "-0.02em",
                              "fontWeight": "700"
                      }
              ],
              "display-lg": [
                      "72px",
                      {
                              "lineHeight": "76px",
                              "letterSpacing": "-0.04em",
                              "fontWeight": "800"
                      }
              ]
      }
    },
  },
  plugins: [],
}
