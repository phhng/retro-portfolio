import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./Window.styles";

interface WindowTitleBarProps {
  title: string;
  isMaximized: boolean;

  backgroundColor: string;
  titleColor: string;
  buttonBackground: string;
  buttonBorderLight: string;
  buttonBorderDark: string;
  textColor: string;

  dragHandlers: any;

  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export default function WindowTitleBar({
  title,
  isMaximized,
  backgroundColor,
  titleColor,
  buttonBackground,
  buttonBorderLight,
  buttonBorderDark,
  textColor,
  dragHandlers,
  onMinimize,
  onMaximize,
  onClose,
}: WindowTitleBarProps) {
  const buttonStyle = {
    backgroundColor: buttonBackground,
    borderColor: buttonBorderLight,
    borderRightColor: buttonBorderDark,
    borderBottomColor: buttonBorderDark,
  };

  return (
    <View
      {...dragHandlers}
      style={[
        styles.titleBar,
        { backgroundColor },
      ]}
    >
      <Text
        style={[
          styles.titleText,
          { color: titleColor },
        ]}
      >
        {title}
      </Text>

      <View style={styles.titleButtons}>
        <TouchableOpacity
          style={[styles.winButton, buttonStyle]}
          onPress={onMinimize}
        >
          <Text
            style={[
              styles.buttonSymbol,
              { color: textColor },
            ]}
          >
            _
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.winButton, buttonStyle]}
          onPress={onMaximize}
        >
          <Text
            style={[
              styles.buttonSymbol,
              { color: textColor },
            ]}
          >
            {isMaximized ? "🗗" : "□"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.winButton,
            styles.closeButton,
            buttonStyle,
          ]}
          onPress={onClose}
        >
          <Text
            style={[
              styles.buttonSymbol,
              styles.closeSymbol,
              { color: textColor },
            ]}
          >
            ✕
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}