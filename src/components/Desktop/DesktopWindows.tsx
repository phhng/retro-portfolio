import type { GalleryImage } from "../../data/portfolio";
import {
  DesktopItem,
  WindowState,
  WindowStateUpdate,
} from "../../hooks/useWindowManager";
import Window from "../Window/Window";
import WindowContent from "../Window/WindowContent";

interface DesktopWindowsProps {
  windows: DesktopItem[];
  states: Record<string, WindowState>;

  activeWindowId: string | null;

  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onOpenImage: (image: GalleryImage) => void;

  onChangeState: (id: string, updates: WindowStateUpdate) => void;
}

export default function DesktopWindows({
  windows,
  states,
  activeWindowId,
  onFocus,
  onClose,
  onMinimize,
  onOpenImage,
  onChangeState,
}: DesktopWindowsProps) {
  return (
    <>
      {windows.map((item) => {
        const state = states[item.id];
        if (!state) {
          return null;
        }

        return (
          <Window
            key={item.id}
            title={item.title}
            toolbarEnabled={
              item.enable ?? /\.(txt|md)$/i.test(item.title.trim())
            }
            allowTextSelection={
              /\.(txt|md|html)$/i.test(item.title.trim()) ||
              item.type === "text-editor" ||
              item.id === "text-editor"
            }
            x={state.x}
            y={state.y}
            width={state.width}
            height={state.height}
            zIndex={state.zIndex}
            isMaximized={state.isMaximized}
            isMinimized={state.isMinimized}
            isActive={activeWindowId === item.id}
            onFocus={() => onFocus(item.id)}
            onClose={() => onClose(item.id)}
            onMinimize={() => onMinimize(item.id)}
            onChangeState={(updates) => onChangeState(item.id, updates)}
          >
            <WindowContent item={item} onOpenImage={onOpenImage} />
          </Window>
        );
      })}
    </>
  );
}
