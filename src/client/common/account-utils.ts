import { associatedAddress, ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export class AccountUtils {
    conn: Connection;

    constructor(conn: Connection) {
        this.conn = conn;
    }

    // --------------------------------------- PDA

    async findProgramAddress(
        seeds: (PublicKey | Uint8Array | string)[],
        programId: PublicKey
    ): Promise<[PublicKey, number]> {
        const seed_bytes = seeds.map((s) => {
            if (typeof s == 'string') {
                return Buffer.from(s);
            } else if ('toBytes' in s) {
                return s.toBytes();
            } else {
                return s;
            }
        });
        return await PublicKey.findProgramAddress(seed_bytes, programId);
    }

    // --------------------------------------- Normal account

    async getBalance(publicKey: PublicKey): Promise<number> {
        return this.conn.getBalance(publicKey);
    }

    async findATA(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
        return associatedAddress({
            mint,
            owner,
        });
    }

    createAssociatedTokenAccountInstruction(
      associatedTokenAddress: anchor.web3.PublicKey,
      payer: anchor.web3.PublicKey,
      walletAddress: anchor.web3.PublicKey,
      splTokenMintAddress: anchor.web3.PublicKey,
    ) {
      const keys = [
        {
          pubkey: payer,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: associatedTokenAddress,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: walletAddress,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: splTokenMintAddress,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: SYSVAR_RENT_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ];
      return new TransactionInstruction({
        keys,
        programId: ASSOCIATED_PROGRAM_ID,
        data: Buffer.from([]),
      });
    }
}
