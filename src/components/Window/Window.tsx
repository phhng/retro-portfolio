import { View } from "react-native";

import { useTheme } from "../../context/ThemeContext";

import { styles } from "./Window.styles";
import { WindowProps } from "./Window.types";

import { useWindowInteraction } from "../../hooks/useWindowInteraction";

import WindowResizeHandles from "./WindowResizeHandles";
import WindowTitleBar from "./WindowTitleBar";
import WindowToolbar from "./WindowToolbar";

export default function Window({
  title,
  x,
  y,
  width,
  height,
  zIndex,
  isActive,
  isMaximized,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  onChangeState,
  children
}: WindowProps) {
  const { theme, isDarkMode } = useTheme();

  const { dragResponder, resizeResponders, toggleMaximize } =
    useWindowInteraction({
      x,
      y,
      width,
      height,
      isMaximized,
      onFocus,
      onChangeState,
    });

  if (isMinimized) {
    return null;
  }

  const titleBarColor = isActive
    ? theme.titleBarActive
    : theme.titleBarInactive;

  return (
    <View
      onTouchStart={onFocus}
      style={[
        styles.window,
        {
          backgroundColor: theme.windowBg,
          borderColor: theme.windowBorderLight,
          borderRightColor: theme.windowBorderDark,
          borderBottomColor: theme.windowBorderDark,
          zIndex,
        },

        isMaximized
          ? styles.maximizedWindow
          : {
              left: x,
              top: y,
              width: width,
              height: height,
            },
      ]}
    >
      <WindowTitleBar
        title={title}
        isMaximized={isMaximized}
        backgroundColor={titleBarColor}
        titleColor={theme.titleText}
        buttonBackground={theme.windowBg}
        buttonBorderLight={theme.windowBorderLight}
        buttonBorderDark={theme.windowBorderDark}
        textColor={theme.textMain}
        dragHandlers={dragResponder.panHandlers}
        onMinimize={onMinimize}
        onMaximize={toggleMaximize}
        onClose={onClose}
      />

      <WindowToolbar
        textColor={theme.textMain}
        borderColor={theme.windowBorderDark}
      />

      <View
        style={[
          styles.body,
          {
            backgroundColor: isDarkMode ? "#121212" : "#ffffff",
            borderColor: theme.windowBorderDark,
            borderTopColor: theme.windowBorderLight,
            borderLeftColor: theme.windowBorderLight,
          },
        ]}
      >
        {children}
      </View>
      {!isMaximized && <WindowResizeHandles responders={resizeResponders} />}
    </View>
  );
}
