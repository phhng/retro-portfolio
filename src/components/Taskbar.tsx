import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface WindowItem {
  id: string;
  title: string;
  type: string;
}

interface TaskbarProps {
  openWindows: WindowItem[];
  activeWindowId: string | null;
  onToggleWindow: (id: string) => void;
}

export default function Taskbar({
  openWindows,
  activeWindowId,
  onToggleWindow,
}: TaskbarProps) {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View
      style={[
        styles.taskbar,
        {
          backgroundColor: theme.taskbarBg,
          borderTopColor: theme.windowBorderLight,
        },
      ]}
    >
      {/* Start Button */}
      <TouchableOpacity
        style={[
          styles.startButton,
          {
            backgroundColor: theme.windowBg,
            borderColor: theme.windowBorderLight,
            borderRightColor: theme.windowBorderDark,
            borderBottomColor: theme.windowBorderDark,
          },
        ]}
      >
        <Text style={[styles.startText, { color: theme.textMain }]}>
          ❖ Start
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Tabs */}
      <View style={styles.windowTabs}>
        {openWindows.map((win) => {
          const isActive = activeWindowId === win.id;
          return (
            <TouchableOpacity
              key={win.id}
              style={[
                styles.taskTab,
                {
                  backgroundColor: theme.windowBg,
                  borderColor: theme.windowBorderLight,
                  borderRightColor: theme.windowBorderDark,
                  borderBottomColor: theme.windowBorderDark,
                },
                isActive && {
                  borderTopColor: theme.windowBorderDark,
                  borderLeftColor: theme.windowBorderDark,
                  borderRightColor: theme.windowBorderLight,
                  borderBottomColor: theme.windowBorderLight,
                  backgroundColor: isDarkMode ? "#222" : "#dfdfdf",
                },
              ]}
              onPress={() => onToggleWindow(win.id)}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.tabText,
                  { color: theme.textMain },
                  isActive && styles.activeTabText,
                ]}
              >
                {win.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Theme Toggle Button & Clock Tray */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={[
          styles.themeButton,
          {
            backgroundColor: theme.windowBg,
            borderColor: theme.windowBorderDark,
            borderTopColor: theme.windowBorderLight,
            borderLeftColor: theme.windowBorderLight,
          },
        ]}
      >
        <Text style={{ fontSize: 10, color: theme.textMain }}>
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.tray,
          {
            backgroundColor: theme.windowBg,
            borderTopColor: theme.windowBorderDark,
            borderLeftColor: theme.windowBorderDark,
            borderRightColor: theme.windowBorderLight,
            borderBottomColor: theme.windowBorderLight,
          },
        ]}
      >
        <Text style={[styles.trayText, { color: theme.textMain }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 38,
    borderTopWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 9999,
  },
  startButton: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 2,
    alignItems: "center",
  },
  startText: { fontWeight: "bold", fontSize: 12 },
  divider: {
    width: 2,
    height: 24,
    backgroundColor: "#808080",
    marginHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: "#fff",
  },
  windowTabs: { flex: 1, flexDirection: "row", overflow: "hidden" },
  taskTab: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 4,
    width: 120,
    borderWidth: 2,
  },
  tabText: { fontSize: 11 },
  activeTabText: { fontWeight: "bold" },
  themeButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 4,
    borderWidth: 1,
  },
  tray: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  trayText: { fontSize: 11 },
});
