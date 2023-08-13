/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '../../../components/layout';
import styles from '../../../styles/Pool.module.css';
import layoutStyles from '../../../styles/Layout.module.css';
import Header from '../../../components/header';

import { useAccount, useClient, useContractWrite, usePrepareContractWrite, useProvider, useSigner, useWaitForTransaction } from 'wagmi';
import { getContract } from '@wagmi/core';
import { ethers } from 'ethers';
import { hardhat, polygon } from 'wagmi/chains';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import NoSSR from 'react-no-ssr';

import {
    VscCloudDownload,
    VscCloudUpload
} from "react-icons/vsc";

const byteSize = require('byte-size')
import { readContract } from '@wagmi/core'
import { multicall, watchMulticall, watchContractEvent } from '@wagmi/core'
import { createPublicClient, http, parseAbiItem } from 'viem'
import classNames from 'classnames';
import { useRef } from 'react';
import dynamic from 'next/dynamic'

let torrent$
function UI({ poolId, torrent, magnet_uri, poolLabel }) {
    const account = useAccount()
    const { data: signer, isError, isLoading } = useSigner()
    const provider = useProvider()
    const router = useRouter()

    const [browserLoad, setBrowserLoad] = useState(false)
    const [dlProgress, setDLProgress] = useState({
        progress: 0,
        peers: 0,
        downloaded: "0 kB"
    })

    const el = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (process.browser === false) return
        if (browserLoad) return

        setBrowserLoad(true)

        async function loadWebTorrent(el) {
            // let WebTorrent 
            // try {
            //     WebTorrent = (await import('webtorrent/dist/webtorrent.min.js')).default
            // } catch(err) {
            //     console.error(err)
            //     return
            // }

            console.log(WebTorrent)
            const client = new WebTorrent()

            console.log(magnet_uri)
            const torrent = client.add(
                // magnet_uri,
                "magnet:?xt=urn:btih:9b3d43a4f63f6a4b8e399e8d869db20f38647cd3&dn=imlovingit.jpeg&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=wss%3A%2F%2Ftracker.openwebtorrent.com" 
            )
            torrent$ = torrent

            const interval = setInterval(() => {
                let entries = [
                    ['progress', (torrent.progress * 100).toFixed(1) + '%'],
                    ['peers', torrent.numPeers],
                    ['downloaded', byteSize(torrent.downloaded)]
                ]
                const s = entries.map(([key, value]) => `${key}: ${value}`).join(', ')
                const o = entries.reduce((o, [key, value]) => ({ ...o, [key]: value }), {})
                console.log(s)
                setDLProgress(o)
            }, 420) // lel

            console.log('Client is downloading:', torrent.infoHash)

            torrent.on('done', async () => {
                console.log('Progress: 100%')
                clearInterval(interval)
                setDLProgress({
                    progress: 100,
                    peers: torrent.numPeers,
                    downloaded: byteSize(torrent.downloaded)
                })

                // Render all files into to the page
                for (const file of torrent.files) {
                    try {
                        file.getBlobURL(function (err, url) {
                            if (err) return console.log(err)
                            
                            // if file name matches an image regex
                            const imageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i
                            if(file.name.match(imageRegex)) {
                                const img = document.createElement('img')
                                img.src = url
                                el.current.appendChild(img)
                            } else {
                                var a = document.createElement('a')
                                a.target = '_blank'
                                a.download = file.name
                                a.href = url
                                a.textContent = 'Download ' + file.name
                                el.current.appendChild(a)
                            }
                        })
                    } catch (err) {
                        if (err) console.error(err.message)
                    }
                }
            })
        }

        loadWebTorrent(el)
    }, [browserLoad, setDLProgress, el])

    useEffect(() => {
        const torrent = torrent$
        if (!torrent) return

        for (const file of torrent.files) {
            try {
                // debugger
                // document.querySelector('.log').append(file.name)
                console.log('(Blob URLs only work if the file is loaded from a server. "http//localhost" works. "file://" does not.)')
                console.log('File done.')
                console.log('<a href="' + URL.createObjectURL(blob) + '">Download full file: ' + file.name + '</a>')
            } catch (err) {
                if (err) console.error(err.message)
            }
        }

    }, [])

    const ui = (
        <div className={layoutStyles.container}>
            <Head>
                <title>download &middot; axon</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className={layoutStyles.main}>
                <header>
                    <div className={layoutStyles.backTo} onClick={() => router.push('/pools')}>
                        <Image src="/back.png" width={48} height={48} />
                        <span> Back to <Link href={`/pools/${poolId}/view`}><strong>${poolLabel}</strong></Link></span>
                    </div>
                </header>

                <div className={styles.poolOverview}>
                    <h2>Downloading files...</h2>
                    <p>{magnet_uri}</p>
                    <p>Progress: {dlProgress.progress}</p>
                    <p>Peers: {dlProgress.peers}</p>
                    <p>Downloaded: {dlProgress.downloaded.toString()}</p>
                    <div ref={el}/>
                </div>
            </main>
        </div>
    )

    return ui
}

UI.getInitialProps = async ({ query }) => {
    console.log(query)
    const { id: poolId, poolLabel, torrent, magnet_uri } = query
    return { poolId, poolLabel, torrent, magnet_uri }
}

UI.layout = AppLayout

// const DynamicUI = dynamic(() => import('../components/header'), {
//     ssr: false,
// })

export default UI
