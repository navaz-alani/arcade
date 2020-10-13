import React from "react";
import { Action, Color, PieceType } from "../share/types";
import styles from "./Picker.module.css";
import { getAssetSrc } from "../share/utils";

export const PromotionOpts: PieceType[] = [
  PieceType.Queen, PieceType.Rook,
  PieceType.Bishop, PieceType.Knight,
];

interface Props {
  pieces: PieceType[];
  color: Color,
  dispatch: (a: Action) => void;
};

export const PiecePicker: React.FC<Props> = ({ color, pieces, dispatch }) => {
  return (
    <div className={styles["picker"]}>
    <p>Pick a piece:</p>
    {
      pieces.map((p: PieceType, key: number) => {
        return (
          <div key={key}
               className={styles["picker-item"]}
               onClick={() => dispatch({ type: "selection", piece: p })}
          >
            <img src={getAssetSrc({ type: p, color: color })} />
          </div>
        );
      })
    }
    </div>
  );
};
