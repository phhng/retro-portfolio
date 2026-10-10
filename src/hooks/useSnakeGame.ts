import { useCallback, useEffect, useState } from "react";
import { advanceSnake, createInitialSnakeState, Direction, setSnakeDirection } from "../components/Games/snakeEngine";

export function useSnakeGame() {
  const [game, setGame] = useState(createInitialSnakeState);

  useEffect(() => {
    if (!game.isPlaying) return;
    const timer = setInterval(() => {
      setGame((current) => advanceSnake(current));
    }, Math.max(85, 170 - game.score));
    return () => clearInterval(timer);
  }, [game.isPlaying, game.score]);

  const changeDirection = useCallback((direction: Direction) => {
    setGame((current) => setSnakeDirection(current, direction));
  }, []);

  const startGame = useCallback(() => {
    setGame((current) => ({
      ...createInitialSnakeState(),
      isPlaying: true,
      round: current.round + 1,
    }));
  }, []);

  return { game, changeDirection, startGame };
}
