import { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSnakeGame } from "../../hooks/useSnakeGame";
import {
  getLeaderboard,
  getMyScores,
  isScoreApiConfigured,
  LeaderboardEntry,
  saveScore,
} from "../../services/scoreApi";
import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  CELL_SIZE,
  Direction,
} from "./snakeEngine";

export default function SnakeGame() {
  const { theme } = useTheme();
  const { email } = useAuth();
  const { game, changeDirection, startGame } = useSnakeGame();
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [savedBest, setSavedBest] = useState<{
    email: string;
    score: number;
  } | null>(null);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const submittedRounds = useRef(new Set<number>());

  const refreshScores = useCallback(async () => {
    if (!isScoreApiConfigured()) return;
    const scores = await getLeaderboard();
    setLeaderboard(scores);
    if (email) {
      const mine = await getMyScores();
      setSavedBest({
        email,
        score: mine.reduce((best, entry) => Math.max(best, entry.score), 0),
      });
    }
  }, [email]);

  useEffect(() => {
    if (!isScoreApiConfigured()) return;
    let isCurrent = true;
    void getLeaderboard()
      .then((scores) => {
        if (isCurrent) setLeaderboard(scores);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setStatus(error instanceof Error ? error.message : "Could not load scores.");
        }
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!email || !isScoreApiConfigured()) {
      return;
    }
    let isCurrent = true;
    void getMyScores()
      .then((scores) => {
        if (isCurrent) {
          setSavedBest({
            email,
            score: scores.reduce((best, entry) => Math.max(best, entry.score), 0),
          });
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setStatus(error instanceof Error ? error.message : "Could not load saved scores.");
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [email]);

  const submitScore = useCallback(async () => {
    const name = playerName.trim() || email?.split("@")[0].slice(0, 24) || "";
    if (!name) {
      setStatus("Enter a leaderboard name before saving your score.");
      return;
    }
    setIsSaving(true);
    setSaveFailed(false);
    setStatus("");
    try {
      await saveScore(name, game.score);
      setStatus(email ? "Score saved to your account." : "Score saved to the leaderboard.");
      try {
        await refreshScores();
      } catch (error) {
        setStatus(
          error instanceof Error
            ? `Score saved, but leaderboard refresh failed: ${error.message}`
            : "Score saved, but the leaderboard could not be refreshed.",
        );
      }
    } catch (error) {
      setSaveFailed(true);
      setStatus(error instanceof Error ? error.message : "Could not save score.");
    } finally {
      setIsSaving(false);
    }
  }, [email, game.score, playerName, refreshScores]);

  useEffect(() => {
    if (!game.isGameOver || !email || !isScoreApiConfigured()) return;
    if (submittedRounds.current.has(game.round)) return;
    submittedRounds.current.add(game.round);
    void submitScore();
  }, [email, game.isGameOver, game.round, submitScore]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const directions: Record<string, Direction> = {
        ArrowUp: "up",
        w: "up",
        ArrowDown: "down",
        s: "down",
        ArrowLeft: "left",
        a: "left",
        ArrowRight: "right",
        d: "right",
      };
      const direction = directions[event.key];
      if (direction && game.isPlaying) {
        event.preventDefault();
        changeDirection(direction);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, game.isPlaying]);

  const themedInput = [
    styles.input,
    { color: theme.textMain, borderColor: theme.windowBorderDark },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: theme.textMain }]}>
          Score: {game.score}
        </Text>
        <Text style={[styles.label, { color: theme.textMuted }]}>
          {game.isPlaying ? "Playing" : game.isGameOver ? "Game over" : "Ready"}
        </Text>
      </View>

      <View style={styles.boardFrame}>
        <View style={styles.board}>
          {game.snake.map((segment, index) => (
            <View
              key={`snake-${index}`}
              style={[
                styles.snakeCell,
                { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE },
              ]}
            />
          ))}
          <View
            style={[
              styles.foodCell,
              { left: game.food.x * CELL_SIZE, top: game.food.y * CELL_SIZE },
            ]}
          />
        </View>
      </View>

      <View style={styles.controlsRow}>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Arrow keys / WASD
        </Text>
        <View style={styles.directionControls}>
          <DirectionButton label="↑" onPress={() => changeDirection("up")} />
          <View style={styles.sideControls}>
            <DirectionButton label="←" onPress={() => changeDirection("left")} />
            <DirectionButton label="↓" onPress={() => changeDirection("down")} />
            <DirectionButton label="→" onPress={() => changeDirection("right")} />
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TextInput
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Leaderboard name"
          placeholderTextColor={theme.textMuted}
          maxLength={24}
          style={themedInput}
          accessibilityLabel="Leaderboard name"
        />
        <ActionButton
          label={game.isPlaying ? "Playing..." : game.isGameOver ? "Play again" : "Start game"}
          disabled={game.isPlaying}
          onPress={startGame}
        />
        {game.isGameOver && (!email || saveFailed) && (
          <ActionButton
            label={isSaving ? "Saving..." : email ? "Retry save" : "Save score"}
            disabled={isSaving}
            onPress={() => void submitScore()}
          />
        )}
      </View>

      <Text style={[styles.hint, { color: theme.textMuted }]}>
        {email
          ? "Signed in: scores save to your account when a game ends."
          : "Sign in from Start > User Accounts to save scores automatically."}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
        Global Top 5
      </Text>
      {leaderboard.length === 0 ? (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          {isScoreApiConfigured()
            ? "No scores yet."
            : "Configure the score API to enable scores."}
        </Text>
      ) : (
        leaderboard.slice(0, 5).map((entry, index) => (
          <Text
            key={entry.id}
            style={[styles.scoreRow, { color: theme.textMuted }]}
          >
            {index + 1}. {entry.playerName} — {entry.score}
          </Text>
        ))
      )}
      {email && savedBest?.email === email && (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Your saved best: {savedBest.score}
        </Text>
      )}
      {status ? (
        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {status}
        </Text>
      ) : null}
    </View>
  );
}

function DirectionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.directionButton}
    >
      <Text style={styles.directionText}>{label}</Text>
    </Pressable>
  );
}

function ActionButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.actionButton, disabled && styles.disabledButton]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6, paddingBottom: 6 },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 12, fontWeight: "bold" },
  boardFrame: {
    alignSelf: "center",
    padding: 3,
    backgroundColor: "#606060",
    borderWidth: 2,
    borderTopColor: "#404040",
    borderLeftColor: "#404040",
    borderRightColor: "#aaa",
    borderBottomColor: "#aaa",
  },
  board: {
    width: BOARD_COLUMNS * CELL_SIZE,
    height: BOARD_ROWS * CELL_SIZE,
    backgroundColor: "#111",
    overflow: "hidden",
  },
  snakeCell: {
    position: "absolute",
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "#55c34a",
    borderWidth: 1,
    borderColor: "#111",
  },
  foodCell: {
    position: "absolute",
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "#f44747",
    borderWidth: 2,
    borderColor: "#111",
  },
  controlsRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hint: { fontSize: 10 },
  directionControls: { alignItems: "center" },
  sideControls: { flexDirection: "row", gap: 4 },
  directionButton: {
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dedede",
    borderWidth: 1,
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#777",
    borderBottomColor: "#777",
    borderRadius: 0,
  },
  directionText: { color: "#111", fontSize: 14, fontWeight: "bold" },
  actions: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  input: {
    minWidth: 100,
    flex: 1,
    height: 30,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 0,
    fontSize: 12,
  },
  actionButton: {
    minHeight: 28,
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#777",
    borderBottomColor: "#777",
    borderRadius: 0,
  },
  actionText: { color: "#111", fontSize: 11, fontWeight: "bold" },
  disabledButton: { opacity: 0.55 },
  sectionTitle: { fontSize: 11, fontWeight: "bold", marginTop: 3 },
  scoreRow: { fontSize: 10 },
  status: { color: "#a12622", fontSize: 10 },
});
