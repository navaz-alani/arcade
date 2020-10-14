export enum Side { Up = 0, Down };
export enum PaddleDir { Left = 0, Right };

export interface Pos {
  x: number,
  y: number,
};

export interface Paddle {
  side: Side;
  pos: Pos;
  ref: React.MutableRefObject<HTMLDivElement>;
};

export interface Ball {
  pos: Pos;
  dir: Pos;
  ref: React.MutableRefObject<HTMLDivElement>;
}

export interface GameState {
  turn: Side;
  paddles: Paddle[];
  ball: Ball;
  container: React.MutableRefObject<HTMLDivElement>;
  score: number[];
  win: {
    isWon: boolean;
    winner: Side;
  }
};

export type Action = "reset" | "move-ball" |
  {
    type: "move-paddle";
    direction: PaddleDir;
  };
