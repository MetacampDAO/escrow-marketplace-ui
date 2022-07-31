import React, { useEffect, useRef, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const ManageNFTs = () => {
    const wallet = useAnchorWallet();

    useEffect(() => {
        (async () => {
            console.log();
        })();
    }, [wallet]);


    return (
        <div>

        </div>
    );
};

export default ManageNFTs;
