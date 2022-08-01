import { BN } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';

export function isKp(toCheck: PublicKey | Keypair) {
  return typeof (<Keypair>toCheck).publicKey !== 'undefined';
}

export function toByteArray(i: any): Buffer {
  return toBN(i).toArrayLike(Buffer, 'le', 8)
}

export function toBN(i: any): any {
  if (typeof i == 'number') {
    return new BN(i);
  } else if (i instanceof BN) {
    return i;
  } else if (parseType(i) === 'array') {
    const bnArray = [];

    for (const item in i) {
      bnArray.push(toBN(item));
    }

    return bnArray;
  } else if (parseType(i) === 'object') {
    const bnObj = {};

    for (const field in i) {
      // @ts-ignore
      bnObj[field] = toBN(i[field]);
    }

    return bnObj;
  }

  return i;
}

function parseType<T>(v: T): string {
  if (v === null || v === undefined) {
    return 'null';
  }
  if (typeof v === 'object') {
    if (v instanceof Array) {
      return 'array';
    }
    if (v instanceof Date) {
      return 'date';
    }
    return 'object';
  }
  return typeof v;
}
