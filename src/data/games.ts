import type { ComponentType } from "react";
import MinesweeperGame from "../components/Games/MinesweeperGame";
import SnakeGame from "../components/Games/SnakeGame";
import type { DesktopItem } from "../hooks/useWindowManager";

export interface GameDefinition extends DesktopItem {
  type: "game";
  subtitle: string;
  component: ComponentType;
}

export const games: GameDefinition[] = [
  {
    id: "snake",
    title: "Snake",
    icon: "🐍",
    type: "game",
    subtitle: "Classic arcade game",
    component: SnakeGame,
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    icon: "💣",
    type: "game",
    subtitle: "Find the hidden mines",
    component: MinesweeperGame,
  },
];
