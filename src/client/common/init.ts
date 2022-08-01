import { NodeWallet } from '@metaplex/js';
import { Connection, Keypair } from '@solana/web3.js';
import { EscrowMarketplaceClient } from '../escrowMarketplace.client';
import { PublicKey } from '@solana/web3.js';
import * as emIdl from '../data/escrow_marketplace_program.json';

const ESCROW_MARKETPLACE_PROG_ID = new PublicKey(
  'DBZ5u3AaFpJMEGKhfQgmXQqUtTzQ5KpjXG9eZRn9R7cV'
);

export const conn: Connection = new Connection("https://api.devnet.solana.com");

export async function  initEscrowMarketplaceClient(
  wallet?: NodeWallet
) {
  const walletToUse = wallet?? createFakeWallet();
  return new EscrowMarketplaceClient(conn, walletToUse, emIdl as any, ESCROW_MARKETPLACE_PROG_ID);
}

function createFakeWallet() {
  const leakedKp = Keypair.fromSecretKey(
    Uint8Array.from([
      208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199, 242,
      120, 4, 78, 75, 19, 227, 13, 215, 184, 108, 226, 53, 111, 149, 179, 84,
      137, 121, 79, 1, 160, 223, 124, 241, 202, 203, 220, 237, 50, 242, 57, 158,
      226, 207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249, 157, 62, 80,
    ])
  );
  return new NodeWallet(leakedKp);

}

