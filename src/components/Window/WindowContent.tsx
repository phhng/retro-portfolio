// components/Window/WindowContent.tsx

import { useTheme } from "@/context/ThemeContext";
import { Text, View } from "react-native";
import { games } from "../../data/games";
import type { GalleryImage } from "../../data/portfolio";
import { DesktopItem } from "../../hooks/useWindowManager";
import AccountWindow from "../Account/AccountWindow";
import { styles } from "../Desktop/DesktopIcons.styles";
import GalleryWindow from "../Gallery/GalleryWindow";
import ImageViewerWindow from "../Gallery/ImageViewerWindow";

interface WindowContentProps {
  item: DesktopItem;
  onOpenImage: (image: GalleryImage) => void;
}
export default function WindowContent({
  item,
  onOpenImage,
}: WindowContentProps) {
  const { theme } = useTheme();

  if (item.type === "game") {
    const game = games.find((registeredGame) => registeredGame.id === item.id);
    if (game) {
      const GameComponent = game.component;
      return <GameComponent />;
    }
  }

  if (item.type === "account") {
    return <AccountWindow />;
  }

  if (item.id === "gallery" || item.type.toLowerCase() === "gallery") {
    return <GalleryWindow onOpenImage={onOpenImage} />;
  }

  if (item.type === "image-viewer") {
    return item.imageUri ? (
      <ImageViewerWindow imageUri={item.imageUri} />
    ) : (
      <Text style={[styles.textRegular, { color: theme.textMuted }]}>
        This image could not be loaded.
      </Text>
    );
  }

  return (
    <View>
      {item.heading && (
        <Text style={[styles.textBold, { color: theme.textMain }]}>
          {item.heading}
        </Text>
      )}

      {item.body?.split("\n").map((paragraph, idx) => (
        <Text
          key={idx}
          style={[styles.textRegular, { color: theme.textMuted }]}
        >
          {paragraph}
        </Text>
      ))}
    </View>
  );
}
