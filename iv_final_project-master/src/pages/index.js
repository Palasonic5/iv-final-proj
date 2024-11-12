import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import BankFailuresVisualization from "./iv_final_project_mingyuan_yue_helen_zhang"; 


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>U.S. Bank Failures Visulization</title>
        <link href="https://fonts.googleapis.com/css2?family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <main className={`${styles.main} ${inter.className}`} style={{ margin: 0, padding: 0, backgroundColor: 'white' }}>
        <BankFailuresVisualization />
      </main>
    </>
  );
}