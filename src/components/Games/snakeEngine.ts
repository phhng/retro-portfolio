export interface Point {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";

export interface SnakeState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isPlaying: boolean;
  isGameOver: boolean;
  round: number;
}

export const BOARD_COLUMNS = 18;
export const BOARD_ROWS = 12;
export const CELL_SIZE = 14;

const STARTING_SNAKE: Point[] = [
  { x: 5, y: 6 },
  { x: 4, y: 6 },
  { x: 3, y: 6 },
];

const MOVES: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createInitialSnakeState(): SnakeState {
  return {
    snake: STARTING_SNAKE,
    food: { x: 12, y: 6 },
    direction: "right",
    score: 0,
    isPlaying: false,
    isGameOver: false,
    round: 0,
  };
}

export function createFood(snake: Point[]): Point {
  const emptyCells: Point[] = [];
  for (let y = 0; y < BOARD_ROWS; y += 1) {
    for (let x = 0; x < BOARD_COLUMNS; x += 1) {
      if (!snake.some((segment) => segment.x === x && segment.y === y)) {
        emptyCells.push({ x, y });
      }
    }
  }
  const index = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[index] ?? { x: 0, y: 0 };
}

export function setSnakeDirection(
  state: SnakeState,
  direction: Direction,
): SnakeState {
  const opposite: Record<Direction, Direction> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  if (opposite[state.direction] === direction) return state;
  return {
    ...state,
    direction,
    isPlaying: state.isGameOver ? state.isPlaying : true,
  };
}

export function advanceSnake(state: SnakeState): SnakeState {
  if (!state.isPlaying) return state;

  const movement = MOVES[state.direction];
  const head = {
    x: state.snake[0].x + movement.x,
    y: state.snake[0].y + movement.y,
  };
  const ateFood = head.x === state.food.x && head.y === state.food.y;
  const collisionSegments = ateFood ? state.snake : state.snake.slice(0, -1);
  const hitWall =
    head.x < 0 ||
    head.x >= BOARD_COLUMNS ||
    head.y < 0 ||
    head.y >= BOARD_ROWS;
  const hitSelf = collisionSegments.some(
    (segment) => segment.x === head.x && segment.y === head.y,
  );

  if (hitWall || hitSelf) {
    return { ...state, isPlaying: false, isGameOver: true };
  }

  const snake = [head, ...state.snake].slice(
    0,
    state.snake.length + (ateFood ? 1 : 0),
  );
  return {
    ...state,
    snake,
    score: state.score + (ateFood ? 10 : 0),
    food: ateFood ? createFood(snake) : state.food,
  };
}
