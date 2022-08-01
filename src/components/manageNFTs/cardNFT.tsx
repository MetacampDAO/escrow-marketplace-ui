import React, { useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

export interface CardNFTInterface {
    mintPubKey: PublicKey;
    tokenPubKey: PublicKey;
    imageUrl: string;
    name: string;
}

const CardNFT = ({ mintPubKey, tokenPubKey, imageUrl, name }: CardNFTInterface) => {
    const [imgLoading, setImgLoading] = useState(true);
    return (
        <div className="shadow-lg bg-slate-800 rounded-lg col-span-12 lg:col-span-3">
            {imageUrl === 'loading' && (
                <div className="w-full bg-gray-700 animate-pulse rounded-t-lg">
                    <div style={{ marginTop: '100%' }}></div>
                </div>
            )}
            {imageUrl !== 'loading' && (
                <div className="flex relative justify-center h-0" style={{ paddingBottom: '100%' }}>
                    <img
                        className={`rounded-t-lg absolute inset-0 h-full w-full ${imgLoading ? 'hidden' : ''}`}
                        alt="example"
                        src={
                            imageUrl === ''
                                ? 'https://user-images.githubusercontent.com/47315479/81145216-7fbd8700-8f7e-11ea-9d49-bd5fb4a888f1.png'
                                : imageUrl
                        }
                        onLoad={() => setImgLoading(false)}
                    />
                    <div className={`w-full bg-gray-700 animate-pulse rounded-t-lg ${imgLoading ? '' : 'hidden'}`}>
                        <div style={{ marginTop: '100%' }}></div>
                    </div>
                </div>
            )}
            <div className="px-3 py-5 text-gray-200">
                {name === 'loading' ? <div className="w-1/2 py-3 bg-slate-600 rounded animate-pulse"></div> : name}
            </div>
        </div>
    );
};

export default CardNFT;
