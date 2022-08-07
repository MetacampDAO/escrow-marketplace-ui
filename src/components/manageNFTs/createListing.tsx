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

const CreateListing = ({ nft, wallet, setOverallStates }: createListingInterface) => {
    const { mintPubKey, tokenPubKey, name } = nft;
    const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
    const [listingPrice, setListingPrice] = useState<string>();
    const [wsSubscriptionId, setWsSubscribtionId] = useState<number>();

    const removeListingProofListener = async () => {
        if (wsSubscriptionId) await conn.removeAccountChangeListener(wsSubscriptionId);
    };

    const onClickList = async () => {
        if (wallet && mintPubKey && tokenPubKey && listingPrice) {
            setIsTxLoading(true);
            try {
                const emClient = await initEscrowMarketplaceClient(wallet as any);
                const { txSig, listingProofPda } = await emClient.createListing(
                    wallet.publicKey,
                    tokenPubKey,
                    mintPubKey,
                    Math.ceil(parseFloat(listingPrice) * 1e9)
                );

                console.log('Submitted tx:', txSig);

                const wsSubscriptionId = conn.onAccountChange(listingProofPda, async () => {
                    await removeListingProofListener();
                    await setOverallStates(wallet);
                    setIsTxLoading(false);
                    setListingPrice(undefined);
                });
                setWsSubscribtionId(wsSubscriptionId);
            } catch (err) {
                setIsTxLoading(false);
                console.log(err);
            }
        }
    };

    return (
        <div className="flex flex-row mt-3 space-x-1.5">
            <input
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-2/3 py-1 px-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Listing Price"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                required
            />
            <button
                onClick={onClickList}
                className="w-1/3 inline-block flex justify-center items-center rounded bg-sky-300 py-1 px-2 text-sm font-semibold text-slate-900 hover:bg-sky-200 active:bg-sky-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50"
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
                    'List'
                )}
            </button>
        </div>
    );
};

export default CreateListing;
