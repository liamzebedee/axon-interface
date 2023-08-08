import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '../../../components/layout';
import styles from '../../../styles/Pool.module.css';
import layoutStyles from '../../../styles/Layout.module.css';

import { useAccount, useContractWrite, usePrepareContractWrite, useSigner, useWaitForTransaction } from 'wagmi';
import { getContract } from '@wagmi/core';
import Header from '../../../components/header';
import { useDebounce } from '../../../components/util';
import { ethers } from 'ethers';
import { polygon } from 'wagmi/chains';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AxisOptions, Chart } from "react-charts";
import NoSSR from 'react-no-ssr';

import { 
    VscCloudDownload,
    VscCloudUpload
 } from "react-icons/vsc";


import { SimpleLineChart } from './chart'

// import WebTorrent from 'webtorrent'
// import dynamic from 'next/dynamic'

// const DynamicHeader = dynamic(() => import('../components/header'), {
//     loading: () => <p>Loading...</p>,
// })


import useDemoConfig  from './demo.tsx'


function UI({ id }) {
    const account = useAccount()
    const { data: signer, isError, isLoading } = useSigner()
    const router = useRouter()

    const pool = {
        id: 0,
        name: "Pool 0",
        ticker: "POOL0",
        description: "Yo man this is the pool for hosting dumb jpegs in.",
        torrents: [
            {},
        ],
        files: [
            {
                infohash: "",
                name: "sintel.mp4"
            }
        ],
        members: [
            {},
            {},
        ],
        admin: "0x" + "0".repeat(40),
        isMember: false,
    }

    const shortenAddress = (address) => {
        return address.slice(0, 6) + "..." + address.slice(-4)
    }

    const ui = (
        <div className={layoutStyles.container}>
            <Head>
                <title>{pool.name} &middot; axon</title>
                <meta name="description" content="hot takes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className={layoutStyles.main}>
                <header>
                    <div className={layoutStyles.backTo} onClick={() => router.push('/')}>
                        <Image src="/back.png" width={48} height={48} />
                        <span> Back to <Link href="/">dashboard</Link></span>
                    </div>
                </header>

                <div className={styles.poolOverview}>
                    <span className={styles.poolName}>{pool.name}</span>
                    {/* <span className={styles.poolTicker}>${pool.ticker}</span> */}
                    <span className={styles.poolDescription}>{pool.description}</span><br />
                    <span className={styles.poolMeta}>
                        <span className={styles.poolTicker}>${pool.ticker}</span>
                        &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                        <span>Created by {shortenAddress(pool.admin)}</span>
                        &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                        <span>{pool.members.length} members</span>
                        &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                        <span>{pool.torrents.length} torrents</span>
                    </span>
                </div>

                <div className={styles.details1}>
                    <div className={styles.poolChart}>
                        <header>
                            <span>
                                <VscCloudDownload />
                                Downloads
                            </span>
                        </header>
                        <p>How much people are downloading this dataset. More downloads = more rewards.</p>
                        <NoSSR>
                            {/* <Chart/> */}
                            <div className={styles.poolChartContainer}>
                                {/* <ResponsiveContainer width="100%" height="100%"> */}
                                    {/* <LineChart
                                        width={900}
                                        height={300}
                                        data={data}
                                        
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="black"
                                            wrapperStyle={{
                                                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;",
                                                stroke: "black",
                                            }}
                                        />
                                        <YAxis 
                                            stroke="black"
                                            wrapperStyle={{
                                                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;",
                                                stroke: "black",
                                            }}
                                        />
                                        <Tooltip 
                                            wrapperStyle={{
                                                margin: "0 auto",
                                                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;",
                                                stroke: "black",
                                            }}
                                        />
                                        <Legend 
                                            wrapperStyle={{
                                                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;",
                                                stroke: "black",
                                            }}
                                        />
                                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                                    </LineChart> */}
                                {/* </ResponsiveContainer> */}


                                <SimpleLineChart />
                            </div>
                        </NoSSR>
                    </div>

                    <div className={styles.poolStats}>
                        <div>
                            <header style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
                                <VscCloudUpload />
                                Uploads
                            </header>
                            <p>Run an axon node to earn rewards from serving downloaders.</p>
                        </div>

                        <div className={styles.statDetail}>
                            <header>Your Upload</header>
                            <span>200 KB</span>
                        </div>
                        <div className={styles.statDetail}>
                            <header>Rewards</header>
                            <span>52.7 $DAPP</span>
                        </div>
                        <div>
                            <button className={styles.btn}>Claim</button>&nbsp;
                            <button className={styles.btn}>Leave</button>
                        </div>
                    </div>

                </div>

                <div className={styles.poolFiles}>
                    <h2>Files</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pool.files.map(file => {
                                        return <tr>
                                            <td>{file.name}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* <div className={styles.poolDetailCard}>
                    <h2>Peers</h2>
                </div>

                <div className={styles.poolDetailCard}>
                    <h2>Files</h2>
                    <div></div>    
                </div> */}
            </main>
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


UI.getInitialProps = async ({ query }) => {
    const { id } = query
    return { id }
}

UI.layout = AppLayout
export default UI
