import {useState,useEffect,useRef} from 'react';
import { ethers } from "ethers";
import Identicon from 'identicon.js';
import { Card,Buttom,ButtonGroup } from 'react-bootstrap';

const Home = ({contract}) => {
    const audioRef = useRef(null);
    const[isPlaying,setIsPlaying] = useState(null);
    const [currentItemIndex,setCurrentItemIndex] = useState(null)
    const [loading,setLoading] = useState(true)
    const [marketItems,setMarketItems] = useState(null)
    const loadMarketplaceItems = async() => {
        const result = await contract.getAllUnsolTokens()
        const marketItems = await Promise.all(result.map(async i => {
            const uri = await contract.tokenURI(i.tokenId)
            const response = await fetch(uri + ".json")
            const metadata = await response.json()
            const identicon = `data:image/png;base64,${new Identicon(metadata.name + metadata.price, 300).toString()}`
            return({
                price: i.price,
                itemId: i.tokenId,
                name: metadata.name,
                audio: metadata.audio,
                identicon
            })
        }))
        setMarketItems(marketItems)
        setLoading(false)
    }

    const buyMarketItem = async(item) => {
        await(await contract.buyToken(item.itemIde, {value:item.price})).wait()
        loadMarketplaceItems()
    }

    useEffect(()=>{
        !marketItems && loadMarketplaceItems()
    })

    if(loading) return (
        <main style={{padding:"1rem 0"}}>
            <h2>Loading...</h2>
        </main>
    )
    return (
        <div className="container-fluid mt-5">
            {
                marketItems.length > 0 ?
                <div className="row">

                </div>
                : (
                    <main style={{padding:"1rem 0"}}>
                        <h2>No listed assets</h2>
                    </main>
                )
            }
        </div>
    )
}

export default Home;