import { useState } from "react";
import { useWindowDimensions } from "react-native";

export interface DesktopItem {
  id: string;
  title: string;
  icon: string;
  type: string;
  heading?: string;
  body?: string;
  imageUri?: string;
  enable?: boolean;
}

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMaximized: boolean;
  isMinimized: boolean;
}

export type WindowStateUpdate = Partial<
  Pick<
    WindowState,
    "x" | "y" | "width" | "height" | "isMaximized" | "isMinimized"
  >
>;

const WINDOW_WIDTH = 340;
const WINDOW_HEIGHT = 260;
const GAME_WINDOW_WIDTH = 440;
const GAME_WINDOW_HEIGHT = 540;
const IMAGE_WINDOW_WIDTH = 640;
const IMAGE_WINDOW_HEIGHT = 500;
const WINDOW_OFFSET = 30;

export function useWindowManager(items: DesktopItem[]) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [openWindows, setOpenWindows] = useState<DesktopItem[]>([]);
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>(
    {},
  );
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(10);

  const openWindow = (item: DesktopItem) => {
    const existingWindow = openWindows.find((window) => window.id === item.id);

    if (existingWindow) {
      focusWindow(item.id);
      return;
    }

    const index = openWindows.length;

    const isGame = item.type === "game";
    const isImageViewer = item.type === "image-viewer";
    const preferredWidth = isGame
      ? GAME_WINDOW_WIDTH
      : isImageViewer
        ? IMAGE_WINDOW_WIDTH
        : WINDOW_WIDTH;
    const preferredHeight = isGame
      ? GAME_WINDOW_HEIGHT
      : isImageViewer
        ? IMAGE_WINDOW_HEIGHT
        : WINDOW_HEIGHT;
    const width = Math.min(preferredWidth, screenWidth - 16);
    const height = Math.min(preferredHeight, screenHeight - 54);
    const centerX = Math.max(8, (screenWidth - width) / 2);
    const centerY = Math.max(8, (screenHeight - height) / 2);

    const newZIndex = highestZIndex + 1;
    const existingState = windowStates[item.id];

    setOpenWindows((prev) => [...prev, item]);

    setWindowStates((prev) => ({
      ...prev,
      [item.id]: existingState
        ? {
            ...existingState,
            zIndex: newZIndex,
            isMinimized: false,
          }
        : {
            x: centerX + index * WINDOW_OFFSET,
            y: centerY + index * WINDOW_OFFSET,
            width,
            height,
            zIndex: newZIndex,
            isMaximized: false,
            isMinimized: false,
          },
    }));

    setHighestZIndex(newZIndex);
    setActiveWindowId(item.id);
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));

    setActiveWindowId((prev) => (prev === id ? null : prev));
  };

  const focusWindow = (id: string) => {
    const newZIndex = highestZIndex + 1;

    setWindowStates((prev) => {
      if (!prev[id]) return prev;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          zIndex: newZIndex,
          isMinimized: false,
        },
      };
    });

    setHighestZIndex(newZIndex);
    setActiveWindowId(id);
  };

  const focusTaskbar = (id: string) => {
    const state = windowStates[id];

    if (!state) return;

    if (state.isMinimized) {
      focusWindow(id);
      return;
    }

    if (activeWindowId === id) {
      setWindowStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: true,
        },
      }));
      return;
    }

    focusWindow(id);
  };

  const toggleMinimize = (id: string) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: !prev[id].isMinimized,
      },
    }));
  };

  const updateWindowState = (id: string, updates: Partial<WindowState>) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }));
  };

  return {
    openWindows,
    windowStates,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    focusTaskbar,
    toggleMinimize,
    updateWindowState,
  };
}
