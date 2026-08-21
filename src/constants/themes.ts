// constants/theme.ts
export interface ThemeColors {
  desktopBg: string;
  windowBg: string;
  titleBarActive: string;
  titleBarInactive: string;
  titleText: string;
  windowBorderLight: string;
  windowBorderDark: string;
  taskbarBg: string;
  textMain: string;
  textMuted: string;
  iconText: string;
}

export const lightTheme: ThemeColors = {
  desktopBg: '#008080',       // Classic Win95 Teal
  windowBg: '#c0c0c0',        // Win95 Grey
  titleBarActive: '#000080',  // Navy Blue
  titleBarInactive: '#808080',// Gray
  titleText: '#ffffff',
  windowBorderLight: '#dfdfdf',
  windowBorderDark: '#404040',
  taskbarBg: '#c0c0c0',
  textMain: '#000000',
  textMuted: '#333333',
  iconText: '#ffffff',
};

export const darkTheme: ThemeColors = {
  desktopBg: '#051c1c',       // Deep Dark Teal
  windowBg: '#1e1e1e',        // Dark Charcoal
  titleBarActive: '#2d2d2d',  // Dark Slate
  titleBarInactive: '#111111',
  titleText: '#00ffcc',       // Terminal Cyan
  windowBorderLight: '#444444',
  windowBorderDark: '#000000',
  taskbarBg: '#121212',
  textMain: '#00ffcc',
  textMuted: '#aaaaaa',
  iconText: '#00ffcc',
};