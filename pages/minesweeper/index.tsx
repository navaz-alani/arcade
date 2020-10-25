import { FC, useState } from "react";
import styles from "./index.module.css";
import MinesweeperGame from "@components/minesweeper/game/App";
import { Config } from "components/minesweeper/share/types";

let Configs: { name: string; conf: Config }[] = [
  { name: "Easy", conf: { rows: 9, cols: 9, mines: 8 } },
  { name: "Medium", conf: { rows: 16, cols: 16, mines: 35 } },
  { name: "Expert", conf: { rows: 16, cols: 30, mines: 50 } },
];

const Minesweeper: FC = () => {
  let [conf, setConf] = useState<Config>(Configs[0].conf);
  let [field, setField] = useState<{r: number; c: number; m: number;}>({r: 0, c: 0, m: 0});

  const setNum = (f: "r" | "c" | "m", value: string) => {
    const parsed: number = parseInt(value);
    if (parsed !== NaN) field[f] = parsed;
    setField({ ...field });
  }

  return (
    <div className={styles["app"]}>
      <h1>Minesweeper</h1>
      <MinesweeperGame rows={conf.rows}
                       cols={conf.cols}
                       mines={conf.mines}
      />
      <strong>Game Configuration:</strong>
      <div className={styles["form"]}>
        <label htmlFor="r">Rows:</label>
        <input value={field.r} name="r" type="number"
               onChange={e => { setNum("r", e.target.value) }}
        />
        <label htmlFor="c">Cols:</label>
        <input value={field.c} name="c" type="number"
               onChange={e => { setNum("c", e.target.value) }}
        />
        <label htmlFor="m">Mines:</label>
        <input value={field.m} name="m" type="number"
               onChange={e => { setNum("m", e.target.value) }}
        />
      </div>
      <div className={styles["presets-panel"]}>
        <strong>Preset Configurations:</strong>
        {
          Configs.map((c, i: number) => {
            return (
              <p className={styles["preset"]}
                 key={i}
                 onClick={() => confirm("Confirm game reset.") && setConf(c.conf)}
              >
              <strong>{c.name}:</strong> {c.conf.rows} rows, {c.conf.cols} cols, {c.conf.mines} mines
              </p>
            );
          })
        }
        <p>(Click on preset to load it)</p>
      </div>
      <button className={styles["app-button"]}
              onClick={() => {setConf({ rows: field.r, cols: field.c, mines: field.m })}}
      >
        Generate Game
      </button>
    </div>
  );
}

export default Minesweeper;
