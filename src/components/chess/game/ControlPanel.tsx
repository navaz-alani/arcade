import React from "react";
import styles from "./ControlPanel.module.css";
import { Action, GameState } from "../share/types";

interface Props {
  gs: GameState;
  dispatch: (a: Action) => void
};

interface ControlButton {
  label: string;
  handler: () => void;
};

const ControlPanel: React.FC<Props> = ({ gs, dispatch }) => {
  const resetGame = () => {
    gs.board.isMovePlayed()       &&
    confirm("Confirm game reset") &&
    dispatch("reset");
  }
  const undo = () => dispatch("undo") ;
  const redo = () => dispatch("redo") ;

  const controls: ControlButton[] = [
    { label: "Reset", handler: resetGame },
    { label: "Undo", handler: undo },
    { label: "Redo", handler: redo },
  ];

  return (
    <div className={styles["controls"]}>
    {
      controls.map((c: ControlButton, key: number) => {
        return (
          <button key={key}
                  className={styles["control-button"]}
                  onClick={c.handler}
          >
          {c.label}
          </button>
        );
      })
    }
    </div>
  );
}

export default ControlPanel;
