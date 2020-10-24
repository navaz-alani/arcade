import {
  CellState,
  Grid,
  GridItem,
  Pos,
  WinState,
} from "../share/types";

export class MinesweeperGameState {
  private initial: boolean;
  private mines: number;
  private grid: Grid;
  private ws: WinState;
  private uncovered: number;
  readonly rows: number;
  readonly cols: number;

  constructor(rows: number, cols: number, mines: number) {
    this.initial = true;
    this.ws = "undetermined";
    this.mines = mines;
    this.rows = rows;
    this.cols = cols;
    this.uncovered = 0;
    this.grid = [];
    for (let r = 0; r < rows; ++r) {
      let row: GridItem[] = [];
      for (let c = 0; c < cols; ++c)
        row.push({
          enabled: true,
          surrounding: 0,
          state: CellState.Covered,
        });
      this.grid.push(row);
    }
  }

  reset = () => {
    this.initial = true;
    this.ws = "undetermined";
    this.uncovered = 0;
    for (let r = 0; r < this.rows; ++r) for (let c = 0; c < this.cols; ++c) {
        this.grid[r][c].enabled = true;
        this.grid[r][c].surrounding = 0;
        this.grid[r][c].state= CellState.Covered;
    }
  }

  isValidPos = (p: Pos): boolean => (0 <= p.row && p.row < this.rows) &&
                                    (0 <= p.col && p.col < this.cols)

  isWon = (): WinState => this.ws;

  getSurrounding = (p: Pos): number => this.grid[p.row][p.col].surrounding;

  getGrid = (): Readonly<Grid> => this.grid;

  computeNeighborStats = (p: Pos) => {
    this.grid[p.row][p.col].surrounding = 0;
    let neighbor: Pos = { row: 0, col: 0 };
    for (let dx = -1; dx <= 1; ++dx) for (let dy = -1; dy <= 1; ++dy) {
      neighbor.row = p.row + dx;
      neighbor.col = p.col + dy;
      this.isValidPos(neighbor) &&
        this.grid[neighbor.row][neighbor.col].surrounding == -1 &&
        ++this.grid[p.row][p.col].surrounding;
    }
  }

  handleClick = (p: Pos) => {
    if (!this.grid[p.row][p.col].enabled) return;
    else if (this.grid[p.row][p.col].state === CellState.Flag) return;
    else if (this.initial) {
      this.initial = false;
      // now populate grid with mines
      let minesToAdd: number = this.mines;
      let randRow: number, randCol: number;
      while (minesToAdd != 0) {
        randRow = Math.floor(Math.random() * this.cols);
        randCol = Math.floor(Math.random() * this.rows);
        if (randRow == p.row && randCol == p.col) continue;
        this.grid[randRow][randCol].surrounding = -1;
        --minesToAdd;
      }
      this.computeNeighborStats(p);
    } else if (this.grid[p.row][p.col].surrounding == -1) {
      this.ws = "loss";
    } else this.computeNeighborStats(p);
    this.grid[p.row][p.col].state = CellState.Uncovered;
    this.grid[p.row][p.col].enabled = false;
    ++this.uncovered;
    if (this.uncovered == (this.rows * this.cols) - this.mines) {
      this.ws = "win";
    }
  }

  flag = (p: Pos) => {
    if (!this.grid[p.row][p.col].enabled) return;
    else if (this.grid[p.row][p.col].state === CellState.Flag)
      this.grid[p.row][p.col].state = CellState.Covered;
    else
      this.grid[p.row][p.col].state = CellState.Flag;
  }
};
