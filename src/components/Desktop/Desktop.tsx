import { useEffect, useState } from "react";
import { ImageBackground, Platform, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { games } from "../../data/games";
import type { GalleryImage } from "../../data/portfolio";
import { getGalleryImageUri } from "../../data/portfolio";
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

  useEffect(() => {
    if (!isStartMenuOpen || Platform.OS !== "web") return;

    const closeMenuOnOutsideInteraction = (event: Event) => {
      const menu = document.getElementById("start-menu");
      if (!(event.target instanceof Element) || !menu) return;
      if (
        menu.contains(event.target) ||
        event.target.closest('[data-testid="start-button"]')
      ) return;
      setIsStartMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeMenuOnOutsideInteraction);
    document.addEventListener("focusin", closeMenuOnOutsideInteraction);
    return () => {
      document.removeEventListener("pointerdown", closeMenuOnOutsideInteraction);
      document.removeEventListener("focusin", closeMenuOnOutsideInteraction);
    };
  }, [isStartMenuOpen]);

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

  const openGalleryImage = (image: GalleryImage) => {
    openWindow({
      id: `gallery-image-${image.id}`,
      title: image.title,
      icon: "🖼️",
      type: "image-viewer",
      imageUri: getGalleryImageUri(image),
    });
  };

  const desktopContents = (
    <>
      <View
        onTouchStart={
          Platform.OS === "web" || !isStartMenuOpen
            ? undefined
            : () => setIsStartMenuOpen(false)
        }
        style={styles.desktopInteractionLayer}
      >
        <DesktopIcons items={portfolioData} onOpen={openWindow} />

        <DesktopWindows
          windows={openWindows}
          states={windowStates}
          activeWindowId={activeWindowId}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={toggleMinimize}
          onOpenImage={openGalleryImage}
          onChangeState={updateWindowState}
        />
      </View>

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
