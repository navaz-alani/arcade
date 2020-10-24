export enum CellState {
  Uncovered,
  Covered,
  Flag,
};

export interface GridItem {
  enabled: boolean;
  state: CellState;
  surrounding: number; // surrounding neighbour mine count; -1 indicates mine
};

export type Grid = GridItem[][];

export interface Pos {
  row: number;
  col: number;
};

export type WinState = "win" | "loss" | "undetermined";

export type Action = "reset" | {
  type: "click" | "flag";
  pos: Pos;
};
