import React, { useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import _ from 'lodash';
import { conn, initEscrowMarketplaceClient } from '../../client/common';
import { NFTInterface } from '../common/cardNFT';
import { solanaSVG } from '../manageNFTs/cancelListing';

interface createListingInterface {
    nft: NFTInterface;
    wallet: AnchorWallet | undefined;
    setAllListedStates: (walletPubKey: AnchorWallet) => Promise<void>;
}

const PurchaseListing = ({ nft, wallet, setAllListedStates }: createListingInterface) => {
    const { mintPubKey, tokenPubKey, sellerKey, price } = nft;
    const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
    const [wsSubscriptionId, setWsSubscribtionId] = useState<number>();

    const removeListingProofListener = async () => {
        if (wsSubscriptionId) await conn.removeAccountChangeListener(wsSubscriptionId);
    };

    const onClickPurchase = async () => {
        if (wallet && mintPubKey && tokenPubKey) {
            setIsTxLoading(true);
            try {
                const emClient = await initEscrowMarketplaceClient(wallet as any);
                const { txSig, buyerTokenPda } = await emClient.purchaseListing(
                    wallet.publicKey,
                    sellerKey,
                    tokenPubKey,
                    mintPubKey
                );

                console.log('Submitted tx:', txSig);

                const wsSubscriptionId = conn.onAccountChange(buyerTokenPda, async () => {
                    await removeListingProofListener();
                    await setAllListedStates(wallet);
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
                <div className="flex items-center">{price / 1e9}</div>
            </div>
            <button
                onClick={onClickPurchase}
                className={`${wallet? "bg-green-400  hover:bg-green-300 focus-visible:outline-green-400/50": "bg-gray-400 cursor-not-allowed"} w-1/3 inline-block flex justify-center items-center rounded py-1.5 px-2 text-sm font-semibold text-slate-900 active:bg-sky-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2`}
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
                    'Buy'
                )}
            </button>
        </div>
    );
};

export default PurchaseListing;
