import React, { useEffect, useRef, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { conn } from '../../client/common/init';

interface OverviewInterface {
    walletPubKey: PublicKey | undefined;
    unlistedNFTs: number;
    listedNFTs: number;
}

const WalletOverview = ({ walletPubKey, unlistedNFTs, listedNFTs }: OverviewInterface) => {
    return (
        <div className="shadow-lg bg-slate-800 rounded-lg mb-8 px-10 py-3 flex flex-col lg:flex-row lg:space-x-8 w-full">
            <div className="w-full lg:w-8/12">
                <div className="stat bg-transparent text-white py-2">
                    <div className="text-sm ">Address</div>
                    <div className="stat-value text-2xl truncate font-medium">{walletPubKey?.toBase58()}</div>
                </div>
            </div>
            <div className="w-full lg:w-8/12">
                <div className="stat bg-transparent text-white py-2">
                    <div className="stat-title text-sm">Unlisted NFTs</div>
                    <div className="stat-value text-2xl truncate font-medium">{unlistedNFTs}</div>
                </div>
            </div>
            <div className="w-full lg:w-8/12">
                <div className="stat bg-transparent text-white py-2">
                    <div className="stat-title text-sm">Listed NFTs</div>
                    <div className="stat-value text-2xl truncate font-medium">{listedNFTs}</div>
                </div>
            </div>
            <div className=" ml-auto"></div>
        </div>
    );
};

export default WalletOverview;
