import React, { useEffect, useState } from "react";

import {FTABI, NFTABI, WebaverseABI} from '../../src/abis/contract.jsx';
import { ethers } from 'ethers'

const NFTcontractAddress = '0x3D081BF4b7eAe74e25fF1a2461f92aBc3Ea15441';

async function getContentUrl(tokenId) {
    const defaultProvider = new ethers.providers.StaticJsonRpcProvider('https://polygon-rpc.com/')
    const NFTcontract = new ethers.Contract(NFTcontractAddress, NFTABI, defaultProvider);
    let contentURL = '';
    console.log("token ID", tokenId)

    try {
        contentURL = await NFTcontract.getTokenContentURL(tokenId)
    } catch(err) {
        console.log('Invalid token ID', err)
    }
    return contentURL;
}


const MetadataObject = (props) => {

    const [id, setId] = useState(props.id)
 
    const getContent = async () => {
        const content_url = await getContentUrl(1)
        console.log("content", content_url)
    }

    const getMetadata = async () => {
        const defaultProvider = new ethers.providers.StaticJsonRpcProvider('https://polygon-rpc.com/')
        const NFTcontract = new ethers.Contract(NFTcontractAddress, NFTABI, defaultProvider);

        const _isServerSigned = await NFTcontract.isServerSigned(id);

        if (_isServerSigned) {
            const content_url = await NFTcontract.getTokenContentURL(id)

            let metaverse_url = content_url.split("index.js")[0] + '.metaversefile';

            try {

                fetch(metaverse_url)
                  .then((response) => response.json())
                    .then((data) => {
                        console.log("metadata:", data)
                        const name = data.name;
                        const description = data.description
                    });

                // let metaversefile = await fetch(metaverse_url);
                // if(metaversefile) {

                //     const meta_content = metaversefile.json();
                //     console.log("content:", meta_content, meta_content.json())
                // }

            } catch(err) {
                console.log("err", err)
            }


        } else {
            console.log("content:", "no server mint")
        }
    }


    return (
        <>
            <p style={{color:'red'}}> {id} </p>
            <button onClick={getMetadata}>GET</button>
        </>

    );
};

MetadataObject.getInitialProps = async (ctx) => {
    const { req } = ctx;
    const match = req.url.match(/^\/([^\/]*)\/([^\/]*)/);
    console.log("metadata url", match)
    let id = match ? match[2] : "";
    return {
      id
    }

};

export default MetadataObject;
