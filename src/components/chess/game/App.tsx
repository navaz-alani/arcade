import React from "react";
import ChessGrid from "../grid/Grid";
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
  return (
    <>
      <ChessGrid board={gs.board} dispatch={dispatch} />
    </>
  );
}

export default ChessGame;
