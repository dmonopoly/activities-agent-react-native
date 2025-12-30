// Base colors (static)
export const colors = {
  roseMain: "#FF385D",
  rose50: "#FFF1F2",
  rose100: "#FFE4E6",
  rose200: "#FECDD3",
  rose300: "#FDA4AF",
  rose500: "#F43F5E",
  rose600: "#E11D48",
  rose700: "#BE123C",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  red50: "#FEF2F2",
  red500: "#EF4444",
  red600: "#DC2626",
  green500: "#22C55E",
  green600: "#16A34A",
  white: "#FFFFFF",
  black: "#000000",
};

// Theme-aware color palettes
export const lightTheme = {
  // Backgrounds
  background: colors.white,
  backgroundSecondary: colors.gray50,
  card: colors.white,

  // Text
  text: colors.gray900,
  textSecondary: colors.gray600,
  textMuted: colors.gray400,

  // Borders
  border: colors.gray200,
  borderSecondary: colors.gray300,

  // Primary (rose)
  primary: colors.roseMain,
  primaryLight: colors.rose50,
  primaryBorder: colors.rose200,

  // Input
  inputBackground: colors.gray50,
  inputBorder: colors.gray200,
  inputText: colors.gray900,
  inputPlaceholder: colors.gray400,

  // Message bubbles
  userBubble: colors.rose500,
  userBubbleText: colors.white,
  assistantBubble: colors.gray100,
  assistantBubbleText: colors.gray900,

  // Header
  headerBackground: colors.white,
  headerText: colors.gray900,
  headerBorder: colors.gray200,
};

export const darkTheme = {
  // Backgrounds
  background: colors.gray900,
  backgroundSecondary: colors.gray800,
  card: colors.gray800,

  // Text
  text: "#EDEDED",
  textSecondary: colors.gray400,
  textMuted: colors.gray500,

  // Borders
  border: colors.gray700,
  borderSecondary: colors.gray600,

  // Primary (rose)
  primary: colors.roseMain,
  primaryLight: "rgba(244, 63, 94, 0.2)", // rose with opacity
  primaryBorder: colors.rose700,

  // Input
  inputBackground: colors.gray800,
  inputBorder: colors.gray600,
  inputText: "#EDEDED",
  inputPlaceholder: colors.gray500,

  // Message bubbles
  userBubble: colors.rose500,
  userBubbleText: colors.white,
  assistantBubble: colors.gray800,
  assistantBubbleText: "#EDEDED",

  // Header
  headerBackground: colors.gray900,
  headerText: "#EDEDED",
  headerBorder: colors.gray700,
};

export type ThemeColors = typeof lightTheme;
