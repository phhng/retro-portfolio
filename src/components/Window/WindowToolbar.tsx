import { Pressable, Text, View } from "react-native";

import { styles } from "./Window.styles";

interface WindowToolbarProps {
  textColor: string;
  borderColor: string;
}

export default function WindowToolbar({
  textColor,
  borderColor,
}: WindowToolbarProps) {
  return (
    <View
      style={[
        styles.toolbar,
        { borderBottomColor: borderColor },
      ]}
    >
      {["File", "Edit", "View"].map((label) => (
        <Pressable
          key={label}
          accessibilityRole="button"
          accessibilityLabel={`${label} toolbar menu`}
          onPress={() => {}}
          style={({ pressed }) => [
            styles.toolbarButton,
            pressed && styles.toolbarButtonPressed,
          ]}
        >
          <Text style={[styles.toolbarText, { color: textColor }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}