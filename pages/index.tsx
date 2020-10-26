import Head from "next/head";
import Link from "next/link";
import styles from "./index.module.css";

interface Game {
  href: string;
  name: string;
};

const Games: Game[] = [
  { href: "/chess", name: "Chess (in progress)" },
  { href: "/connect4", name: "Connect4" },
  { href: "/snake", name: "Snake" },
  { href: "/pong", name: "Pong" },
  { href: "/minesweeper", name: "Minesweeper" },
  { href: "/flappy-bird", name: "Flappy Bird" },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>🎮 Online Games 🎮</title>
      </Head>
      <div className={styles["home"]}>
        <h1>🎮 Online Games 🎮</h1>

        <div className={styles["games-listing"]}>
        {
          Games.map((g: Game, i: number) => {
            return (
              <div className={styles["game-listing"]} key={i} >
                <Link href={g.href}>{g.name}</Link>
              </div>
            );
          })
        }
        </div>
      </div>
      <style jsx global>
        {`
        body {
          height: 100vh;
          width: 100vw;
          margin: 0;
          background: url("/home_assests/home-background.webp");
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        #__next {
          height: 100%;
        }
        `}
      </style>
    </>
  )
}
