import React from "react";
import ChessGrid from "../grid/Grid";
import styles from "./App.module.css";
import { Color, GameState, Action } from "../share/types";
import { Board } from "./logic";
import Log from "./Log";
import ControlPanel from "./ControlPanel";
import { PiecePicker, PromotionOpts } from "./Picker";

const InitialGameState = (): GameState => {
  return {
    board: new Board(),
  };
}

const GameReducer = (s: GameState, action: Action): GameState => {
  if (action === "reset") return InitialGameState();
  else if (action === "undo" ) s.board.undo(false);
  else if (action === "redo" ) s.board.undo(true);
  else if (action.type === "click") s.board.handleClick(action.pos);
  else s.board.handleSelection(action.piece);
  return { ...s };
}

const ChessGame: React.FC = () => {
  let [gs, dispatch] = React.useReducer(GameReducer, InitialGameState());

  return (
    <>
      <h1 className={styles["app-title"]}>Chess</h1>
      <div className={styles["app"]}>
        <div className={styles["app-main"]}>
          <p>Turn: {Color[gs.board.getTurn()]}</p>
          <ChessGrid board={gs.board} dispatch={dispatch} />
          {
            gs.board.isSelectionNeeded() &&
              <PiecePicker color={gs.board.getTurn()}
                           pieces={PromotionOpts}
                           dispatch={dispatch}
            />
          }
          <ControlPanel gs={gs} dispatch={dispatch} />
        </div>
        <Log moves={gs.board.getMoves()} />
      </div>
    </>
  );
}

export default ChessGame;
