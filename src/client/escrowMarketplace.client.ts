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

    async fetchAllListingProofAcc() {
        return this.escrowMarketplaceProgram.account.listingProof.all();
    }

    async fetchListingProofAccBySeller(seller: PublicKey) {
        const filter = [
            {
                memcmp: {
                    offset: 8 + 32, //prepend for anchor's discriminator + nft mint
                    bytes: seller.toBase58(),
                },
            },
        ];
        return this.escrowMarketplaceProgram.account.listingProof.all(filter);
    }

    async fetchListingProofAccByEscrowToken(escrowToken: PublicKey) {
        const filter = [
            {
                memcmp: {
                    offset: 8 + 32 + 32 + 32, //prepend for anchor's discriminator + nft mint + seller key + seller token
                    bytes: escrowToken.toBase58(),
                },
            },
        ];
        return (await this.escrowMarketplaceProgram.account.listingProof.all(filter))[0];
    }

    // --------------------------------------- find all PDA addresses

    // --------------------------------------- ixs

    async createListing(seller: PublicKey, sellerToken: PublicKey, nftMint: PublicKey, sellerListingPrice: number) {
        const [escrowTokenAccount] = await this.findProgramAddress(
            [sellerToken.toBytes(), Buffer.from(anchor.utils.bytes.utf8.encode('escrow-token'))],
            this.escrowMarketplaceProgram.programId
        );

        const [listingProofPda, listingProofAccountBump] = await this.findProgramAddress(
            [sellerToken.toBytes()],
            this.escrowMarketplaceProgram.programId
        );

        const txSig = await this.escrowMarketplaceProgram.methods
            .createListing(toBN(sellerListingPrice), listingProofAccountBump)
            .accounts({
                seller: seller,
                sellerToken,
                nftMint,
                listingProof: listingProofPda,
                escrowToken: escrowTokenAccount,
            })
            .rpc();

        return { txSig, listingProofPda };
    }

    async cancelListing(seller: PublicKey, escrowToken: PublicKey, nftMint: PublicKey) {
        return ;
    }

    async purchaseListing(buyerKey: PublicKey, sellerKey: PublicKey, escrowToken: PublicKey, nftMint: PublicKey) {
        const buyerTokenPda = await this.findATA(nftMint, buyerKey);
        const preIxs: anchor.web3.TransactionInstruction[] = [];
        const buyerTokenAccountExists = await this.conn.getAccountInfo(buyerTokenPda);
        if (!buyerTokenAccountExists) {
            preIxs.push(this.createAssociatedTokenAccountInstruction(buyerTokenPda, buyerKey, buyerKey, nftMint));
        }

        const listingProofPda = (await this.fetchListingProofAccByEscrowToken(escrowToken)).publicKey;

        const txSig = await this.escrowMarketplaceProgram.methods
            .purchaseListing()
            .accounts({
                buyer: buyerKey,
                buyerToken: buyerTokenPda,
                nftMint,
                seller: sellerKey,
                listingProof: listingProofPda,
                escrowToken,
            })
            .preInstructions(preIxs)
            .rpc();

        return { txSig, buyerTokenPda };
    }
}
