import type {
    AccountAddress,
    AccountMetadata,
    AddressWithUnspentOutputs,
    AliasOutputParams,
    Balance,
    Burn,
    ConsolidationParams,
    CreateNativeTokenParams,
    FilterOptions,
    FoundryOutput,
    GenerateAddressOptions,
    HexEncodedAmount,
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
    PreparedCreateNativeTokenTransaction,
    PreparedTransaction,
    PreparedTransactionData,
    SendNativeTokensParams,
    SendNftParams,
    SendParams,
    SignedTransactionEssence,
    SyncOptions,
    Transaction,
    TransactionOptions,
} from '@iota/sdk'

export interface IAccount {
    addresses(): Promise<AccountAddress[]>
    addressesWithUnspentOutputs(): Promise<AddressWithUnspentOutputs[]>
    burnNativeToken(
        tokenId: string,
        burnAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    burnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    claimableOutputs(outputs: OutputsToClaim): Promise<string[]>
    claimOutputs(outputIds: string[]): Promise<Transaction>
    deregisterParticipationEvent(eventId: string): Promise<void>
    generateEd25519Addresses(amount: number, options?: GenerateAddressOptions): Promise<AccountAddress[]>
    getBalance(): Promise<Balance>
    getFoundryOutput(tokenId: string): Promise<FoundryOutput>
    getIncomingTransaction(transactionId: string): Promise<Transaction>
    getMetadata(): AccountMetadata
    getOutput(outputId: string): Promise<OutputData>
    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes>
    getParticipationEventIds(node: INode, eventType?: ParticipationEventType): Promise<string[]>
    getParticipationEvents(): Promise<{ [eventId: string]: ParticipationEventMap }>
    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus>
    getParticipationOverview(eventIds?: string[]): Promise<ParticipationOverview>
    getTransaction(transactionId: string): Promise<Transaction>
    incomingTransactions(): Promise<Transaction[]>
    outputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    pendingTransactions(): Promise<Transaction[]>
    prepareBurn(burn: Burn, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    prepareBurnNativeToken(
        tokenId: string,
        burnAmount: bigint,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareBurnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    prepareConsolidateOutputs(params: ConsolidationParams): Promise<PreparedTransaction>
    prepareCreateAliasOutput(
        params?: AliasOutputParams,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareCreateNativeToken(
        params: CreateNativeTokenParams,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedCreateNativeTokenTransaction>
    prepareDecreaseVotingPower(amount: string): Promise<PreparedTransaction>
    prepareDestroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    prepareDestroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    prepareMeltNativeToken(
        tokenId: string,
        meltAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareMintNativeToken(
        tokenId: string,
        mintAmount: bigint,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareMintNfts(params: MintNftParams[], transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    prepareOutput(params: OutputParams, transactionOptions?: TransactionOptions): Promise<Output>
    prepareSend(params: SendParams[], options?: TransactionOptions): Promise<PreparedTransaction>
    prepareSendNativeTokens(
        params: SendNativeTokensParams[],
        options?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareSendNft(params: SendNftParams[], options?: TransactionOptions): Promise<PreparedTransaction>
    prepareStopParticipating(eventId: string): Promise<Transaction>
    prepareTransaction(outputs: Output[], options?: TransactionOptions): Promise<PreparedTransaction>
    prepareVote(eventId?: string, answers?: number[]): Promise<PreparedTransaction>
    prepareVotingPower(amount: string): Promise<PreparedTransaction>
    registerParticipationEvents(options: ParticipationEventRegistrationOptions): Promise<ParticipationEventMap>
    retryTransactionUntilIncluded(transactionId: string, interval?: number, maxAttempts?: number): Promise<string>
    requestFundsFromFaucet(url: string, address: string): Promise<string>
    send(amount: bigint | string, address: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    sendOutputs(outputs: Output[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendWithParams(params: SendParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    setAlias(alias: string): Promise<void>
    setDefaultSyncOptions(options: SyncOptions): Promise<void>
    signAndSubmitTransaction(preparedTransactionData: PreparedTransactionData): Promise<Transaction>
    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence>
    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction>
    sync(options?: SyncOptions): Promise<Balance>
    transactions(): Promise<Transaction[]>
    unspentOutputs(filterOptions?: FilterOptions): Promise<OutputData[]>
}
