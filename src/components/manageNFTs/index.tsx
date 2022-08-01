import React, { useEffect, useRef, useState } from 'react';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TokenAccountsFilter } from '@solana/web3.js';
import { conn, initEscrowMarketplaceClient } from '../../client/common/init';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { filterAvailAccount, getMintsMetadata } from '../../utils';
import WalletOverview from './overview';
import CardNFT, { NFTInterface } from '../common/cardNFT';
import _ from 'lodash';

const ManageNFTs = () => {
    const wallet = useAnchorWallet();
    const [listedNFTsAmount, setListedNFTsAmount] = useState<number>(0);
    const [listedCardsNftInfo, setListedCardsNftInfo] = useState<NFTInterface[]>();
    const [unlistedNFTsAmount, setUnlistedNFTsAmount] = useState<number>(0);
    const [unlistedCardsNftInfo, setUnlistedCardsNftInfo] = useState<NFTInterface[]>();
    const [showListed, setShowListed] = useState<boolean>(false);

    const tokenAccountsFilter: TokenAccountsFilter = {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
    };

    const setWalletStates = async (walletPubKey: PublicKey) => {
        const tokenAccountsInfo = await conn.getParsedTokenAccountsByOwner(
            new PublicKey(walletPubKey),
            tokenAccountsFilter
        );

        const availTokenAccountsInfo = await filterAvailAccount(tokenAccountsInfo.value);
        setUnlistedNFTsAmount(availTokenAccountsInfo.length);

        const availMintsPubKey = availTokenAccountsInfo.map(
            (tokenAccountInfo) => tokenAccountInfo.account.data.parsed.info.mint as PublicKey
        );

        setUnlistedCardsNftInfo(
            availTokenAccountsInfo.map((tokenAccountInfo, index) => {
                return {
                    sellerKey: walletPubKey,
                    mintPubKey: availMintsPubKey[index],
                    tokenPubKey: tokenAccountInfo.pubkey,
                    imageUrl: 'loading',
                    name: 'loading',
                    price: 0,
                };
            })
        );

        const availMintsMetadata = await getMintsMetadata(availMintsPubKey);

        setUnlistedCardsNftInfo(
            availTokenAccountsInfo.map((tokenAccountInfo, index) => {
                return {
                    sellerKey: walletPubKey,
                    mintPubKey: availMintsPubKey[index],
                    tokenPubKey: tokenAccountInfo.pubkey,
                    imageUrl: availMintsMetadata[index].imageUrl,
                    name: availMintsMetadata[index].name,
                    price: 0,
                };
            })
        );
    };

    const setListedStates = async (wallet: AnchorWallet) => {
        const emClient = await initEscrowMarketplaceClient(wallet as any);
        const escrowInfoAccounts = await emClient.fetchEscrowInfoAccBySeller(wallet.publicKey);
        setListedNFTsAmount(escrowInfoAccounts.length)

        setListedCardsNftInfo(
            escrowInfoAccounts.map((tokenAccountInfo) => {
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
            escrowInfoAccounts.map((tokenAccountInfo) => tokenAccountInfo.account.nftMint)
        );

        setListedCardsNftInfo(
            escrowInfoAccounts.map((tokenAccountInfo, index) => {
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

    const setOverallStates = async (wallet: AnchorWallet) => {
        await setWalletStates(wallet.publicKey);
        await setListedStates(wallet);
    };

    useEffect(() => {
        (async () => {
            if (wallet) {
                await setOverallStates(wallet);
            }
        })();
    }, [wallet]);

    return (
        <div>
            <WalletOverview
                walletPubKey={wallet?.publicKey}
                listedNFTs={listedNFTsAmount}
                unlistedNFTs={unlistedNFTsAmount}
            />
            <div className="mb-4 flex flex-row space-x-2 text-sm">
                <div
                    onClick={() => setShowListed(false)}
                    className={`rounded-lg px-2 py-1 w-max border ${
                        showListed ? 'border-slate-700' : 'border-white'
                    } hover:border-white cursor-pointer`}
                >
                    Unlisted
                </div>
                <div
                    onClick={() => setShowListed(true)}
                    className={`rounded-lg px-2 py-1 w-max border ${
                        !showListed ? 'border-slate-700' : 'border-white'
                    } hover:border-white cursor-pointer`}
                >
                    Listed
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                {showListed
                    ? listedCardsNftInfo?.map((cardInfoNFT, index) => (
                          <CardNFT nft={cardInfoNFT} wallet={wallet} setStates={setOverallStates} isListed={true} key={index} />
                      ))
                    : unlistedCardsNftInfo?.map((cardInfoNFT, index) => (
                          <CardNFT nft={cardInfoNFT} wallet={wallet} setStates={setOverallStates} isListed={false} key={index} />
                      ))}
            </div>
        </div>
    );
};

export default ManageNFTs;
