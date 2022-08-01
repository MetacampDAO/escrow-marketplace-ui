import React, { useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

export interface CardNFTInterface {
    mintPubKey: PublicKey;
    tokenPubKey: PublicKey;
    imageUrl: string;
    name: string;
}

const CardNFT = ({ mintPubKey, tokenPubKey, imageUrl, name }: CardNFTInterface) => {
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
    const [listingPrice, setListingPrice] = useState<string>();

    const onClickList = async() => {
        setIsTxLoading(true)
    }
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
                <div className='flex flex-row mt-3 space-x-1.5'>
                    <input
                        type="number"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Listing Price"
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                        required
                    />
                    <button
                        onClick={onClickList}
                        className="inline-block flex justify-center items-center rounded bg-sky-300 py-1 px-2 text-sm font-semibold text-slate-900 hover:bg-sky-200 active:bg-sky-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50"
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
            </div>
        </div>
    );
};

export default CardNFT;
