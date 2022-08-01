import React, { useEffect, useRef, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TokenAccountsFilter } from '@solana/web3.js';
import { conn } from '../../client/init';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { filterAvailAccount, getMintsMetadata } from '../../utils';
import WalletOverview from './overview';
import CardNFT, { CardNFTInterface } from './cardNFT';
import _ from 'lodash';

const ManageNFTs = () => {
    const wallet = useAnchorWallet();
    const [walletPubKey, setWalletPubKey] = useState<PublicKey>();
    const [listedNFTsAmount, setListedNFTsAmount] = useState<number>(0);
    const [listedCardsNftInfo, setListedCardsNftInfo] = useState<CardNFTInterface[]>();
    const [unlistedNFTsAmount, setUnlistedNFTsAmount] = useState<number>(0);
    const [unlistedCardsNftInfo, setUnlistedCardsNftInfo] = useState<CardNFTInterface[]>();
    const [showListed, setShowListed] = useState<boolean>(false);

    const tokenAccountsFilter: TokenAccountsFilter = {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
    };

    const setWalletStates = async (walletPubKey: PublicKey) => {
        setWalletPubKey(walletPubKey);
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
                    mintPubKey: availMintsPubKey[index],
                    tokenPubKey: tokenAccountInfo.pubkey,
                    imageUrl: "loading",
                    name: "loading",
                };
            })
        );

        const availMintsMetadata = await getMintsMetadata(availMintsPubKey);

        setUnlistedCardsNftInfo(
            availTokenAccountsInfo.map((tokenAccountInfo, index) => {
                return {
                    mintPubKey: availMintsPubKey[index],
                    tokenPubKey: tokenAccountInfo.pubkey,
                    imageUrl: availMintsMetadata[index].imageUrl,
                    name: availMintsMetadata[index].name,
                };
            })
        );
    };

    useEffect(() => {
        (async () => {
            if (wallet) {
                await setWalletStates(wallet.publicKey);
            }
        })();
    }, [wallet]);

    return (
        <div>
            <WalletOverview
                walletPubKey={walletPubKey}
                listedNFTs={listedNFTsAmount}
                unlistedNFTs={unlistedNFTsAmount}
            />
            <div className="mb-4 flex flex-row space-x-2 text-sm">
                <div
                    onClick={() => setShowListed(false)}
                    className={`rounded-2xl px-2 py-1 w-max border ${
                        showListed ? 'border-slate-700' : 'border-white'
                    } hover:border-white cursor-pointer`}
                >
                    Unlisted
                </div>
                <div
                    onClick={() => setShowListed(true)}
                    className={`rounded-2xl px-2 py-1 w-max border ${
                        !showListed ? 'border-slate-700' : 'border-white'
                    } hover:border-white cursor-pointer`}
                >
                    Listed
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                {showListed
                    ? listedCardsNftInfo?.map((cardInfoNFT, index) => (
                          <CardNFT
                              mintPubKey={cardInfoNFT.mintPubKey}
                              tokenPubKey={cardInfoNFT.tokenPubKey}
                              imageUrl={cardInfoNFT.imageUrl}
                              name={cardInfoNFT.name}
                              key={index}
                          />
                      ))
                    : unlistedCardsNftInfo?.map((cardInfoNFT, index) => (
                          <CardNFT
                              mintPubKey={cardInfoNFT.mintPubKey}
                              tokenPubKey={cardInfoNFT.tokenPubKey}
                              imageUrl={cardInfoNFT.imageUrl}
                              name={cardInfoNFT.name}
                              key={index}
                          />
                      ))}
            </div>
        </div>
    );
};

export default ManageNFTs;
