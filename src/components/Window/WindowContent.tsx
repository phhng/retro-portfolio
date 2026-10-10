// components/Window/WindowContent.tsx

import { useTheme } from "@/context/ThemeContext";
import { Text, View } from "react-native";
import { DesktopItem } from "../../hooks/useWindowManager";
import { styles } from "../Desktop/DesktopIcons.styles";
import AccountWindow from "../Account/AccountWindow";
import { games } from "../../data/games";

interface WindowContentProps {
  item: DesktopItem;
}
export default function WindowContent({ item }: WindowContentProps) {
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
