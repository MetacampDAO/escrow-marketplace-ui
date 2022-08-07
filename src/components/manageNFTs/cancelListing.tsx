import React, { useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import _ from 'lodash';
import { conn, initEscrowMarketplaceClient } from '../../client/common';
import { NFTInterface } from '../common/cardNFT';

interface createListingInterface {
    nft: NFTInterface;
    wallet: AnchorWallet | undefined;
    setOverallStates: (walletPubKey: AnchorWallet) => Promise<void>;
}

const CancelListing = ({ nft, wallet, setOverallStates }: createListingInterface) => {
    const { mintPubKey, tokenPubKey, price } = nft;
    const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
    const [wsSubscriptionId, setWsSubscribtionId] = useState<number>();

    const removeListingProofListener = async () => {
        if (wsSubscriptionId) await conn.removeAccountChangeListener(wsSubscriptionId);
    };

    const onClickCancel = async () => {
        if (wallet && mintPubKey && tokenPubKey) {
            setIsTxLoading(true);
            try {
                const emClient = await initEscrowMarketplaceClient(wallet as any);
                const { txSig, sellerTokenPda } = await emClient.cancelListing(
                    wallet.publicKey,
                    tokenPubKey,
                    mintPubKey,
                );

                console.log('Submitted tx:', txSig);

                const wsSubscriptionId = conn.onAccountChange(sellerTokenPda, async () => {
                    await removeListingProofListener();
                    await setOverallStates(wallet);
                    setIsTxLoading(false);
                });
                setWsSubscribtionId(wsSubscriptionId);
            } catch (err) {
                setIsTxLoading(false);
                console.log(err);
            }
        }
    };

    return (
        <div className="flex flex-row mt-3 space-x-1.5 justify-between">
            <div className="flex flex-row space-x-1">
                <div className="flex items-center">{solanaSVG()}</div> 
                <div className="flex items-center">{price/1e9}</div>
            </div>
            <button
                onClick={onClickCancel}
                className="w-1/3 inline-block flex justify-center items-center rounded bg-red-500 py-1.5 px-2 text-sm font-semibold text-slate-900 hover:bg-red-400 active:bg-sky-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/50"
            >
                {isTxLoading ? (
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : (
                    'Cancel'
                )}
            </button>
        </div>
    );
};

export const solanaSVG = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.80286 13.8188C3.90696 13.7147 4.0501 13.6539 4.20191 13.6539H17.9689C18.2205 13.6539 18.3463 13.9576 18.1685 14.1354L15.4489 16.855C15.3448 16.9591 15.2017 17.0198 15.0498 17.0198H1.28281C1.03124 17.0198 0.905451 16.7162 1.08329 16.5383L3.80286 13.8188Z"
                fill="url(#paint0_linear_354_8099_3905273223)"
            ></path>
            <path
                d="M3.80286 3.66482C3.9113 3.56072 4.05443 3.5 4.2019 3.5H17.9689C18.2205 3.5 18.3463 3.80362 18.1685 3.98146L15.4489 6.70103C15.3448 6.80513 15.2017 6.86585 15.0498 6.86585H1.28281C1.03124 6.86585 0.905451 6.56223 1.08329 6.3844L3.80286 3.66482Z"
                fill="url(#paint1_linear_354_8099_5011780572)"
            ></path>
            <path
                d="M15.4489 8.70938C15.3448 8.60528 15.2017 8.54456 15.0498 8.54456H1.28281C1.03124 8.54456 0.905451 8.84818 1.08329 9.02601L3.80286 11.7456C3.90696 11.8497 4.0501 11.9104 4.20191 11.9104H17.9689C18.2205 11.9104 18.3463 11.6068 18.1685 11.429L15.4489 8.70938Z"
                fill="url(#paint2_linear_354_8099_0104000265)"
            ></path>
            <defs>
                <linearGradient
                    id="paint0_linear_354_8099_3905273223"
                    x1="16.6538"
                    y1="1.87538"
                    x2="7.1259"
                    y2="20.1251"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00FFA3"></stop>
                    <stop offset="1" stopColor="#DC1FFF"></stop>
                </linearGradient>
                <linearGradient
                    id="paint1_linear_354_8099_5011780572"
                    x1="12.4877"
                    y1="-0.299659"
                    x2="2.95979"
                    y2="17.9501"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00FFA3"></stop>
                    <stop offset="1" stopColor="#DC1FFF"></stop>
                </linearGradient>
                <linearGradient
                    id="paint2_linear_354_8099_0104000265"
                    x1="14.5575"
                    y1="0.78106"
                    x2="5.02959"
                    y2="19.0308"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00FFA3"></stop>
                    <stop offset="1" stopColor="#DC1FFF"></stop>
                </linearGradient>
            </defs>
        </svg>
    );
};

export default CancelListing;
