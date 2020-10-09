import React from "react";
import ChessGrid from "../grid/Grid";
import styles from "./App.module.css";
import { Color, GameState, Action } from "../share/types";
import { Board } from "./logic";

const InitialGameState = (): GameState => {
  return {
    board: new Board(),
    turn: Color.White,
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
    if (gs.board.isMovePlayed())
      if (confirm("Confirm game reset"))
        dispatch("reset");
  }

  return (
    <div className={styles["app"]}>
      <h1>Chess</h1>
      <p>Turn: {Color[gs.turn]}</p>
      <ChessGrid board={gs.board} dispatch={dispatch} />
      <button className={styles["app-button"]}
              onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
}

export default ChessGame;
