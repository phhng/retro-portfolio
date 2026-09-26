import { Text, View } from "react-native";

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
      <Text
        style={[
          styles.toolbarText,
          { color: textColor },
        ]}
      >
        File
      </Text>

      <Text
        style={[
          styles.toolbarText,
          { color: textColor },
        ]}
      >
        Edit
      </Text>

      <Text
        style={[
          styles.toolbarText,
          { color: textColor },
        ]}
      >
        View
      </Text>
    </View>
  );
}