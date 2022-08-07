import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useEffect, useRef, useState } from 'react';
import { createFakeWallet, initEscrowMarketplaceClient } from '../../client/common';
import { getMintsMetadata } from '../../utils';
import CardNFT, { NFTInterface } from '../common/cardNFT';

const Home = () => {
    const wallet = useAnchorWallet();
    const [walletPubKey, setWalletPubKey] = useState<PublicKey>();
    const [allListedCardsNftInfo, setAllListedCardsNftInfo] = useState<NFTInterface[]>();

    const setAllListedStates = async (wallet: AnchorWallet) => {
        const emClient = await initEscrowMarketplaceClient();
        const allListingProofAccounts = await emClient.fetchAllListingProofAcc();

        setAllListedCardsNftInfo(
            allListingProofAccounts.map((tokenAccountInfo) => {
                return {
                    sellerKey: tokenAccountInfo.account.sellerKey,
                    mintPubKey: tokenAccountInfo.account.nftMint,
                    tokenPubKey: tokenAccountInfo.account.escrowToken,
                    imageUrl: 'loading',
                    name: 'loading',
                    price: 0,
                };
            })
        );

        const availMintsMetadata = await getMintsMetadata(
            allListingProofAccounts.map((tokenAccountInfo) => tokenAccountInfo.account.nftMint)
        );

        setAllListedCardsNftInfo(
            allListingProofAccounts.map((tokenAccountInfo, index) => {
                return {
                    sellerKey: tokenAccountInfo.account.sellerKey,
                    mintPubKey: tokenAccountInfo.account.nftMint,
                    tokenPubKey: tokenAccountInfo.account.escrowToken,
                    imageUrl: availMintsMetadata[index].imageUrl,
                    name: availMintsMetadata[index].name,
                    price: tokenAccountInfo.account.listPrice.toNumber(),
                };
            })
        );
    };

    useEffect(() => {
        (async () => {
            const fakeWallet = createFakeWallet();
            await setAllListedStates(fakeWallet);
        })();
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6">
            {allListedCardsNftInfo?.map((cardInfoNFT, index) => (
                <CardNFT
                    nft={cardInfoNFT}
                    wallet={wallet}
                    setStates={setAllListedStates}
                    isListed={true}
                    key={index}
                />
            ))}
        </div>
    );
};

export default Home;
