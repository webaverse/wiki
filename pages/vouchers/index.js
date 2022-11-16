// import * as THREE from 'three';
// import {useState, useMemo, useEffect} from 'react';

import { useState, useContext, createContext } from "react";
import { Col, Row } from "react-bootstrap";
import axios from 'axios';
import {ethers, BigNumber} from 'ethers';
// import { UserBox } from "../src/components/user-box/UserBox";
import { UserBox } from "../../src/components/user-box/UserBox";
import 'bootstrap/dist/css/bootstrap.min.css';

import { AccountContext } from "../../src/hooks/web3AccountProvider";
import useNFTContract from '../../src/hooks/useNFTContract';

import useWeb3Account from "../../src/hooks/useWeb3Account";
import { CONTRACTS } from '../../src/hooks/web3-constants.js';
import {FTABI, NFTABI, WebaverseABI} from '../../src/abis/contract.jsx';
import { getVoucherFromServer } from '../../src/hooks/voucherHelpers'

// const account = useWeb3Account();
// const VoucherContext = createContext();

const pinata_key = "700a50b844511c9cd8c7";
const pinata_secret_key = "f84e122a8e59fa7fdedc1161f5fe30bab949d0f9fe9c3dad455aa8d007a39c5a";

// const WebaversecontractAddress = "0x4596568f8aaB8C311E60756195eF9C7E65dFCEf7"
// const NFTcontractAddress = "0x3410Bf73f3Db3b3837D5B11765a4C6B0e22fBfee"
// const FTcontractAddress = "0xea735f984497Bbc4Fa30Ffc791B7822706b9dc69"

const WebaversecontractAddress = "0x0ba505DeAa68532D1BE9Cac31F6badb52F41421e"
const NFTcontractAddress = "0x67c0389C77702490f0D6dA45DF09aA97Bf8Aae89"
const FTcontractAddress = "0x97A6aabc5fB496536c80d8756c53443d649CC4c0"

const Voucher = () => {

    // const {account} = useContext(AccountContext);
    const account = useWeb3Account();
    const [mintLoading, setMintLoading] = useState(false) 
    const [serverMintLoading, setServerMintLoading] = useState(false) 
    const [userContentUrl, setUserContentUrl] = useState("");
    const [serverContentUrl, setServerContentUrl] = useState("");
    const [voucher, setVoucher] = useState(null)
    // const {mintNFT, minting, error, setError, WebaversecontractAddress} = useNFTContract(account.currentAddress);

    const pinJSONToIPFS = async(JSONBody) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        return axios
            .post(url, JSONBody, {
                headers: {
                    'pinata_api_key': pinata_key,
                    'pinata_secret_api_key': pinata_secret_key,
                }
            })
            .then(function (response) {
               return {
                   success: true,
                   pinataUrl: response.data.IpfsHash
                //    pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
               };
            })
            .catch(function (error) {
                console.log(error)
                return {
                    success: false,
                    message: error.message,
                }
               
            });
    };

    const userMint = async () => {

        const currentAccount = account.currentAddress;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(currentAccount);

        const Webaversecontract = new ethers.Contract(WebaversecontractAddress, WebaverseABI, signer);
        const NFTcontract = new ethers.Contract(NFTcontractAddress, NFTABI, signer);
        const FTcontract = new ethers.Contract(FTcontractAddress, FTABI, signer);

        try {
            setMintLoading(true);
            console.log("mint start", Webaversecontract)
            const minttx = await Webaversecontract.mint(currentAccount, 1, userContentUrl, '0x');
            const res = await minttx.wait();
            if (res.transactionHash) {
                setMintLoading(false);
                alert("User Mint is successed!")
            }
        } catch (err) {
            setMintLoading(false);
            console.warn('minting to webaverse contract failed', err);
        }

    }
    
    const getVoucher = async () => {
        console.log("get voucher")
        let voucher_res = await getVoucherFromServer(serverContentUrl); 
        console.log("voucher resu", voucher_res)
        setVoucher(voucher_res)
        return voucher_res
    }

    const serverMint = async () => {

        const currentAccount = account.currentAddress;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(currentAccount);

        const Webaversecontract = new ethers.Contract(WebaversecontractAddress, WebaverseABI, signer);
        const NFTcontract = new ethers.Contract(NFTcontractAddress, NFTABI, signer);
        const FTcontract = new ethers.Contract(FTcontractAddress, FTABI, signer);

        // let voucher = await getVoucher();

        try {
            setServerMintLoading(true);
            console.log("mint start", Webaversecontract)
            const minttx = await Webaversecontract.claimServerDropNFT(currentAccount, "0x", voucher);
            const res = await minttx.wait();
            if (res.transactionHash) {
                setServerMintLoading(false);
                alert("Server Mint is successed!")
            }
        } catch (err) {
            setServerMintLoading(false);
            console.warn('minting to webaverse contract failed', err);
        }
    }

    return (
        <section className="voucher">
            <UserBox />
            <div id="mint" className="mint_section">
                <div className="container">
                    <div className="row align-items-start mt-5">
                        <Col xl="6" lg="6" md="6" xs="12" className='presale_section'>
                            <div className='sale_box'>
                                <p className='sec_title'> User Mint </p>
                                <div className='sec_info'>
                                    <p className="data_title">ContentURL</p> 
                                    <input className="txt_input" type="text" value={userContentUrl || ''} onChange={e => setUserContentUrl(e.target.value)} />
                                    <p className="data_title">Name</p>
                                    <input className="txt_input" type="text" ></input>
                                </div>


                                <div className='btn_box'>
                                    {
                                        mintLoading ? 
                                        <button className="mint_btn">MINTING</button>
                                        :
                                        <button className="mint_btn" onClick={userMint}>User Mint</button>
                                    }
                                </div>

                            </div>
                        </Col>

                        <Col xl="6" lg="6" md="6" xs="12" className='pubsale_section'>
                            <div className='sale_box'>
                                <p className='sec_title'> Server Drop Mint </p>
                                <div className='sec_info'>
                                    <p className="data_title">ContentURL</p> 
                                    <input className="txt_input" type="text" value={serverContentUrl || ''} onChange={e => setServerContentUrl(e.target.value)} />
                                    <p className="data_title">Name</p>
                                    <input className="txt_input" type="text" ></input>
                                    <p className="data_title">Voucher</p>
                                    <input className="txt_input" type="text" defaultValue={voucher? voucher.signature : ''} readOnly></input>
                                </div>
                                <div className='btn_box'>
                                    <button className="mint_btn" onClick={getVoucher}>Get Voucher</button>
                                    {
                                        serverMintLoading ? 
                                        <button className="mint_btn">MINTING</button>
                                        :
                                        <button className="mint_btn" onClick={serverMint} >Server Drop Mint</button>
                                    }

                                </div>
                            </div>
                        </Col>                                          
                    
                    </div>
                </div>
            </div>
        </section>                                    
    );
};
export default Voucher;
