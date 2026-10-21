import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function ImageViewerWindow({
  imageUri,
}: {
  imageUri: string;
}) {
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(zoom);
  const pan = useRef(new Animated.ValueXY()).current;

  const updateZoom = (nextZoom: number) => {
    const boundedZoom = Math.max(0.5, Math.min(4, nextZoom));
    zoomRef.current = boundedZoom;
    setZoom(boundedZoom);
    if (boundedZoom <= 1) {
      pan.setValue({ x: 0, y: 0 });
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => zoomRef.current > 1,
        onMoveShouldSetPanResponder: (_event, gesture) =>
          zoomRef.current > 1 &&
          (Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2),
        onPanResponderGrant: () => pan.extractOffset(),
        onPanResponderMove: (_event, gesture) =>
          pan.setValue({ x: gesture.dx, y: gesture.dy }),
        onPanResponderRelease: () => pan.flattenOffset(),
        onPanResponderTerminate: () => pan.flattenOffset(),
      }),
    [pan],
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <ZoomButton
          label="−"
          accessibilityLabel="Zoom out"
          disabled={zoom <= 0.5}
          onPress={() => updateZoom(zoom - 0.25)}
        />
        <Text style={[styles.zoomLabel, { color: theme.textMain }]}>
          {Math.round(zoom * 100)}%
        </Text>
        <ZoomButton
          label="+"
          accessibilityLabel="Zoom in"
          disabled={zoom >= 4}
          onPress={() => updateZoom(zoom + 0.25)}
        />
        <ZoomButton
          label="Reset"
          accessibilityLabel="Reset zoom"
          disabled={zoom === 1}
          onPress={() => updateZoom(1)}
        />
      </View>
      <View style={styles.imageViewport} {...panResponder.panHandlers}>
        <Animated.Image
          source={{ uri: imageUri }}
          resizeMode="contain"
          style={[
            styles.image,
            {
              transform: [
                { scale: zoom },
                { translateX: pan.x },
                { translateY: pan.y },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

function ZoomButton({
  label,
  accessibilityLabel,
  disabled,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, gap: 8 },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  zoomLabel: { minWidth: 42, fontSize: 11, textAlign: "center" },
  button: {
    minWidth: 30,
    minHeight: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#777",
    borderBottomColor: "#777",
  },
  buttonText: { color: "#111", fontSize: 12, fontWeight: "bold" },
  disabled: { opacity: 0.5 },
  imageViewport: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
  },
  image: { width: "100%", height: "100%", userSelect: "none" },
});
