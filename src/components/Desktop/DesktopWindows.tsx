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

  onChangeState: (id: string, updates: WindowStateUpdate) => void;
}

export default function DesktopWindows({
  windows,
  states,
  activeWindowId,
  onFocus,
  onClose,
  onMinimize,
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
            <WindowContent item={item} />
          </Window>
        );
      })}
    </>
  );
}
