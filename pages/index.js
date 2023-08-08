import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout';
import styles from '../styles/Home.module.css';
import layoutStyles from '../styles/Layout.module.css';

import { useAccount, useContractWrite, usePrepareContractWrite, useSigner, useWaitForTransaction } from 'wagmi';
import { getContract } from '@wagmi/core';
import Header from '../components/header';
import { useDebounce } from '../components/util';
import { ethers } from 'ethers';
import { polygon } from 'wagmi/chains';
import Link from 'next/link';
import { useRouter } from 'next/router';

/*
UI
*/

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
const slugify = require('slugify')

function UI() {
  const account = useAccount()
  const { data: signer, isError, isLoading } = useSigner()

  let pools = [
    {
      id: 0,
      name: "Pool 0",
      ticker: "POOL0",
    },
    {
      id: 1,
      name: "Pool 1",
      ticker: "POOL0",
    },
    {
      id: 2,
      name: "Pool 2",
      ticker: "POOL0",
    }
  ]

  const ui = (
    <div className={layoutStyles.container}>
      <Head>
        <title>axon &middot; dashboard</title>
        <meta name="description" content="hot takes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>

      <main className={layoutStyles.main}>
        <span style={{ fontSize: "2.8rem", fontFamily: "monospace", fontWeight: '700' }}>axon</span>
        <p>
          Axon allows anyone to summon BitTorrent swarms to host files, and earn tokens in return.
          <br />
          <br />
          This interface allows you to join/leave pools, and your node will automatically start seeding the files in that pool.
        </p>

        <div>
          <h2>Pools</h2>
          <p>
          </p>
          <div className={styles.poolCardList}>
          {
            pools.map((pool) => {
              return <PoolCard key={pool.id} {...pool} />
            })
          }
          </div>
        </div>

        {/* <div>
          <h2>Earnings</h2>
          <div className={styles.earningsCard}>
            <span></span>
          </div>
        </div> */}
      </main>

      <footer className={layoutStyles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by wordcels
        </a>
      </footer>
    </div>
  )

  return ui
}

const PoolCard = ({ id, name, ticker, description }) => {
  const router = useRouter()
  return <div className={styles.poolCard} onClick={() => router.push(`/pools/${id}/view`)}>
    <header>
      <span className={styles.poolName}>{name}</span>
      <span className={styles.poolTicker}>${ticker}</span>
    </header>
  </div>
}

UI.layout = AppLayout
export default UI
