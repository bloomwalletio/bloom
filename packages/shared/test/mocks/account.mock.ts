/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
    HexEncodedString,
    AliasOutput,
    BasicOutput,
    FoundryOutput,
    NftOutput,
    Output,
    Balance,
    AccountMetadata,
    Address,
    SendNativeTokensParams,
    SendNftParams,
    SendParams,
    AliasOutputParams,
    BuildAliasOutputData,
    BuildBasicOutputData,
    BuildFoundryOutputData,
    BuildNftOutputData,
    FilterOptions,
    IGenerateAddressesOptions,
    INode,
    OutputData,
    OutputParams,
    OutputsToClaim,
    ParticipationEventRegistrationOptions,
    ParticipationEventStatus,
    ParticipationEventType,
    ParticipationEventWithNodes,
    ParticipationOverview,
    PreparedTransactionData,
    SignedTransactionEssence,
    Transaction,
    TransactionOptions,
    SyncOptions,
    MintNftParams,
    CreateNativeTokenTransaction,
    CreateNativeTokenParams,
    GenerateAddressOptions,
    Bip44,
    Ed25519Signature,
    Secp256k1EcdsaSignature,
} from '@iota/sdk'

import { IAccount } from '@core/account/interfaces'

import { MOCK_ACCOUNT_BALANCE } from './account-balance.mock'
import { MOCK_ADDRESS } from './address.mock'

export class AccountMock implements IAccount {
    constructor() {}

    addresses(): Promise<[]> {
        return Promise.resolve([])
    }

    addressesWithUnspentOutputs(): Promise<[]> {
        return Promise.resolve([])
    }

    buildAliasOutput(data: BuildAliasOutputData): Promise<AliasOutput> {
        throw new Error('Method not implemented.')
    }

    buildBasicOutput(data: BuildBasicOutputData): Promise<BasicOutput> {
        throw new Error('Method not implemented.')
    }

    buildFoundryOutput(data: BuildFoundryOutputData): Promise<FoundryOutput> {
        throw new Error('Method not implemented.')
    }

    buildNftOutput(data: BuildNftOutputData): Promise<NftOutput> {
        throw new Error('Method not implemented.')
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

    consolidateOutputs(force: boolean, outputConsolidationThreshold?: number): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    claimOutputs(): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    createAliasOutput(params?: AliasOutputParams, transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    createNativeTokens(
        params?: CreateNativeTokenParams,
        transactionOptions?: TransactionOptions
    ): Promise<CreateNativeTokenTransaction> {
        throw new Error('Method not implemented.')
    }

    meltNativeToken(
        tokenId: string,
        meltAmount: string,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    decreaseVotingPower(amount: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    deregisterParticipationEvent(eventId: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    destroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    destroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    getBalance(): Promise<Balance> {
        return Promise.resolve(MOCK_ACCOUNT_BALANCE)
    }

    getFoundryOutput(tokenId: string): Promise<FoundryOutput> {
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

    claimableOutputs(outputs: OutputsToClaim): Promise<string[]> {
        return Promise.resolve([''])
    }

    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes> {
        throw new Error('Method not implemented.')
    }

    getParticipationEventIds(node: INode, eventType?: ParticipationEventType): Promise<string[]> {
        throw new Error('Method not implemented.')
    }

    getParticipationEvents(): Promise<{ [eventId: string]: ParticipationEventWithNodes }> {
        throw new Error('Method not implemented.')
    }

    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus> {
        throw new Error('Method not implemented.')
    }

    getParticipationOverview(): Promise<ParticipationOverview> {
        throw new Error('Method not implemented.')
    }

    incomingTransactions(): Promise<Transaction[]> {
        throw new Error('Method not implemented.')
    }

    increaseNativeTokenSupply(
        tokenId: string,
        mintAmount: string,
        transactionOptions?: TransactionOptions
    ): Promise<CreateNativeTokenTransaction> {
        throw new Error('Method not implemented.')
    }

    increaseVotingPower(amount: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    minimumRequiredStorageDeposit(output: Output): Promise<string> {
        throw new Error('Method not implemented.')
    }

    outputs(filterOptions?: FilterOptions): Promise<[]> {
        return Promise.resolve([])
    }

    pendingTransactions(): Promise<[]> {
        return Promise.resolve([])
    }

    prepareSend(params: SendParams[], options?: TransactionOptions): Promise<PreparedTransactionData> {
        throw new Error('Method not implemented.')
    }

    prepareTransaction(outputs: Output[], options?: TransactionOptions): Promise<PreparedTransactionData> {
        throw new Error('Method not implemented.')
    }

    generateEd25519Address(options?: GenerateAddressOptions): Promise<Address> {
        return Promise.resolve(MOCK_ADDRESS)
    }

    generateEvmAddresses(generateAddressesOptions: IGenerateAddressesOptions): Promise<string[]> {
        throw new Error('Method not implemented.')
    }

    getIncomingTransaction(transactionId: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    mintNativeToken(
        params: CreateNativeTokenParams,
        transferOptions?: TransactionOptions
    ): Promise<CreateNativeTokenParams> {
        throw new Error('Method not implemented.')
    }

    mintNfts(params: MintNftParams[], transferOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    prepareOutput(options: OutputParams, transactionOptions?: TransactionOptions): Promise<Output> {
        throw new Error('Method not implemented.')
    }

    getTransaction(transactionId: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    registerParticipationEvents(
        options: ParticipationEventRegistrationOptions
    ): Promise<{ [eventId: string]: ParticipationEventWithNodes }> {
        throw new Error('Method not implemented.')
    }

    retryTransactionUntilIncluded(
        transactionId: string,
        interval?: number,
        maxAttempts?: number
    ): Promise<PreparedTransactionData> {
        throw new Error('Method not implemented.')
    }

    requestFundsFromFaucet(url: string, address: string): Promise<string> {
        throw new Error('Method not implemented.')
    }

    send(params: SendParams[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendNativeTokens(params: SendNativeTokensParams[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendNft(params: SendNftParams[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendOutputs(outputs: Output[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    setAlias(alias: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    signSecp256k1Ecdsa(message: HexEncodedString, chain: Bip44): Promise<Secp256k1EcdsaSignature> {
        throw new Error('Method not implemented.')
    }

    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence> {
        throw new Error('Method not implemented.')
    }

    stopParticipating(eventId: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sync(options?: SyncOptions): Promise<Balance> {
        throw new Error('Method not implemented.')
    }

    transactions(): Promise<[]> {
        return Promise.resolve([])
    }

    unspentOutputs(filterOptions?: FilterOptions): Promise<[]> {
        return Promise.resolve([])
    }
    verifyEd25519Signature(signature: Ed25519Signature, message: HexEncodedString): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    verifySecp256k1EcdsaSignature(signature: Secp256k1EcdsaSignature, message: HexEncodedString): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    vote(eventId?: string, answers?: number[]): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }
}
