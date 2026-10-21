export interface MinesweeperCell {
  isMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
}

export type MinesweeperStatus = "ready" | "playing" | "won" | "lost";

export interface MinesweeperState {
  board: MinesweeperCell[][];
  status: MinesweeperStatus;
  elapsedSeconds: number;
  round: number;
}

export const BOARD_SIZE = 9;
export const MINE_COUNT = 10;

function createBoard(): MinesweeperCell[][] {
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      isMine: false,
      adjacentMines: 0,
      isRevealed: false,
      isFlagged: false,
    })),
  );
  let minesPlaced = 0;

  while (minesPlaced < MINE_COUNT) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const column = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[row][column].isMine) {
      board[row][column].isMine = true;
      minesPlaced += 1;
    }
  }

  return countAdjacentMines(board);
}

function countAdjacentMines(board: MinesweeperCell[][]): MinesweeperCell[][] {
  return board.map((row, rowIndex) =>
    row.map((cell, columnIndex) => ({
      ...cell,
      adjacentMines: neighbors(rowIndex, columnIndex).filter(
        ([neighborRow, neighborColumn]) => board[neighborRow][neighborColumn].isMine,
      ).length,
    })),
  );
}

function neighbors(row: number, column: number): [number, number][] {
  const positions: [number, number][] = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) continue;
      const neighborRow = row + rowOffset;
      const neighborColumn = column + columnOffset;
      if (
        neighborRow >= 0 &&
        neighborRow < BOARD_SIZE &&
        neighborColumn >= 0 &&
        neighborColumn < BOARD_SIZE
      ) {
        positions.push([neighborRow, neighborColumn]);
      }
    }
  }
  return positions;
}

export function createMinesweeperState(round = 0): MinesweeperState {
  return {
    board: createBoard(),
    status: "ready",
    elapsedSeconds: 0,
    round,
  };
}

export function toggleMinesweeperFlag(
  state: MinesweeperState,
  row: number,
  column: number,
): MinesweeperState {
  if (state.status === "won" || state.status === "lost") return state;
  const cell = state.board[row]?.[column];
  if (!cell || cell.isRevealed) return state;

  const board = state.board.map((boardRow, rowIndex) =>
    boardRow.map((currentCell, columnIndex) =>
      rowIndex === row && columnIndex === column
        ? { ...currentCell, isFlagged: !currentCell.isFlagged }
        : currentCell,
    ),
  );
  return { ...state, board };
}

export function revealMinesweeperCell(
  state: MinesweeperState,
  row: number,
  column: number,
): MinesweeperState {
  if (state.status === "won" || state.status === "lost") return state;
  const selectedCell = state.board[row]?.[column];
  if (!selectedCell || selectedCell.isFlagged || selectedCell.isRevealed) {
    return state;
  }

  let board = state.board.map((boardRow) =>
    boardRow.map((cell) => ({ ...cell })),
  );
  if (state.status === "ready" && board[row][column].isMine) {
    const safeCell = board
      .flat()
      .find((cell) => !cell.isMine && cell !== board[row][column]);
    if (safeCell) {
      board = board.map((boardRow) =>
        boardRow.map((cell) => ({
          ...cell,
          isMine:
            cell === board[row][column]
              ? false
              : cell === safeCell
                ? true
                : cell.isMine,
          isFlagged: cell === safeCell ? false : cell.isFlagged,
        })),
      );
      board = countAdjacentMines(board);
    }
  }

  const cell = board[row][column];
  if (cell.isMine) {
    board = board.map((boardRow) =>
      boardRow.map((currentCell) =>
        currentCell.isMine ? { ...currentCell, isRevealed: true } : currentCell,
      ),
    );
    return { ...state, board, status: "lost" };
  }

  const pending: [number, number][] = [[row, column]];
  while (pending.length > 0) {
    const [currentRow, currentColumn] = pending.pop()!;
    const currentCell = board[currentRow][currentColumn];
    if (currentCell.isRevealed || currentCell.isFlagged || currentCell.isMine) {
      continue;
    }
    currentCell.isRevealed = true;
    if (currentCell.adjacentMines === 0) {
      pending.push(...neighbors(currentRow, currentColumn));
    }
  }

  const revealedSafeCells = board
    .flat()
    .filter((currentCell) => currentCell.isRevealed && !currentCell.isMine)
    .length;
  const status =
    revealedSafeCells === BOARD_SIZE * BOARD_SIZE - MINE_COUNT
      ? "won"
      : "playing";
  return { ...state, board, status };
}

export function tickMinesweeper(state: MinesweeperState): MinesweeperState {
  return state.status === "playing"
    ? { ...state, elapsedSeconds: state.elapsedSeconds + 1 }
    : state;
}
