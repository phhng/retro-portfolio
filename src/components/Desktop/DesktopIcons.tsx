import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./DesktopIcons.styles"
import { DesktopItem } from "../../hooks/useWindowManager";
import { useTheme } from "@/context/ThemeContext";

interface DesktopIconsProps {
  items: DesktopItem[];
  onOpen: (item: DesktopItem) => void;
}

export default function DesktopIcons({
  items,
  onOpen,
}: DesktopIconsProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.iconItem }
          onPress={() => onOpen(item)}
        >
          {/* <Image
            source={{ uri: item.icon }}
            style={styles.icon}
          /> */}
          <Text style={styles.iconSymbol}>{item.icon}</Text>
          <Text style={[styles.iconText, { color: theme.iconText }]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}