'use server';
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

const pvKeyStr = process.env.PRIVATE_KEY;

if (!pvKeyStr) {
  throw new Error('Set your env variables');
}

const pvKeyUint8 = bs58.decode(pvKeyStr as string);
const kp = Keypair.fromSecretKey(new Uint8Array(pvKeyUint8));

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const mintAddress = process.env.MINT_ADDRESS;

if (!mintAddress) {
  throw new Error('Set your envs right');
}

export const airdropTokens = async (
  receiverAddress: string,
  tokens: string
) => {
  try {
    const receiverPublicKey = new PublicKey(receiverAddress);
    const amount = (tokens as unknown as number) * LAMPORTS_PER_SOL;

    const sourceAssociatedTokenAccount =
      await getOrCreateAssociatedTokenAccount(
        connection,
        kp,
        new PublicKey(mintAddress),
        kp.publicKey
      );
    console.log(sourceAssociatedTokenAccount.address.toString());

    const destinationAssociatedTokenAccount =
      await getOrCreateAssociatedTokenAccount(
        connection,
        kp,
        new PublicKey(mintAddress),
        receiverPublicKey
      );

    const tx = new Transaction();
    tx.add(
      createTransferInstruction(
        sourceAssociatedTokenAccount.address,
        destinationAssociatedTokenAccount.address,
        kp.publicKey,
        amount
      )
    );

    const latestBlockHash = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = latestBlockHash.blockhash;

    const signature = await sendAndConfirmTransaction(connection, tx, [kp]);
    console.log('Success -> ', signature);

    return {
      message: 'Success',
      ok: true,
      sig: signature,
    };
  } catch (err) {
    return {
      message: 'Failure',
      ok: false,
      sig: '',
    };
  }
};
