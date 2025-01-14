import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptAccount,
} from "@solana/spl-token";
import {
  Connection,
  FetchMiddleware,
  VersionedMessage,
  PublicKey,
  sendAndConfirmRawTransaction,
  SignaturesForAddressOptions,
  StakeProgram,
  TransactionInstruction,
  ComputeBudgetProgram,
  VersionedTransaction,
  TransactionMessage,
} from "@solana/web3.js";
import { makeLRUCache, minutes } from "@ledgerhq/live-network/cache";
import { getEnv } from "@ledgerhq/live-env";
import { NetworkError } from "@ledgerhq/errors";
import { Awaited } from "../../logic";
import { getStakeActivation } from "./stake-activation";

export const LATEST_BLOCKHASH_MOCK = "EEbZs6DmDyDjucyYbo3LwVJU7pQYuVopYcYTSEZXskW3";

export type Config = {
  readonly endpoint: string;
};

export type ChainAPI = Readonly<{
  getBalance: (address: string) => Promise<number>;

  getLatestBlockhash: () => Promise<string>;

  getFeeForMessage: (message: VersionedMessage) => Promise<number | null>;

  getBalanceAndContext: (address: string) => ReturnType<Connection["getBalanceAndContext"]>;

  getParsedTokenAccountsByOwner: (
    address: string,
  ) => ReturnType<Connection["getParsedTokenAccountsByOwner"]>;

  getStakeAccountsByStakeAuth: (
    authAddr: string,
  ) => ReturnType<Connection["getParsedProgramAccounts"]>;

  getStakeAccountsByWithdrawAuth: (
    authAddr: string,
  ) => ReturnType<Connection["getParsedProgramAccounts"]>;

  getStakeActivation: (stakeAccAddr: string) => ReturnType<typeof getStakeActivation>;

  getInflationReward: (addresses: string[]) => ReturnType<Connection["getInflationReward"]>;

  getVoteAccounts: () => ReturnType<Connection["getVoteAccounts"]>;

  getSignaturesForAddress: (
    address: string,
    opts?: SignaturesForAddressOptions,
  ) => ReturnType<Connection["getSignaturesForAddress"]>;

  getParsedTransactions: (signatures: string[]) => ReturnType<Connection["getParsedTransactions"]>;

  getAccountInfo: (
    address: string,
  ) => Promise<Awaited<ReturnType<Connection["getParsedAccountInfo"]>>["value"]>;

  sendRawTransaction: (buffer: Buffer) => ReturnType<Connection["sendRawTransaction"]>;

  findAssocTokenAccAddress: (owner: string, mint: string) => Promise<string>;

  getAssocTokenAccMinNativeBalance: () => Promise<number>;

  getMinimumBalanceForRentExemption: (dataLength: number) => Promise<number>;

  getEpochInfo: () => ReturnType<Connection["getEpochInfo"]>;

  getRecentPrioritizationFees: (
    accounts: string[],
  ) => ReturnType<Connection["getRecentPrioritizationFees"]>;

  getSimulationComputeUnits: (
    instructions: Array<TransactionInstruction>,
    payer: PublicKey,
  ) => Promise<number | null>;

  config: Config;
}>;

// Naive mode, allow us to filter in sentry all this error comming from Sol RPC node
const remapErrors = (e: Error) => {
  throw new NetworkError(e?.message);
};

export function getChainAPI(
  config: Config,
  logger?: (url: string, options: any) => void,
): ChainAPI {
  const fetchMiddleware: FetchMiddleware | undefined =
    logger === undefined
      ? undefined
      : (url, options, fetch) => {
          logger(url.toString(), options);
          fetch(url, options);
        };

  const connection = () => {
    return new Connection(config.endpoint, {
      ...(fetchMiddleware ? { fetchMiddleware } : {}),
      commitment: "finalized",
      confirmTransactionInitialTimeout: getEnv("SOLANA_TX_CONFIRMATION_TIMEOUT") || 0,
    });
  };

  return {
    getBalance: (address: string) =>
      connection().getBalance(new PublicKey(address)).catch(remapErrors),

    getLatestBlockhash: () =>
      connection()
        .getLatestBlockhash()
        .then(r => r.blockhash)
        .catch(remapErrors),

    getFeeForMessage: (msg: VersionedMessage) =>
      connection()
        .getFeeForMessage(msg)
        .then(r => r.value)
        .catch(remapErrors),

    getBalanceAndContext: (address: string) =>
      connection().getBalanceAndContext(new PublicKey(address)).catch(remapErrors),

    getParsedTokenAccountsByOwner: (address: string) =>
      connection()
        .getParsedTokenAccountsByOwner(new PublicKey(address), {
          programId: TOKEN_PROGRAM_ID,
        })
        .catch(remapErrors),

    getStakeAccountsByStakeAuth: makeLRUCache(
      (authAddr: string) =>
        connection()
          .getParsedProgramAccounts(StakeProgram.programId, {
            filters: [
              {
                memcmp: {
                  offset: 12,
                  bytes: authAddr,
                },
              },
            ],
          })
          .catch(remapErrors),
      (addr: string) => addr,
      minutes(3),
    ),

    getStakeAccountsByWithdrawAuth: makeLRUCache(
      (authAddr: string) =>
        connection()
          .getParsedProgramAccounts(StakeProgram.programId, {
            filters: [
              {
                memcmp: {
                  offset: 44,
                  bytes: authAddr,
                },
              },
            ],
          })
          .catch(remapErrors),
      (addr: string) => addr,
      minutes(3),
    ),

    getStakeActivation: (stakeAccAddr: string) =>
      getStakeActivation(connection(), new PublicKey(stakeAccAddr)).catch(remapErrors),

    getInflationReward: (addresses: string[]) =>
      connection()
        .getInflationReward(addresses.map(addr => new PublicKey(addr)))
        .catch(remapErrors),

    getVoteAccounts: () => connection().getVoteAccounts().catch(remapErrors),

    getSignaturesForAddress: (address: string, opts?: SignaturesForAddressOptions) =>
      connection().getSignaturesForAddress(new PublicKey(address), opts).catch(remapErrors),

    getParsedTransactions: (signatures: string[]) =>
      connection()
        .getParsedTransactions(signatures, {
          maxSupportedTransactionVersion: 0,
        })
        .catch(remapErrors),

    getAccountInfo: (address: string) =>
      connection()
        .getParsedAccountInfo(new PublicKey(address))
        .then(r => r.value)
        .catch(remapErrors),

    sendRawTransaction: (buffer: Buffer) => {
      return sendAndConfirmRawTransaction(connection(), buffer, {
        commitment: "confirmed",
      }).catch(remapErrors);
    },

    findAssocTokenAccAddress: (owner: string, mint: string) => {
      return getAssociatedTokenAddress(new PublicKey(mint), new PublicKey(owner))
        .then(r => r.toBase58())
        .catch(remapErrors);
    },

    getAssocTokenAccMinNativeBalance: () =>
      getMinimumBalanceForRentExemptAccount(connection()).catch(remapErrors),

    getMinimumBalanceForRentExemption: (dataLength: number) =>
      connection().getMinimumBalanceForRentExemption(dataLength).catch(remapErrors),

    getEpochInfo: () => connection().getEpochInfo().catch(remapErrors),

    getRecentPrioritizationFees: (accounts: string[]) => {
      return connection()
        .getRecentPrioritizationFees({
          lockedWritableAccounts: accounts.map(acc => new PublicKey(acc)),
        })
        .catch(remapErrors);
    },

    getSimulationComputeUnits: async (instructions, payer) => {
      // https://solana.com/developers/guides/advanced/how-to-request-optimal-compute
      const testInstructions = [
        // Set an arbitrarily high number in simulation
        // so we can be sure the transaction will succeed
        // and get the real compute units used
        ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
        ...instructions,
      ];
      const testTransaction = new VersionedTransaction(
        new TransactionMessage({
          instructions: testInstructions,
          payerKey: payer,
          // RecentBlockhash can by any public key during simulation
          // since 'replaceRecentBlockhash' is set to 'true' below
          recentBlockhash: PublicKey.default.toString(),
        }).compileToV0Message(),
      );
      const rpcResponse = await connection().simulateTransaction(testTransaction, {
        replaceRecentBlockhash: true,
        sigVerify: false,
      });
      return rpcResponse.value.err ? null : rpcResponse.value.unitsConsumed || null;
    },

    config,
  };
}
