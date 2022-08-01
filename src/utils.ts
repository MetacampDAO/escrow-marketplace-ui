import { AccountInfo, Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { programs } from "@metaplex/js";
import { conn } from "./client/init";

interface MetadataInterface {
  imageUrl: string,
  name: string,
}

export async function filterAvailAccount(
    accountInfoList: {
        account: AccountInfo<ParsedAccountData>;
        pubkey: PublicKey;
    }[],
) {
    const responses = await Promise.all(
        accountInfoList.map((row) => conn.getTokenAccountBalance(row.pubkey, 'confirmed'))
    );
    return accountInfoList.filter((_, i) => responses[i].value.uiAmount === 1 && responses[i].value.decimals === 0);
}

async function getMetadataImgUrl(url: string): Promise<string> {
  return fetch(url)
    .then(
      (response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{ image: string }>;
      },
      () => {
        return { image: "" };
      }
    )
    .then((data) => {
      return data.image;
    });
}

async function getMintMetadata(mintPubkey: PublicKey) {
  try {
    const tokenmetaPubkey = await programs.metadata.Metadata.getPDA(mintPubkey);
    const tokenmeta = await programs.metadata.Metadata.load(
      conn,
      tokenmetaPubkey
    );
    const resp: string = await getMetadataImgUrl(tokenmeta.data.data.uri);
    return {imageUrl: resp, name: tokenmeta.data.data.name};
  } catch (error) {
    console.log(error);
    return {imageUrl: "", name: ""};
  }
}

export async function getMintsMetadata(mintsList: PublicKey[]) {
  const metadataList: MetadataInterface[] = await Promise.all(
    mintsList.map((mintPubKey) => getMintMetadata(mintPubKey))
  )

  return metadataList
}