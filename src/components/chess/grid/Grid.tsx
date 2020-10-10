import React from "react";
import { Board } from "../game/logic";
import { Action, Color, GridItem, PieceType } from "../share/types";
import styles from "./Grid.module.css";

interface Props {
  board: Board;
  dispatch: (a: Action) => void
};

// board is checkered in a way such that each player has white at bottom right
const getColorClass = (r: number, c: number): string => {
  return ((r+c)%2 == 0) ? "grid-item-white" : "grid-item-black";
}

interface PieceSpec {
  type: PieceType;
  color: Color;
}

const getAssetSrc = (p: PieceSpec): string => {
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

const ChessGrid: React.FC<Props> = ({ board, dispatch }) => {
  return (
    <div className={styles["board"]}>
    <div className={styles["col-names"]}>
    {
      "abcdefgh".split("").map((colName: string, key: number) => {
        return <p className={styles["col-name"]} key={key}>{colName}</p>
      })
    }
    </div>
    {
      board.getGrid().map((row: GridItem[], r: number) => {
        return (
          <div key={r} className={styles["board-row"]}>
          <p className={styles["row-name"]}>{Board.dim - r}</p>
          {
            row.map((it: GridItem, c: number) => {
              let className: string = `${styles["grid-item"]}
                                       ${styles[getColorClass(r, c)]} `;
              // handle displaying focus
              if (it === "focus" || (it !== "void" && it.focus))
                className += styles["grid-item-focus"];
              const clickHandler = () => dispatch({
                type: "click",
                piece: it,
                pos: { row: r, col: c },
              });
              return (
                <div key={`${r}-${c}`}
                     className={className}
                     onClick={clickHandler}
                >
                {
                  (it !== "void" && it !== "focus") &&
                  <img src={`${getAssetSrc({type: it.type, color: it.color})}`} />
                }
                </div>
              );
            })
          }
          <p className={styles["row-name"]}>{Board.dim - r}</p>
          </div>
        );
        }
      )
    }
    <div className={styles["col-names"]}>
    {
      "abcdefgh".split("").map((colName: string, key: number) => {
        return <p key={key} className={styles["col-name"]}>{colName}</p>
      })
    }
    </div>
    </div>
  );
}

export default ChessGrid;
