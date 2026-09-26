import { useState } from "react";
import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import portfolioData from "../../data/portfolioData.json";
import { useWindowManager } from "../../hooks/useWindowManager";
import StartMenu from "../StartMenu/StartMenu";
import Taskbar from "../Taskbar/Taskbar";
import { styles } from "./Desktop.styles";
import DesktopIcons from "./DesktopIcons";
import DesktopWindows from "./DesktopWindows";

export default function Desktop() {
  const { theme } = useTheme();

  const {
    openWindows,
    windowStates,
    activeWindowId,
    openWindow,
    closeWindow,
    focusWindow,
    focusTaskbar,
    toggleMinimize,
    updateWindowState,
  } = useWindowManager(portfolioData);

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  return (
    <View style={[styles.desktop, { backgroundColor: theme.desktopBg }]}>
      <DesktopIcons items={portfolioData} onOpen={openWindow} />

      <DesktopWindows
        windows={openWindows}
        states={windowStates}
        activeWindowId={activeWindowId}
        onFocus={focusWindow}
        onClose={closeWindow}
        onMinimize={toggleMinimize}
        onChangeState={updateWindowState}
      />

      {isStartMenuOpen && <StartMenu />}

      <Taskbar
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onToggleWindow={focusTaskbar}
        onStartPress={() => setIsStartMenuOpen((prev) => !prev)}
      />
    </View>
  );
}
