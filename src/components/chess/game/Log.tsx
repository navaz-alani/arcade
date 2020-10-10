import React from "react";
import { Color, Move } from "../share/types";
import styles from "./Log.module.css";
import {Board} from "./logic";

interface Props {
  moves: Readonly<Move[]>;
}

const Log: React.FC<Props> = ({ moves }) => {
  return (
    <div className={styles["log-display"]}>
    <h3>Game Log</h3>
    {
      moves.map((m: Move, key: number) => {
        return (
          <p className={styles["log-entry"]} key={key}>
            {Color[m.turn]}:
              {Board.chessNotation(m.from)}-{Board.chessNotation(m.to)}
          </p>
        );
      })
    }
    </div>
  );
}

export default Log;
