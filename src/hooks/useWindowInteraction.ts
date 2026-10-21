import { useEffect, useRef } from "react";
import { PanResponder, Platform, PointerEvent as NativePointerEvent } from "react-native";

import {
  ResizeDirection,
  WindowGeometry,
} from "../components/Window/Window.types";

interface UseWindowInteractionProps extends WindowGeometry {
  isMaximized: boolean;

  onFocus: () => void;
  onChangeState: (updates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    isMaximized?: boolean;
  }) => void;
}

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

export function useWindowInteraction({
  x,
  y,
  width,
  height,
  isMaximized,
  onFocus,
  onChangeState,
}: UseWindowInteractionProps) {
  const geometryRef = useRef<WindowGeometry>({
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

  const onFocusRef = useRef(onFocus);
  const onChangeStateRef = useRef(onChangeState);

  useEffect(() => {
    geometryRef.current = {
      x,
      y,
      width,
      height,
    };

    onFocusRef.current = onFocus;
    onChangeStateRef.current = onChangeState;
  }, [x, y, width, height, onFocus, onChangeState]);

  const preMaximizeRef = useRef<WindowGeometry | null>(null);

  const dragStartRef = useRef({
    pointerX: 0,
    pointerY: 0,
    x: 0,
    y: 0,
  });

  const pointerDragStartRef = useRef<{
    pointerId: number;
    pointerX: number;
    pointerY: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onPointerMove = (event: globalThis.PointerEvent) => {
      const start = pointerDragStartRef.current;
      if (!start || event.pointerId !== start.pointerId) return;

      onChangeStateRef.current({
        x: start.x + event.pageX - start.pointerX,
        y: start.y + event.pageY - start.pointerY,
      });
    };
    const onPointerUp = (event: globalThis.PointerEvent) => {
      if (pointerDragStartRef.current?.pointerId === event.pointerId) {
        pointerDragStartRef.current = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const onPointerDown = (event: NativePointerEvent) => {
    const { pointerType, button, pointerId, pageX, pageY } = event.nativeEvent;
    if (Platform.OS !== "web" || pointerType !== "mouse" || button !== 0) {
      return;
    }

    event.preventDefault();
    const geometry = geometryRef.current;
    pointerDragStartRef.current = {
      pointerId,
      pointerX: pageX,
      pointerY: pageY,
      x: geometry.x,
      y: geometry.y,
    };
    onFocusRef.current();
  };

  const dragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: (event) => {
        const geometry = geometryRef.current;

        dragStartRef.current = {
          pointerX: event.nativeEvent.pageX,
          pointerY: event.nativeEvent.pageY,
          x: geometry.x,
          y: geometry.y,
        };

        onFocusRef.current();
      },

      onPanResponderMove: (event) => {
        const start = dragStartRef.current;

        onChangeStateRef.current({
          x: start.x + (event.nativeEvent.pageX - start.pointerX),

          y: start.y + (event.nativeEvent.pageY - start.pointerY),
        });
      },
    }),
  ).current;

  const resizeStartRef = useRef<WindowGeometry>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const createResizeResponder = (direction: ResizeDirection) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        const geometry = geometryRef.current;

        resizeStartRef.current = {
          ...geometry,
        };

        onFocusRef.current();
      },

      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;

        const start = resizeStartRef.current;

        let newX = start.x;
        let newY = start.y;
        let newWidth = start.width;
        let newHeight = start.height;

        if (direction.includes("right")) {
          newWidth = Math.max(MIN_WIDTH, start.width + dx);
        }

        if (direction.includes("left")) {
          newWidth = Math.max(MIN_WIDTH, start.width - dx);

          newX = start.x + (start.width - newWidth);
        }

        if (direction.includes("bottom")) {
          newHeight = Math.max(MIN_HEIGHT, start.height + dy);
        }

        if (direction.includes("top")) {
          newHeight = Math.max(MIN_HEIGHT, start.height - dy);

          newY = start.y + (start.height - newHeight);
        }

        onChangeStateRef.current({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      },
      onPanResponderRelease: () => {},
    });
  };

  const resizeResponders = {
    top: useRef(createResizeResponder("top")).current,

    bottom: useRef(createResizeResponder("bottom")).current,

    left: useRef(createResizeResponder("left")).current,

    right: useRef(createResizeResponder("right")).current,

    topLeft: useRef(createResizeResponder("top-left")).current,

    topRight: useRef(createResizeResponder("top-right")).current,

    bottomLeft: useRef(createResizeResponder("bottom-left")).current,

    bottomRight: useRef(createResizeResponder("bottom-right")).current,
  };

  const toggleMaximize = () => {
    if (isMaximized && preMaximizeRef.current) {
      const previous = preMaximizeRef.current;

      onChangeState({
        isMaximized: false,
        x: previous.x,
        y: previous.y,
        width: previous.width,
        height: previous.height,
      });

      return;
    }

    preMaximizeRef.current = {
      x,
      y,
      width,
      height,
    };

    onChangeState({
      isMaximized: true,
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight - 40,
    });
  };

  return {
    dragResponder,
    pointerDragHandlers: { onPointerDown },
    resizeResponders,
    toggleMaximize,
  };
}
