// components/Desktop.tsx
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Window from "./Window";
import Taskbar from "./Taskbar";
import { useTheme } from "../context/ThemeContext";
import portfolioData from "../data/portfolioData.json";

interface DesktopItem {
  id: string;
  title: string;
  icon: string;
  type: string;
  heading?: string;
  body?: string;
}

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  preMaximize?: { x: number; y: number; width: number; height: number };
}

export default function Desktop() {
  const { theme } = useTheme();
  const desktopItems: DesktopItem[] = portfolioData as DesktopItem[];

  // Track open windows array

  const [openWindows, setOpenWindows] = useState<DesktopItem[]>([
    // desktopItems[0],
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string>(
    desktopItems[0].id,
  );
  const [highestZIndex, setHighestZIndex] = useState<number>(10);

  // Track position and shape states for all windows centrally dictionary-style: { [id]: WindowState }
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>(
    {},
  );

  const openWindow = (item: DesktopItem) => {
    if (openWindows.some((w) => w.id === item.id)) {
      focusWindow(item.id);
      return;
    }

    const index = openWindows.length;

    setOpenWindows((prev) => [...prev, item]);

    setWindowStates((prev) => ({
      ...prev,
      [item.id]: {
        x: 60 + index * 30,
        y: 40 + index * 30,
        width: 340,
        height: 260,
        isMaximized: false,
      },
    }));

    focusWindow(item.id);
  };
  const closeWindow = (id: string) => {
    setOpenWindows(openWindows.filter((w) => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setHighestZIndex((prev) => prev + 1);
  };

  // Window Manager Handlers passed down to Window components
  const updateWindowState = (id: string, newState: Partial<WindowState>) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...newState },
    }));
  };

  const renderWindowContent = (item: DesktopItem) => {
    const textColor = theme.textMain;
    const mutedColor = theme.textMuted;

    return (
      <View>
        <Text style={[styles.textBold, { color: textColor }]}>
          {item.heading}
        </Text>
        {item.body?.split("\n").map((paragraph, idx) => (
          <Text key={idx} style={[styles.textRegular, { color: mutedColor }]}>
            {paragraph}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.desktop, { backgroundColor: theme.desktopBg }]}>
      {/* Desktop Grid Icons */}
      <View style={styles.grid}>
        {desktopItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.desktopIcon, { top: 20 + index * 80 }]}
            onPress={() => openWindow(item)}
          >
            <Text style={styles.iconSymbol}>{item.icon}</Text>
            <Text style={[styles.iconText, { color: theme.iconText }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render Active Open Windows using centralized desktop state */}
      {openWindows.map((win) => {
        const winState = windowStates[win.id] || {
          x: 0,
          y: 0,
          width: 400,
          height: 560,
          isMaximized: false,
        };
        return (
          <Window
            key={win.id}
            title={win.title}
            x={winState.x}
            y={winState.y}
            width={winState.width}
            height={winState.height}
            isMaximized={winState.isMaximized}
            zIndex={activeWindowId === win.id ? highestZIndex : 1}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => closeWindow(win.id)}
            onChangeState={(newState) => updateWindowState(win.id, newState)}
          >
            {renderWindowContent(win)}
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onToggleWindow={(id) => focusWindow(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  desktop: { flex: 1, position: "relative", overflow: "hidden" },
  grid: { position: "absolute", left: 10, top: 10, width: 100 },
  desktopIcon: {
    position: "absolute",
    alignItems: "center",
    width: 80,
    padding: 4,
  },
  iconSymbol: { fontSize: 28 },
  iconText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
    fontFamily: "monospace",
  },
  textBold: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 12,
    fontFamily: "monospace",
  },
  textRegular: { fontSize: 11, marginBottom: 6, fontFamily: "monospace" },
});
