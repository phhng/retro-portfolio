import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useMinesweeperGame } from "../../hooks/useMinesweeperGame";
import {
  getLeaderboard,
  isScoreApiConfigured,
  LeaderboardEntry,
  saveScore,
} from "../../services/scoreApi";
import {
  MinesweeperCell,
  MinesweeperStatus,
  MINE_COUNT,
} from "./minesweeperEngine";

const CELL_SIZE = 29;
const NUMBER_COLORS = [
  "",
  "#0000ff",
  "#008000",
  "#ff0000",
  "#000080",
  "#800000",
  "#008080",
  "#111",
  "#666",
];

export default function MinesweeperGame() {
  const { theme } = useTheme();
  const { email } = useAuth();
  const { game, reveal, toggleFlag, newGame } = useMinesweeperGame();
  const [flagMode, setFlagMode] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const submittedRounds = useRef(new Set<number>());
  const flagsRemaining =
    MINE_COUNT -
    game.board.flat().filter((cell) => cell.isFlagged).length;

  const refreshLeaderboard = useCallback(async () => {
    if (!isScoreApiConfigured()) return;
    setLeaderboard(await getLeaderboard("minesweeper"));
  }, []);

  useEffect(() => {
    let isCurrent = true;
    if (!isScoreApiConfigured()) return;
    void getLeaderboard("minesweeper")
      .then((scores) => {
        if (isCurrent) setLeaderboard(scores);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setStatusMessage(
            error instanceof Error ? error.message : "Could not load Minesweeper times.",
          );
        }
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const submitTime = useCallback(async () => {
    const name = playerName.trim() || email?.split("@")[0].slice(0, 24) || "";
    if (!name) {
      setStatusMessage("Enter a leaderboard name before saving your time.");
      return;
    }

    setIsSaving(true);
    setSaveFailed(false);
    setStatusMessage("");
    try {
      await saveScore(name, game.elapsedSeconds, "minesweeper");
      setStatusMessage("Completion time saved.");
      try {
        await refreshLeaderboard();
      } catch (error) {
        setStatusMessage(
          error instanceof Error
            ? `Time saved, but leaderboard refresh failed: ${error.message}`
            : "Time saved, but the leaderboard could not be refreshed.",
        );
      }
    } catch (error) {
      setSaveFailed(true);
      setStatusMessage(
        error instanceof Error ? error.message : "Could not save completion time.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [email, game.elapsedSeconds, playerName, refreshLeaderboard]);

  useEffect(() => {
    if (game.status !== "won" || !email || !isScoreApiConfigured()) return;
    if (submittedRounds.current.has(game.round)) return;
    submittedRounds.current.add(game.round);
    void submitTime();
  }, [email, game.round, game.status, submitTime]);

  const onCellPress = (row: number, column: number) => {
    if (flagMode) {
      toggleFlag(row, column);
      return;
    }
    reveal(row, column);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.textMain }]}>
          Mines: {flagsRemaining}
        </Text>
        <Text style={[styles.label, { color: theme.textMain }]}>
          Time: {game.elapsedSeconds}s
        </Text>
        <Pressable accessibilityRole="button" onPress={newGame} style={styles.smallButton}>
          <Text style={styles.buttonText}>New game</Text>
        </Pressable>
      </View>

      <View style={styles.boardFrame}>
        {game.board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.boardRow}>
            {row.map((cell, columnIndex) => (
              <BoardCell
                key={`${rowIndex}-${columnIndex}`}
                cell={cell}
                gameStatus={game.status}
                onPress={() => onCellPress(rowIndex, columnIndex)}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setFlagMode((current) => !current)}
          style={[styles.smallButton, flagMode && styles.selectedButton]}
        >
          <Text style={styles.buttonText}>{flagMode ? "Flag mode" : "Reveal mode"}</Text>
        </Pressable>
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          {game.status === "won"
            ? "You cleared the board!"
            : game.status === "lost"
              ? "Boom! Try another board."
              : "Choose Flag mode to mark suspected mines."}
        </Text>
      </View>

      {game.status === "won" && (
        <View style={styles.saveRow}>
          {!email && (
            <TextInput
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Leaderboard name"
              placeholderTextColor={theme.textMuted}
              maxLength={24}
              style={[
                styles.input,
                { color: theme.textMain, borderColor: theme.windowBorderDark },
              ]}
              accessibilityLabel="Leaderboard name"
            />
          )}
          {(!email || saveFailed) && (
            <Pressable
              accessibilityRole="button"
              disabled={isSaving || !isScoreApiConfigured()}
              onPress={() => void submitTime()}
              style={[
                styles.smallButton,
                (isSaving || !isScoreApiConfigured()) && styles.disabled,
              ]}
            >
              <Text style={styles.buttonText}>
                {isSaving ? "Saving..." : saveFailed ? "Retry save" : "Save time"}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
        Fastest Times
      </Text>
      {leaderboard.length === 0 ? (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          {isScoreApiConfigured()
            ? "No times yet."
            : "Configure EXPO_PUBLIC_API_URL to enable times."}
        </Text>
      ) : (
        leaderboard.slice(0, 5).map((entry, index) => (
          <Text key={entry.id} style={[styles.scoreRow, { color: theme.textMuted }]}>
            {index + 1}. {entry.playerName} — {entry.score}s
          </Text>
        ))
      )}
      {statusMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {statusMessage}
        </Text>
      ) : null}
    </View>
  );
}

function BoardCell({
  cell,
  gameStatus,
  onPress,
}: {
  cell: MinesweeperCell;
  gameStatus: MinesweeperStatus;
  onPress: () => void;
}) {
  const text = cell.isFlagged
    ? "⚑"
    : cell.isRevealed
      ? cell.isMine
        ? "✹"
        : cell.adjacentMines > 0
          ? String(cell.adjacentMines)
          : ""
      : "";
  const numberColor =
    cell.isRevealed && !cell.isMine && cell.adjacentMines > 0
      ? NUMBER_COLORS[cell.adjacentMines]
      : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        cell.isRevealed
          ? cell.isMine
            ? "Mine"
            : `Revealed cell, ${cell.adjacentMines} nearby mines`
          : cell.isFlagged
            ? "Flagged cell"
            : "Hidden cell"
      }
      disabled={gameStatus === "won" || gameStatus === "lost"}
      onPress={onPress}
      style={[
        styles.cell,
        cell.isRevealed ? styles.revealedCell : styles.hiddenCell,
        cell.isMine && cell.isRevealed && styles.mineCell,
      ]}
    >
      <Text
        style={[
          styles.cellText,
          numberColor ? { color: numberColor } : undefined,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 7, paddingBottom: 6 },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  label: { fontSize: 12, fontWeight: "bold" },
  boardFrame: {
    padding: 3,
    backgroundColor: "#606060",
    borderWidth: 2,
    borderTopColor: "#404040",
    borderLeftColor: "#404040",
    borderRightColor: "#aaa",
    borderBottomColor: "#aaa",
  },
  boardRow: { flexDirection: "row" },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },
  hiddenCell: {
    backgroundColor: "#c0c0c0",
    borderWidth: 2,
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#777",
    borderBottomColor: "#777",
  },
  revealedCell: { backgroundColor: "#bdbdbd", borderWidth: 1, borderColor: "#999" },
  mineCell: { backgroundColor: "#f44747" },
  cellText: { color: "#111", fontSize: 15, fontWeight: "bold" },
  controls: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  hint: { fontSize: 10, flexShrink: 1 },
  smallButton: {
    minHeight: 27,
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
  selectedButton: { backgroundColor: "#b4c7e7" },
  buttonText: { color: "#111", fontSize: 10, fontWeight: "bold" },
  saveRow: { width: "100%", flexDirection: "row", alignItems: "center", gap: 6 },
  input: {
    minWidth: 100,
    flex: 1,
    height: 30,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 0,
    fontSize: 12,
  },
  disabled: { opacity: 0.55 },
  sectionTitle: { width: "100%", fontSize: 11, fontWeight: "bold", marginTop: 3 },
  scoreRow: { width: "100%", fontSize: 10 },
  status: { color: "#a12622", fontSize: 10 },
});
