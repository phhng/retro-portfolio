import { PanResponderInstance, View, Text } from "react-native";

import { styles } from "./Window.styles";

interface WindowResizeHandlesProps {
  responders: {
    top: PanResponderInstance;
    bottom: PanResponderInstance;
    left: PanResponderInstance;
    right: PanResponderInstance;
    topLeft: PanResponderInstance;
    topRight: PanResponderInstance;
    bottomLeft: PanResponderInstance;
    bottomRight: PanResponderInstance;
  };
}

export default function WindowResizeHandles({
  responders,
}: WindowResizeHandlesProps) {
  return (
    <>
      <View
        {...responders.top.panHandlers}
        style={[styles.edgeHandle, styles.topEdge]}
      />

      <View
        {...responders.bottom.panHandlers}
        style={[styles.edgeHandle, styles.bottomEdge]}
      />

      <View
        {...responders.left.panHandlers}
        style={[styles.edgeHandle, styles.leftEdge]}
      />

      <View
        {...responders.right.panHandlers}
        style={[styles.edgeHandle, styles.rightEdge]}
      />

      <View
        {...responders.topLeft.panHandlers}
        style={[styles.cornerHandle, styles.topLeftCorner]}
      />

      <View
        {...responders.topRight.panHandlers}
        style={[styles.cornerHandle, styles.topRightCorner]}
      />

      <View
        {...responders.bottomLeft.panHandlers}
        style={[styles.cornerHandle, styles.bottomLeftCorner]}
      />

      <View
        {...responders.bottomRight.panHandlers}
        style={[styles.cornerHandle, styles.bottomRightCorner]}
      >
        <Text style={styles.resizeHandleSymbol}>◢</Text>
      </View>
    </>
  );
}
