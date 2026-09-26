import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  window: {
    position: "absolute",
    borderWidth: 2,

    // Web only
    // @ts-ignore
    userSelect: "none",
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

  titleText: {
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "monospace",
  },

  titleButtons: {
    flexDirection: "row",
    alignItems: "center",
  },

  winButton: {
    width: 16,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
    borderWidth: 1,
  },

  closeButton: {
    marginLeft: 4,
  },

  buttonSymbol: {
    fontSize: 9,
    fontWeight: "bold",
    lineHeight: 10,
  },

  closeSymbol: {
    fontSize: 8,
  },

  toolbar: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomWidth: 1,
  },

  toolbarText: {
    fontSize: 11,
    marginRight: 10,
  },

  body: {
    flex: 1,
    margin: 2,
    borderWidth: 1,
    padding: 10,
    overflow: "scroll",

    // Web only
    // @ts-ignore
    userSelect: "text",
  },

  edgeHandle: {
    position: "absolute",
    zIndex: 10,
  },

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

  cornerHandle: {
    position: "absolute",
    zIndex: 11,
  },

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

  resizeHandleSymbol: {
    fontSize: 10,
    color: "#808080",
    fontWeight: "bold",
  },
});
