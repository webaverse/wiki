import { ethers } from 'ethers';

export async function getVoucherFromServer(contentURL) {
    const tokenId = 0;
    const expiry = Math.round(new Date().getTime() / 1000) + 1000;//timestamp
    const nonce = ethers.BigNumber.from(ethers.utils.randomBytes(4)).toNumber();
    const balance = 1;

    
    // const response = await fetch("http://localhost:8081/getServerDropVoucher", { // https://{voucherSeverip}:8081/getServerDropVoucher
    const response = await fetch("https://serverless-backend-blue.vercel.app/api/getServerDropVoucher", { // https://{voucherSeverip}:8081/getServerDropVoucher
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key' : "dXNlcm5hbWU6MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MA"
        },
        body: JSON.stringify({ 
            signData: {tokenId, contentURL, balance, nonce, expiry}
        })
    });
    console.log("voucher response", response)
    const voucher = await response.json();
    return voucher;
}

