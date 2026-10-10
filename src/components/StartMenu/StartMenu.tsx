import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import type { GameDefinition } from "../../data/games";

interface StartMenuProps {
  email: string | null;
  games: GameDefinition[];
  onOpenGame: (game: GameDefinition) => void;
  onOpenAccount: () => void;
}

export default function StartMenu({
  email,
  games,
  onOpenGame,
  onOpenAccount,
}: StartMenuProps) {
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 480;
  const menuWidth = Math.min(isCompact ? Math.max(0, width - 8) : 300, 360);
  const menuMaxHeight = Math.max(130, height - 44);
  const itemsMaxHeight = Math.max(40, menuMaxHeight - 90);

  return (
    <View
      style={[
        styles.menu,
        {
          backgroundColor: theme.windowBg,
          borderColor: theme.windowBorderLight,
          borderRightColor: theme.windowBorderDark,
          borderBottomColor: theme.windowBorderDark,
          shadowColor: theme.windowBorderDark,
          width: menuWidth,
          maxHeight: menuMaxHeight,
        },
      ]}
    >
      <View
        style={[
          styles.banner,
          { backgroundColor: theme.titleBarActive },
          isCompact && styles.compactBanner,
        ]}
      >
        <Text style={styles.avatar}>🖥️</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={[styles.username, { color: theme.titleText }]}
        >
          {email ?? "Guest"}
        </Text>
      </View>
      <ScrollView
        style={[styles.itemsScroll, { maxHeight: itemsMaxHeight }]}
        contentContainerStyle={styles.items}
        showsVerticalScrollIndicator={!isCompact}
      >
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onOpenAccount}
          style={styles.accountItem}
        >
          <Text style={styles.accountIcon}>{email ? "🔐" : "👤"}</Text>
          <View>
            <Text style={[styles.gameTitle, { color: theme.textMain }]}>
              {email ? "Account settings" : "Sign in"}
            </Text>
            <Text style={[styles.gameSubtitle, { color: theme.textMuted }]}>
              {email ? "Manage your account" : "Save scores across games"}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={[
            styles.separator,
            { backgroundColor: theme.windowBorderDark },
          ]}
        />
        {games.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              Games
            </Text>
            {games.map((game) => (
              <TouchableOpacity
                key={game.id}
                accessibilityRole="button"
                onPress={() => onOpenGame(game)}
                style={styles.gameItem}
              >
                <Text style={styles.gameIcon}>{game.icon}</Text>
                <View style={styles.gameText}>
                  <Text
                    numberOfLines={1}
                    style={[styles.gameTitle, { color: theme.textMain }]}
                  >
                    {game.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.gameSubtitle, { color: theme.textMuted }]}
                  >
                    {game.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: theme.windowBorderDark }]}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          All Programs
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    left: 4,
    bottom: 40,
    minHeight: 230,
    borderWidth: 2,
    zIndex: 9998,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 8,
  },
  banner: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  compactBanner: { paddingHorizontal: 10, gap: 8 },
  avatar: { fontSize: 28 },
  username: { flex: 1, fontWeight: "bold", fontSize: 15 },
  itemsScroll: { flexShrink: 1 },
  items: { padding: 10 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  gameItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 10,
    borderRadius: 0,
  },
  gameIcon: { fontSize: 27, width: 32, textAlign: "center" },
  gameText: { flex: 1, minWidth: 0 },
  accountItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 10,
    borderRadius: 0,
  },
  accountIcon: { fontSize: 23, width: 27, textAlign: "center" },
  separator: { height: 1, marginVertical: 5 },
  gameTitle: { fontSize: 13, fontWeight: "bold" },
  gameSubtitle: { fontSize: 11, marginTop: 2 },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  footerText: { fontSize: 11, textAlign: "right" },
});