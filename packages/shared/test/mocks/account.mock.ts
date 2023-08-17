/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
    AccountAddress,
    AccountMetadata,
    AliasOutputParams,
    Balance,
    Burn,
    ConsolidationParams,
    CreateNativeTokenParams,
    CreateNativeTokenTransaction,
    Ed25519Signature,
    FilterOptions,
    FoundryOutput,
    GenerateAddressOptions,
    HexEncodedString,
    INode,
    MintNftParams,
    Output,
    OutputData,
    OutputParams,
    OutputsToClaim,
    ParticipationEventMap,
    ParticipationEventRegistrationOptions,
    ParticipationEventStatus,
    ParticipationEventType,
    ParticipationEventWithNodes,
    ParticipationOverview,
    PreparedTransaction,
    PreparedTransactionData,
    Secp256k1EcdsaSignature,
    SendNativeTokensParams,
    SendNftParams,
    SendParams,
    SignedTransactionEssence,
    SyncOptions,
    Transaction,
    TransactionOptions,
} from '@iota/sdk'

import { IAccount } from '@core/account/interfaces'

import { MOCK_ACCOUNT_BALANCE } from './account-balance.mock'
import { MOCK_ADDRESS } from './address.mock'

export class AccountMock implements IAccount {
    constructor() {}

    addresses(): Promise<AccountAddress[]> {
        return Promise.resolve([])
    }

    addressesWithUnspentOutputs(): Promise<[]> {
        return Promise.resolve([])
    }

    burnNativeToken(
        tokenId: string,
        burnAmount: string,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    burnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    consolidateOutputs(params: ConsolidationParams): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    claimableOutputs(outputs: OutputsToClaim): Promise<string[]> {
        return Promise.resolve([''])
    }

    claimOutputs(): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    deregisterParticipationEvent(eventId: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    generateEd25519Addresses(amount: number, options?: GenerateAddressOptions): Promise<AccountAddress[]> {
        throw new Error('Method not implemented.')
    }

    getBalance(): Promise<Balance> {
        return Promise.resolve(MOCK_ACCOUNT_BALANCE)
    }

    getFoundryOutput(tokenId: string): Promise<FoundryOutput> {
        throw new Error('Method not implemented.')
    }

    getIncomingTransaction(transactionId: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    getMetadata(): AccountMetadata {
        throw new Error('Method not implemented.')
    }

    getOutput(outputId: string): Promise<OutputData> {
        throw new Error('Method not implemented.')
        // return Promise.resolve({
        //     outputId: '',
        //     outputResponse: {
        //         messageId: '0x2220425c84d8bf4c5e32170b7041ed1784576b31e0334db30f82355367170acf',
        //         transactionId: '0xde579578237d8a41a2a2bb3c58f2bcea3182e4cd2f36e8817dd95d0720b61bfb',
        //         outputIndex: 1,
        //         isSpent: true,
        //         milestoneIndexSpent: 151957,
        //         milestoneTimestampSpent: 1652776064,
        //         transactionIdSpent: '0x3158002b4c706134271afb530ee6d7a24d835819af2c3b536a59b401f931d106',
        //         milestoneIndexBooked: 151950,
        //         milestoneTimestampBooked: 1652775994,
        //         ledgerIndex: 152080,
        //         output: {
        //             type: "Basic",
        //             output: {}
        //         }
        //     },
        //     output: {
        //         type: "Basic",
        //         output: {}
        //     },
        //     amount: 998000000,
        //     isSpent: true,
        //     address: {
        //       type: 'Ed25519',
        //       data: '0x388725b58c207872778d2b6ea58d38e5077ab7cd231f14f7889446a0bd80d67c'
        //     },
        //     networkId: 1020014395361784300,
        //     remainder: true,
        // })
    }

    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes> {
        throw new Error('Method not implemented.')
    }

    getParticipationEventIds(node: INode, eventType?: ParticipationEventType): Promise<string[]> {
        throw new Error('Method not implemented.')
    }

    getParticipationEvents(): Promise<{ [eventId: string]: ParticipationEventMap }> {
        throw new Error('Method not implemented.')
    }

    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus> {
        throw new Error('Method not implemented.')
    }

    getParticipationOverview(eventsIds?: string[]): Promise<ParticipationOverview> {
        throw new Error('Method not implemented.')
    }

    getTransaction(transactionId: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    incomingTransactions(): Promise<Transaction[]> {
        throw new Error('Method not implemented.')
    }

    outputs(filterOptions?: FilterOptions): Promise<[]> {
        return Promise.resolve([])
    }

    pendingTransactions(): Promise<[]> {
        return Promise.resolve([])
    }

    prepareConsolidateOutputs(params: ConsolidationParams): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareCreateAliasOutput(
        params?: AliasOutputParams,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareBurn(burn: Burn, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareBurnNativeToken(
        tokenId: string,
        burnAmount: bigint,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareBurnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareCreateNativeToken(
        params?: CreateNativeTokenParams,
        transactionOptions?: TransactionOptions
    ): Promise<CreateNativeTokenTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareDecreaseVotingPower(amount: string): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareDestroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareDestroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareMeltNativeToken(
        tokenId: string,
        meltAmount: string,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareMintNativeToken(
        tokenId: string,
        mintAmount: bigint,
        transferOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareMintNfts(params: MintNftParams[], transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareOutput(options: OutputParams, transactionOptions?: TransactionOptions): Promise<Output> {
        throw new Error('Method not implemented.')
    }

    prepareSend(params: SendParams[], options?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareSendNativeTokens(
        params: SendNativeTokensParams[],
        options?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareSendNft(params: SendNftParams[], options?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareStopParticipating(eventId: string): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareTransaction(outputs: Output[], options?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareVote(eventId?: string, answers?: number[]): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareVotingPower(amount: string): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    registerParticipationEvents(options: ParticipationEventRegistrationOptions): Promise<ParticipationEventMap> {
        throw new Error('Method not implemented.')
    }

    retryTransactionUntilIncluded(transactionId: string, interval?: number, maxAttempts?: number): Promise<string> {
        throw new Error('Method not implemented.')
    }

    requestFundsFromFaucet(url: string, address: string): Promise<string> {
        throw new Error('Method not implemented.')
    }

    send(amount: bigint | string, address: string, transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendOutputs(outputs: Output[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendWithParams(params: SendParams[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    setAlias(alias: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    setDefaultSyncOptions(options: SyncOptions): Promise<void> {
        throw new Error('Method not implemented.')
    }

    signAndSubmitTransaction(preparedTransactionData: PreparedTransactionData): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence> {
        throw new Error('Method not implemented.')
    }

    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sync(options?: SyncOptions): Promise<Balance> {
        throw new Error('Method not implemented.')
    }

    transactions(): Promise<Transaction[]> {
        return Promise.resolve([])
    }

    unspentOutputs(filterOptions?: FilterOptions): Promise<OutputData[]> {
        return Promise.resolve([])
    }
    verifyEd25519Signature(signature: Ed25519Signature, message: HexEncodedString): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    verifySecp256k1EcdsaSignature(signature: Secp256k1EcdsaSignature, message: HexEncodedString): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
}
