import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  desktop: {
    flex: 1,
    position: "relative",
  },

  desktopGrid: {
    flex: 1,
    padding: 16,
  },

  startMenuDismissLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9997,
  },
});