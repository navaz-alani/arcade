import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Arcade</title>
      </Head>
      <div>
        <p>Welcome to Navaz's collection of games!</p>
        <p>Here are the ones I have worked on so far:</p>

        <ul>
          <li><Link href="/chess">Chess</Link></li>
          <li><Link href="/connect4">Connect4</Link></li>
          <li><Link href="/snake">Snake</Link></li>
        </ul>
      </div>
    </>
  )
}
