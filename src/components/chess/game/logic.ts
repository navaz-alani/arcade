import {
  Color,
  Grid,
  GridItem,
  Move,
  PieceType,
  Pos,
  posEqual,
} from "../share/types";
import { DirVec, moves } from "./moves";

const pieceSetup: PieceType[][] = [
  // row 1 -> row closest to edge
  [
    PieceType.Rook, PieceType.Knight, PieceType.Bishop, PieceType.Queen,
    PieceType.King, PieceType.Bishop, PieceType.Knight, PieceType.Rook,
  ],
  // row 2 -> row second closest to edge
  [
    PieceType.Pawn, PieceType.Pawn, PieceType.Pawn, PieceType.Pawn,
    PieceType.Pawn, PieceType.Pawn, PieceType.Pawn, PieceType.Pawn,
  ]
];

export class Board {
  static dim: number = 8;
  private grid: Grid;
  private currentFocus: Pos;
  private currPlayable: Pos[];
  private movePlayed: boolean;
  private turn: Color;
  private moves: Move[];
  private undone: Move[];

  // populates grid to initial chess game setup
  public constructor() {
    // initialise instance attributes
    this.currentFocus = { row: -1, col: -1 };
    this.currPlayable = new Array<Pos>();
    this.movePlayed = false;
    this.turn = Color.White;
    this.moves = [];
    this.undone = [];

    // initialize grid as empty first, then add pieces
    this.grid = new Array(Board.dim);
    for (let i = 0; i < Board.dim; ++i)
      this.grid[i] = new Array(Board.dim).fill("void");
    // Add pieces to grid for both sides/colors
    let colors: Color[] = [ Color.Black, Color.White ];
    for (let color of colors) {
      let [r1, r2] = (color === Color.Black)
        ? [ 0, 1 ]
        : [ Board.dim - 1, Board.dim - 2 ];
      for (let r of [r1, r2]) {
        let setup: PieceType[] = pieceSetup[(r === r1) ? 0 : 1];
        for (let c = 0; c < Board.dim; ++c) {
          this.grid[r][c] = {
            type: setup[c],
            color: color,
            position: { row: r, col: c },
            focus: false,
          };
        }
      }
    }
  }
  //
  // Checks that the given position is valid within the board.
  static isValidPos(p: Pos): boolean {
    return 0 <= p.row && p.row < Board.dim &&
           0 <= p.col && p.col < Board.dim;
  }

  static chessNotation(p: Pos): string {
    return "abcdefgh"[p.col] + (Board.dim - p.row).toString();
  }

  // Returns whether a move has been played or not (if the game state is same as
  // original)
  public isMovePlayed(): boolean { return this.movePlayed; }
  // accessors
  public getTurn(): Color { return this.turn; }
  public getGrid(): Readonly<Grid> { return this.grid; }
  public getMoves(): Readonly<Move[]> { return this.moves; }

  // undoes the last played move, or if redo is set, then it undoes an undo
  public undo(redo: boolean) {
    if (!redo && this.moves.length === 0 ||
         redo && this.undone.length === 0) return;
    let lastMove: Move = redo ? this.undone.pop() : this.moves.pop();
    this.move(lastMove.to, lastMove.from, redo ? false : true);
    this.grid[lastMove.to.row][lastMove.to.col] = lastMove.captured;
    this.toggleTurn();
    this.clearFocus();
  }

  private toggleTurn() {
    this.turn = (this.turn === Color.Black) ? Color.White : Color.Black;
  }

  // returns whether the current player can focus on the piece at p
  private canFocus(p: Pos): boolean {
    if (!Board.isValidPos(p)) return false;
    let gi: GridItem = this.grid[p.row][p.col];
    if (gi === "void" || gi === "focus") return true;
    if (gi.color === this.turn) return true;
    return false;
  }

  private toggleFocus(p: Pos) {
    if (!Board.isValidPos(p)) return;
    let item: GridItem = this.grid[p.row][p.col];
    switch (item) {
      case "void":  { this.grid[p.row][p.col] = "focus"; break; }
      case "focus": { this.grid[p.row][p.col] = "void";  break; }
      default: item.focus = !item.focus;
    }
  }

  private clearFocus() {
    for (let i = 0; i < this.currPlayable.length; ++i)
      this.toggleFocus(this.currPlayable[i]);
    this.currentFocus = { row: -1, col: -1 };
    this.currPlayable = [];
  }

  // Checks if piece at p1 is playable on p2.
  // Return "last-playable" indicates that p1 can be played on p2, but no other
  // positions in the direct direction vector leading from p1 to p2 will be
  // playable.
  private isPlayableOn(p1: Pos, p2: Pos): boolean | "last-playable" {
    let item1: GridItem = this.grid[p1.row][p1.col];
    let item2: GridItem = this.grid[p2.row][p2.col];
    if (item1 === "void" || item1 === "focus" ||
        item2 === "void" || item2 === "focus") return true;
    return (item1.color !== item2.color) ? "last-playable" : false;
  }

  // Returns -1 or +1 for DirVec flipping (Color.Black is up so DirVecs for
  // it are flipped).
  private dirMod(p: Pos): -1 | 1 {
    let item: GridItem = this.grid[p.row][p.col];
    if (item !== "void" && item !== "focus" && item.color === Color.White)
      return 1;
    return -1;
  }

  private getFocusPoints(p: Pos): Pos[] {
    let pts: Pos[] = new Array<Pos>();
    let item: GridItem = this.grid[p.row][p.col];
    if (item === "void" || item === "focus") return pts;
    // check in piece's direction vectors and compute all positions it can go to
    let dirs: DirVec[] = moves.get(item.type);
    let d: DirVec, ub: number, dMod: -1 | 1; // predeclared iteration vars
    for (let i = 0; i < dirs.length; ++i) {
      d = dirs[i];
      ub = (d.rep) ? 8 : 1;
      dMod = this.dirMod(p);
      for (let i = 1; i <= ub; ++i) {
        let pos: Pos = {
          row: p.row + i*dMod*d.x,
          col: p.col + i*dMod*d.y
        };
        if (!Board.isValidPos(pos))     break;
        let playable: boolean | "last-playable" = this.isPlayableOn(p, pos);
        if (playable === false) break;
        pts.push(pos);
        if (playable === "last-playable") break;
      }
    }
    return pts;
  }

  private focusOn(p: Pos): Pos[] {
    let focusPts: Pos[] = this.getFocusPoints(p);
    for (let i = 0; i < focusPts.length; ++i)
      this.toggleFocus(focusPts[i]);
    return focusPts;
  }

  private move(p1: Pos, p2: Pos, undo: boolean) {
    // log move
    let captured: GridItem = this.grid[p2.row][p2.col]
    let m: Move = {
      from: p1,
      to: p2,
      captured: (captured === "void" || captured === "focus")
                  ? captured
                  : { ...captured },
      turn: this.turn,
    }
    undo ? this.undone.push(m) : this.moves.push(m);
    // perform move
    this.grid[p2.row][p2.col] = this.grid[p1.row][p1.col];
    this.grid[p1.row][p1.col] = "void";
  }

  public handleClick(p: Pos) {
    if (this.currentFocus.row === -1) {
      // check if current player can focus on piece at position p
      if (!this.canFocus(p)) return;
      this.currentFocus = p;
      this.currPlayable = this.focusOn(p);
      if (this.currPlayable.length === 0)
        this.currentFocus = { row: -1, col: -1 };
    } else if (posEqual(this.currentFocus, p)) this.clearFocus();

    if (this.currPlayable.filter((pos: Pos) => posEqual(pos, p)).length === 1) {
      // save original focus piece before clearing
      let pos: Pos = this.currentFocus;
      this.clearFocus();
      // move original focus piece to position p & change turn
      this.move(pos, p);
      this.toggleTurn();
      this.movePlayed = true;
    }
  }
}
