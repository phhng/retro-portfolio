import type { ImageSourcePropType } from "react-native";

// constants/theme.ts
export interface ThemeColors {
  desktopBg: string;
  desktopBackgroundImage: ImageSourcePropType | null;
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
  desktopBg: '#008080',       
  desktopBackgroundImage: require("../../assets/2198150_9.jpg"),
  windowBg: '#c0c0c0',
  titleBarActive: '#000080',
  titleBarInactive: '#808080',
  titleText: '#ffffff',
  windowBorderLight: '#dfdfdf',
  windowBorderDark: '#404040',
  taskbarBg: '#c0c0c0',
  textMain: '#000000',
  textMuted: '#333333',
  iconText: '#ffffff',
};

export const darkTheme: ThemeColors = {
  desktopBg: '#051c1c',
  desktopBackgroundImage: require("../../assets/2198150_9.jpg"),
  windowBg: '#1e1e1e',
  titleBarActive: '#2d2d2d',
  titleBarInactive: '#111111',
  titleText: '#00ffcc',
  windowBorderLight: '#444444',
  windowBorderDark: '#000000',
  taskbarBg: '#121212',
  textMain: '#00ffcc',
  textMuted: '#aaaaaa',
  iconText: '#00ffcc',
};