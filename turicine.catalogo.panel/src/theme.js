import { createTheme } from "@mui/material/styles";

// Festival design system, aligned with the landing: only colors and typography.
// Palette: near-black base, gold (Turicine) as primary accent, red as secondary.
const gold = "#d6ac34";
const red = "#e50914";

const headingFont = '"Oswald", Impact, sans-serif';
const bodyFont = '"Outfit", "Segoe UI", system-ui, sans-serif';

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: gold, contrastText: "#1a1305" },
    secondary: { main: red, contrastText: "#ffffff" },
    background: { default: "#0b0d13", paper: "#12151d" },
    text: { primary: "#f7f7f7", secondary: "rgba(247,247,247,0.72)" },
    divider: "rgba(255,255,255,0.12)",
  },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: headingFont, fontWeight: 700 },
    h2: { fontFamily: headingFont, fontWeight: 700 },
    h3: { fontFamily: headingFont, fontWeight: 700 },
    h4: { fontFamily: headingFont, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" },
    h5: { fontFamily: headingFont, fontWeight: 600, letterSpacing: "0.02em" },
    h6: { fontFamily: headingFont, fontWeight: 600, letterSpacing: "0.02em" },
    button: { fontWeight: 600, letterSpacing: "0.02em" },
  },
  shape: { borderRadius: 8 },
});
