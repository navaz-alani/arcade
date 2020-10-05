export type Player = "red" | "yellow";

export type GridItem = Player | "void";

export type Grid = Array<Array<GridItem>>;

export interface WinState {
  isWon: boolean;
  message: string;
};

export interface GameState {
  win: WinState;
  grid: Grid;
  error: {
    isError: boolean;
    message: string;
  },
  turn: Player;
};

export interface Action {
  column: number;
  turn: Player;
};
