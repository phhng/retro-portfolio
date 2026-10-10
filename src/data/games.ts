import type { ComponentType } from "react";
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
];
