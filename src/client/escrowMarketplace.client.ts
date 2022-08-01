import * as anchor from '@project-serum/anchor';
import { BN, Idl, Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { EscrowMarketplaceProgram } from './data/escrow_marketplace_program';
import { AccountUtils, toBN, isKp, toByteArray } from './common';

export class EscrowMarketplaceClient extends AccountUtils {
    // @ts-ignore
    wallet: anchor.Wallet;
    provider!: anchor.Provider;
    escrowMarketplaceProgram!: anchor.Program<EscrowMarketplaceProgram>;

    constructor(
        conn: Connection,
        // @ts-ignore
        wallet: anchor.Wallet,
        idl?: Idl,
        programId?: PublicKey
    ) {
        super(conn);
        this.wallet = wallet;
        this.setProvider();
        this.setEscrowMarketplaceProgram(idl, programId);
    }

    setProvider() {
        this.provider = new AnchorProvider(this.conn, this.wallet, AnchorProvider.defaultOptions());
        anchor.setProvider(this.provider);
    }

    setEscrowMarketplaceProgram(idl?: Idl, programId?: PublicKey) {
        //instantiating program depends on the environment
        if (idl && programId) {
            //means running in prod
            this.escrowMarketplaceProgram = new anchor.Program<EscrowMarketplaceProgram>(
                idl as any,
                programId,
                this.provider
            );
        }
    }

    // --------------------------------------- fetch deserialized accounts

    // --------------------------------------- find PDA adsdresses

    // --------------------------------------- find all PDA addresses

    // --------------------------------------- ixs

    async createListing(seller: PublicKey, sellerToken: PublicKey, nftMint: PublicKey, sellerListingPrice: number) {
        const [escrowTokenAccount] = await this.findProgramAddress(
            [sellerToken.toBytes(), Buffer.from(anchor.utils.bytes.utf8.encode('escrow-token'))],
            this.escrowMarketplaceProgram.programId
        );

        const [escrowInfoPda, escrowInfoAccountBump] = await this.findProgramAddress(
            [sellerToken.toBytes()],
            this.escrowMarketplaceProgram.programId
        );

        const txSig = await this.escrowMarketplaceProgram.methods.createListing(
            toBN(sellerListingPrice),
            escrowInfoAccountBump
        ).accounts({
          seller: seller,
          sellerToken,
          nftMint,
          escrowInfo: escrowInfoPda,
          escrowToken: escrowTokenAccount
        }).rpc();

        return {txSig, escrowInfoPda}
    }
}
