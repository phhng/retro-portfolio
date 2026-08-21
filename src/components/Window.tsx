// components/Window.tsx
import React, { useEffect, useRef } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface WindowProps {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onChangeState: (state: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    isMaximized?: boolean;
  }) => void;
  children: React.ReactNode;
}

type ResizeDirection =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export default function Window({
  title,
  x,
  y,
  width,
  height,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onFocus,
  onChangeState,
  children,
}: WindowProps) {
  const { theme, isDarkMode } = useTheme();

  const liveGeometry = useRef({ x, y, width, height });
  liveGeometry.current = { x, y, width, height };

  const geometryRef = useRef({
    x,
    y,
    width,
    height,
  });

  useEffect(() => {
    geometryRef.current = {
      x,
      y,
      width,
      height,
    };
  }, [x, y, width, height]);

  const preMaximizeRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  // Store starting coordinates when grab begins
  const dragStartRef = useRef({
    pointerX: 0,
    pointerY: 0,
    x: 0,
    y: 0,
  });

  const dragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const g = geometryRef.current;

        dragStartRef.current = {
          pointerX: evt.nativeEvent.pageX,
          pointerY: evt.nativeEvent.pageY,
          x: g.x,
          y: g.y,
        };

        onFocus();
      },

      onPanResponderMove: (evt) => {
        const start = dragStartRef.current;

        onChangeState({
          x: start.x + (evt.nativeEvent.pageX - start.pointerX),

          y: start.y + (evt.nativeEvent.pageY - start.pointerY),
        });
      },
    }),
  ).current;

  // 2. Universal Resizing Engine
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const createResizeResponder = (direction: ResizeDirection) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        const g = geometryRef.current;

        resizeStartRef.current = {
          x: g.x,
          y: g.y,
          width: g.width,
          height: g.height,
        };

        onFocus();
      },

      onPanResponderMove: (_evt, gestureState) => {
        const { dx, dy } = gestureState;

        const start = resizeStartRef.current;

        let newX = start.x;
        let newY = start.y;
        let newWidth = start.width;
        let newHeight = start.height;

        switch (direction) {
          case "right":
            newWidth = Math.max(200, start.width + dx);
            break;

          case "bottom":
            newHeight = Math.max(150, start.height + dy);
            break;

          case "left":
            newWidth = Math.max(200, start.width - dx);
            newX = start.x + (start.width - newWidth);
            break;

          case "top":
            newHeight = Math.max(150, start.height - dy);
            newY = start.y + (start.height - newHeight);
            break;

          case "bottom-right":
            newWidth = Math.max(200, start.width + dx);
            newHeight = Math.max(150, start.height + dy);
            break;

          case "bottom-left":
            newWidth = Math.max(200, start.width - dx);
            newHeight = Math.max(150, start.height + dy);
            newX = start.x + (start.width - newWidth);
            break;

          case "top-right":
            newWidth = Math.max(200, start.width + dx);
            newHeight = Math.max(150, start.height - dy);
            newY = start.y + (start.height - newHeight);
            break;

          case "top-left":
            newWidth = Math.max(200, start.width - dx);
            newHeight = Math.max(150, start.height - dy);
            newX = start.x + (start.width - newWidth);
            newY = start.y + (start.height - newHeight);
            break;
        }

        onChangeState({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      },
      onPanResponderRelease: () => {},
    });
  };
  const toggleMaximize = () => {
    if (isMaximized && preMaximizeRef.current) {
      onChangeState({
        isMaximized: false,
        x: preMaximizeRef.current.x,
        y: preMaximizeRef.current.y,
        width: preMaximizeRef.current.width,
        height: preMaximizeRef.current.height,
      });
    } else {
      preMaximizeRef.current = { x, y, width, height };
      onChangeState({
        isMaximized: true,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 40,
      });
    }
  };
  const topResizeResponder = useRef(createResizeResponder("top")).current;

  const bottomResizeResponder = useRef(createResizeResponder("bottom")).current;

  const leftResizeResponder = useRef(createResizeResponder("left")).current;

  const rightResizeResponder = useRef(createResizeResponder("right")).current;

  const topLeftResizeResponder = useRef(
    createResizeResponder("top-left"),
  ).current;

  const topRightResizeResponder = useRef(
    createResizeResponder("top-right"),
  ).current;

  const bottomLeftResizeResponder = useRef(
    createResizeResponder("bottom-left"),
  ).current;

  const bottomRightResizeResponder = useRef(
    createResizeResponder("bottom-right"),
  ).current;

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
          : { left: x, top: y, width: width, height: height },
      ]}
    >
      {/* Title Bar */}
      <View
        {...dragResponder.panHandlers}
        style={[styles.titleBar, { backgroundColor: theme.titleBarActive }]}
      >
        <Text style={[styles.titleText, { color: theme.titleText }]}>
          {title}
        </Text>
        <View style={styles.titleButtons}>
          <TouchableOpacity
            style={[
              styles.winButton,
              {
                backgroundColor: theme.windowBg,
                borderColor: theme.windowBorderLight,
                borderRightColor: theme.windowBorderDark,
                borderBottomColor: theme.windowBorderDark,
              },
            ]}
            onPress={onMinimize}
          >
            <Text style={[styles.buttonSymbol, { color: theme.textMain }]}>
              _
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.winButton,
              {
                backgroundColor: theme.windowBg,
                borderColor: theme.windowBorderLight,
                borderRightColor: theme.windowBorderDark,
                borderBottomColor: theme.windowBorderDark,
              },
            ]}
            onPress={toggleMaximize}
          >
            <Text style={[styles.buttonSymbol, { color: theme.textMain }]}>
              {isMaximized ? "🗗" : "□"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.winButton,
              styles.closeButton,
              {
                backgroundColor: theme.windowBg,
                borderColor: theme.windowBorderLight,
                borderRightColor: theme.windowBorderDark,
                borderBottomColor: theme.windowBorderDark,
              },
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.buttonSymbol,
                styles.closeSymbol,
                { color: theme.textMain },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbar */}
      <View
        style={[styles.toolbar, { borderBottomColor: theme.windowBorderDark }]}
      >
        <Text style={[styles.toolbarText, { color: theme.textMain }]}>
          File
        </Text>
        <Text style={[styles.toolbarText, { color: theme.textMain }]}>
          Edit
        </Text>
        <Text style={[styles.toolbarText, { color: theme.textMain }]}>
          View
        </Text>
      </View>

      {/* Content Area */}
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

      {/* Resize Handles */}
      {!isMaximized && (
        <>
          <View
            {...topResizeResponder.panHandlers}
            style={[styles.edgeHandle, styles.topEdge]}
          />

          <View
            {...bottomResizeResponder.panHandlers}
            style={[styles.edgeHandle, styles.bottomEdge]}
          />

          <View
            {...leftResizeResponder.panHandlers}
            style={[styles.edgeHandle, styles.leftEdge]}
          />

          <View
            {...rightResizeResponder.panHandlers}
            style={[styles.edgeHandle, styles.rightEdge]}
          />

          <View
            {...topLeftResizeResponder.panHandlers}
            style={[styles.cornerHandle, styles.topLeftCorner]}
          />

          <View
            {...topRightResizeResponder.panHandlers}
            style={[styles.cornerHandle, styles.topRightCorner]}
          />

          <View
            {...bottomLeftResizeResponder.panHandlers}
            style={[styles.cornerHandle, styles.bottomLeftCorner]}
          />

          <View
            {...bottomRightResizeResponder.panHandlers}
            style={[styles.cornerHandle, styles.bottomRightCorner]}
          >
            <Text style={styles.resizeHandleSymbol}>◢</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    position: "relative",
    borderWidth: 2,
    // @ts-ignore
    userSelect: "none",
    // WebkitUserSelect: "none",
  },
  maximizedWindow: {
    position: "absolute",
    left: 0,
    top: 0,
    borderWidth: 0,
    width: "100%",
    height: "100%",
  },
  titleBar: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: { fontWeight: "bold", fontSize: 12, fontFamily: "monospace" },
  titleButtons: { flexDirection: "row", alignItems: "center" },
  winButton: {
    width: 16,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
    borderWidth: 1,
  },
  closeButton: { marginLeft: 4 },
  buttonSymbol: { fontSize: 9, fontWeight: "bold", lineHeight: 10 },
  closeSymbol: { fontSize: 8 },
  toolbar: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomWidth: 1,
  },
  toolbarText: { fontSize: 11, marginRight: 10 },
  body: {
    flex: 1,
    margin: 2,
    borderWidth: 1,
    padding: 10,
    overflow: "scroll",
    // @ts-ignore
    userSelect: "text",
    // WebkitUserSelect: "text",
  },
  edgeHandle: { position: "absolute", zIndex: 10 },
  topEdge: {
    top: -6,
    left: 6,
    right: 6,
    height: 12,
    cursor: "ns-resize",
  } as any,
  bottomEdge: {
    bottom: -6,
    left: 6,
    right: 6,
    height: 12,
    cursor: "ns-resize",
  } as any,
  leftEdge: {
    top: 6,
    bottom: 6,
    left: -6,
    width: 12,
    cursor: "ew-resize",
  } as any,
  rightEdge: {
    top: 6,
    bottom: 6,
    right: -6,
    width: 12,
    cursor: "ew-resize",
  } as any,
  cornerHandle: { position: "absolute", zIndex: 11 },
  topLeftCorner: {
    top: -6,
    left: -6,
    width: 16,
    height: 16,
    cursor: "nwse-resize",
  } as any,
  topRightCorner: {
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    cursor: "nesw-resize",
  } as any,
  bottomLeftCorner: {
    bottom: -6,
    left: -6,
    width: 16,
    height: 16,
    cursor: "nesw-resize",
  } as any,
  bottomRightCorner: {
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    cursor: "nwse-resize",
  } as any,
  resizeHandleSymbol: { fontSize: 10, color: "#808080", fontWeight: "bold" },
});
