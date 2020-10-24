import React from "react";
import MinesweeperGame from "@components/minesweeper/game/App";

const Minesweeper: React.FC = () => {
  return (
    <>
      <MinesweeperGame rows={10} cols={10} mines={10} />
    </>
  );
}

export default Minesweeper;
