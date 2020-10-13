import { PieceType, Color } from "../share/types";

export interface PieceSpec {
  type: PieceType;
  color: Color;
}

export const getAssetSrc = (p: PieceSpec): string => {
  let c: string = p.color === Color.White ? "l" : "d",
      t: string;
  switch (p.type) {
    case PieceType.Pawn:   { t = "p"; break }
    case PieceType.Rook:   { t = "r"; break }
    case PieceType.Knight: { t = "n"; break }
    case PieceType.Bishop: { t = "b"; break }
    case PieceType.Queen:  { t = "q"; break }
    case PieceType.King:   { t = "k"; break }
  }
  return `/chess_assets/${t}${c}t60.png`;
}
