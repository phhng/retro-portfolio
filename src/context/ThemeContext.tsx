// context/ThemeContext.tsx

import React, { createContext, useContext, useState } from "react";
import { lightTheme, darkTheme, ThemeColors } from "@/constants/themes";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceTheme = localStorage.getItem('theme');

  const [themeMode, setThemeMode] = useState<ThemeMode>(
    deviceTheme === "dark" ? "dark" : "light"
  );
  const isDarkMode = themeMode === "dark";

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  localStorage.setItem('theme',themeMode)

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);