import { Board } from "../game/logic";

export interface Pos {
  row: number;
  col: number;
};

export const posEqual = (p1: Pos, p2: Pos): boolean => {
  return (p1.row === p2.row) && (p1.col === p2.col);
}

export enum Color {
  Black,
  White,
};

export enum PieceType {
  Pawn,
  Knight,
  Rook,
  Bishop,
  Queen,
  King,
};

export interface Piece {
  type: PieceType;
  color: Color;
  // indicates if a piece is being focused on
  focus: boolean;
};

export type GridItem = Piece | "void" | "focus";

export type Grid = GridItem[][];

export interface GameState {
  board: Board;
};

export type Action = "reset" | "undo" | "redo" |
  // click on a piece to focus on it - highlight the movable positions
  {
    type: "click",
    piece: GridItem,
    pos: Pos,
  } |
  {
    type: "selection",
    piece: PieceType,
  };

export enum MoveType {
  Normal,
  EnPassant, // special pawn cature
  Castling,  // king, rook pair special move
  Promotion, // pawn promotion move
};

export interface Move {
  types: MoveType[];
  from: Pos;
  to: Pos;
  captured: GridItem;
  turn: Color;
};
