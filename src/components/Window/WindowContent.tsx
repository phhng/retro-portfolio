// components/Window/WindowContent.tsx

import { useTheme } from "@/context/ThemeContext";
import { Text, View } from "react-native";
import { DesktopItem } from "../../hooks/useWindowManager";
import { styles } from "../Desktop/DesktopIcons.styles";

interface WindowContentProps {
  item: DesktopItem;
}
export default function WindowContent({ item }: WindowContentProps) {
  const { theme } = useTheme();
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

{
  /* 
  export default function WindowContent({
  item,
}: WindowContentProps) {
  switch (item.type) {
    case "about":
      return (
        <View>
          <Text>{item.heading}</Text>
          <Text>{item.body}</Text>
        </View>
      );

    case "projects":
      return (
        <View>
          <Text>Projects</Text>
          <Text>{item.body}</Text>
        </View>
      );

    case "contact":
      return (
        <View>
          <Text>Contact</Text>
          <Text>{item.body}</Text>
        </View>
      );

    default:
      return (
        <View>
          <Text>{item.heading}</Text>
          <Text>{item.body}</Text>
        </View>
      );
  }
}
  */
}
