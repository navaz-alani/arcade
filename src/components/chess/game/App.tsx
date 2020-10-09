import React from "react";
import ChessGrid from "../grid/Grid";
import styles from "./App.module.css";
import { Color, GameState, Action } from "../share/types";
import { Board } from "./logic";
import Log from "./Log";

const InitialGameState = (): GameState => {
  return {
    board: new Board(),
  };
}

const GameReducer = (s: GameState, action: Action): GameState => {
  if (action === "reset") return InitialGameState();
  s.board.handleClick(action.pos);
  return { ...s };
}

const ChessGame: React.FC = () => {
  let [gs, dispatch] = React.useReducer(GameReducer, InitialGameState());

  const resetGame = () => {
    gs.board.isMovePlayed()       &&
    confirm("Confirm game reset") &&
    dispatch("reset");
  }

  return (
    <>
      <h1 className={styles["app-title"]}>Chess</h1>
      <div className={styles["app"]}>
        <div className={styles["app-main"]}>
          <p>Turn: {Color[gs.board.getTurn()]}</p>
          <ChessGrid board={gs.board} dispatch={dispatch} />
          {/* control panel - TODO; make component */}
          <button className={styles["app-button"]}
                  onClick={resetGame}
          >
            Reset Game
          </button>
        </div>
        <Log moves={gs.board.getMoves()} />
      </div>
    </>
  );
}

export default ChessGame;
