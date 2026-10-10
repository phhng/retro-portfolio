import { useState } from "react";
import { ImageBackground, Pressable, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { games } from "../../data/games";
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
  const { email } = useAuth();

  const openGame = (game: (typeof games)[number]) => {
    openWindow(game);
    setIsStartMenuOpen(false);
  };

  const openAccount = () => {
    openWindow({
      id: "account",
      title: "User Accounts",
      icon: "👤",
      type: "account",
    });
    setIsStartMenuOpen(false);
  };

  const desktopContents = (
    <>
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

      {isStartMenuOpen && (
        <Pressable
          accessibilityLabel="Close Start Menu"
          accessibilityRole="button"
          onPress={() => setIsStartMenuOpen(false)}
          style={styles.startMenuDismissLayer}
        />
      )}

      {isStartMenuOpen && (
        <StartMenu
          email={email}
          games={games}
          onOpenGame={openGame}
          onOpenAccount={openAccount}
        />
      )}

      <Taskbar
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onToggleWindow={focusTaskbar}
        onStartPress={() => setIsStartMenuOpen((prev) => !prev)}
      />
    </>
  );

  if (theme.desktopBackgroundImage) {
    return (
      <ImageBackground
        source={theme.desktopBackgroundImage}
        resizeMode="cover"
        style={[styles.desktop, { backgroundColor: theme.desktopBg}]}
        imageStyle={{ alignSelf: "center"}}
      >
        {desktopContents}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.desktop, { backgroundColor: theme.desktopBg }]}>
      {desktopContents}
    </View>
  );
}
