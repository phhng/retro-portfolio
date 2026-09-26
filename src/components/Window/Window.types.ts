import { WindowStateUpdate } from "@/hooks/useWindowManager";

export interface WindowProps {
  title: string;

  x: number;
  y: number;
  width: number;
  height: number;

  zIndex: number;

  isActive: boolean;
  isMaximized: boolean;
  isMinimized: boolean;

  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;

  onChangeState: (updates: WindowStateUpdate) => void;

  children: React.ReactNode;
}

export type ResizeDirection =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}