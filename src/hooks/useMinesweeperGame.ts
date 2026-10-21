import { useCallback, useEffect, useState } from "react";
import {
  createMinesweeperState,
  MinesweeperState,
  revealMinesweeperCell,
  tickMinesweeper,
  toggleMinesweeperFlag,
} from "../components/Games/minesweeperEngine";

export function useMinesweeperGame() {
  const [game, setGame] = useState(createMinesweeperState);

  useEffect(() => {
    if (game.status !== "playing") return;
    const timer = setInterval(() => {
      setGame((current) => tickMinesweeper(current));
    }, 1000);
    return () => clearInterval(timer);
  }, [game.status]);

  const reveal = useCallback((row: number, column: number) => {
    setGame((current) => revealMinesweeperCell(current, row, column));
  }, []);

  const toggleFlag = useCallback((row: number, column: number) => {
    setGame((current) => toggleMinesweeperFlag(current, row, column));
  }, []);

  const newGame = useCallback(() => {
    setGame((current: MinesweeperState) => createMinesweeperState(current.round + 1));
  }, []);

  return { game, reveal, toggleFlag, newGame };
}
