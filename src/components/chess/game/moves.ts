import { PieceType } from "../share/types";

export interface DirVec {
  // steps to move
  x: number;
  y: number;
  // whether steps are indefinitely repeatable
  rep: boolean;
};

export type PieceMoves = Map<PieceType, DirVec[]>;
export const moves: PieceMoves = new Map<PieceType, DirVec[]>();
moves.set(PieceType.Pawn, new Array<DirVec>(
  { x: -1, y: 0, rep: false },
));
moves.set(PieceType.Knight, new Array<DirVec>(
  { x: -2, y: 1,  rep: false },
  { x: -2, y: -1, rep: false },
  { x: 2,  y: 1,  rep: false },
  { x: 2,  y: -1, rep: false },
  { x: -1, y: 2,  rep: false },
  { x: -1, y: -2, rep: false },
  { x: 1,  y: 2,  rep: false },
  { x: 1,  y: -2, rep: false },
));
moves.set(PieceType.Bishop, new Array<DirVec>(
  { x: 1,  y: 1,  rep: true },
  { x: 1,  y: -1, rep: true },
  { x: -1, y: 1,  rep: true },
  { x: -1, y: -1, rep: true },
));
moves.set(PieceType.Rook, new Array<DirVec>(
  { x: 0, y: 1,  rep: true },
  { x: 0, y: -1, rep: true },
  { x: 1, y: 0,  rep: true },
  { x: -1, y: 0, rep: true },
));
moves.set(PieceType.Queen, new Array<DirVec>(
  { x: 1,  y: 1,  rep: true },
  { x: 1,  y: -1, rep: true },
  { x: -1, y: 1,  rep: true },
  { x: -1, y: -1, rep: true },
  { x: 0,  y: 1,  rep: true },
  { x: 0,  y: -1, rep: true },
  { x: 1,  y: 0,  rep: true },
  { x: -1, y: 0,  rep: true },
));
moves.set(PieceType.King, new Array<DirVec>(
  { x: 1,  y: 1,  rep: false },
  { x: 1,  y: -1, rep: false },
  { x: -1, y: 1,  rep: false },
  { x: -1, y: -1, rep: false },
  { x: 0,  y: 1,  rep: false },
  { x: 0,  y: -1, rep: false },
  { x: 1,  y: 0,  rep: false },
  { x: -1, y: 0, rep: false },
));

