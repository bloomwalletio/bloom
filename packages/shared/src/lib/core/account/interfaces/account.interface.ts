import type {
    HexEncodedAmount,
    HexEncodedString,
    AliasOutput,
    BasicOutput,
    FoundryOutput,
    NftOutput,
    Output,
    AccountMetadata,
    Address,
    AddressWithUnspentOutputs,
    AliasOutputParams,
    Balance,
    Bip44,
    BuildAliasOutputData,
    BuildBasicOutputData,
    BuildFoundryOutputData,
    BuildNftOutputData,
    ConsolidationParams,
    CreateNativeTokenParams,
    CreateNativeTokenTransaction,
    Ed25519Signature,
    FilterOptions,
    GenerateAddressOptions,
    MintNftParams,
    IGenerateAddressesOptions,
    INode,
    OutputData,
    OutputParams,
    OutputsToClaim,
    ParticipationEventMap,
    ParticipationEventRegistrationOptions,
    ParticipationEventStatus,
    ParticipationEventType,
    ParticipationEventWithNodes,
    ParticipationOverview,
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

export interface IAccount {
    addresses(): Promise<Address[]>
    addressesWithUnspentOutputs(): Promise<AddressWithUnspentOutputs[]>
    buildAliasOutput(data: BuildAliasOutputData): Promise<AliasOutput>
    buildBasicOutput(data: BuildBasicOutputData): Promise<BasicOutput>
    buildFoundryOutput(data: BuildFoundryOutputData): Promise<FoundryOutput>
    buildNftOutput(data: BuildNftOutputData): Promise<NftOutput>
    burnNativeToken(
        tokenId: string,
        burnAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    burnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    claimOutputs(outputIds: string[]): Promise<Transaction>
    createNativeToken(
        params: CreateNativeTokenParams,
        transactionOptions?: TransactionOptions
    ): Promise<CreateNativeTokenTransaction>
    consolidateOutputs(params: ConsolidationParams): Promise<Transaction>
    createAliasOutput(params?: AliasOutputParams, transactionOptions?: TransactionOptions): Promise<Transaction>
    meltNativeToken(
        tokenId: string,
        meltAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    decreaseVotingPower(amount: string): Promise<Transaction>
    deregisterParticipationEvent(eventId: string): Promise<void>
    destroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    destroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    generateEd25519Address(options?: GenerateAddressOptions): Promise<Address>
    generateEvmAddresses(generateAddressesOptions: IGenerateAddressesOptions): Promise<string[]>
    getBalance(): Promise<Balance>
    getFoundryOutput(tokenId: string): Promise<FoundryOutput>
    getIncomingTransaction(transactionId: string): Promise<Transaction>
    getMetadata(): AccountMetadata
    getOutput(outputId: string): Promise<OutputData>
    claimableOutputs(outputs: OutputsToClaim): Promise<string[]>
    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes>
    getParticipationEventIds(node: INode, eventType?: ParticipationEventType): Promise<string[]>
    getParticipationEvents(): Promise<{ [eventId: string]: ParticipationEventWithNodes }>
    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus>
    getParticipationOverview(eventIds?: string[]): Promise<ParticipationOverview>
    getTransaction(transactionId: string): Promise<Transaction>
    incomingTransactions(): Promise<Transaction[]>
    increaseVotingPower(amount: string): Promise<Transaction>
    minimumRequiredStorageDeposit(output: Output): Promise<string>
    mintNativeToken(
        tokenId: string,
        mintAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<CreateNativeTokenTransaction>
    mintNfts(params: MintNftParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    outputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    prepareOutput(params: OutputParams, transactionOptions?: TransactionOptions): Promise<Output>
    pendingTransactions(): Promise<Transaction[]>
    prepareSend(params: SendParams[], options?: TransactionOptions): Promise<PreparedTransactionData>
    prepareTransaction(outputs: Output[], options?: TransactionOptions): Promise<PreparedTransactionData>
    registerParticipationEvents(options: ParticipationEventRegistrationOptions): Promise<ParticipationEventMap>
    retryTransactionUntilIncluded(
        transactionId: string,
        interval?: number,
        maxAttempts?: number
    ): Promise<PreparedTransactionData>
    requestFundsFromFaucet(url: string, address: string): Promise<string>
    send(params: SendParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendNativeTokens(params: SendNativeTokensParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendNft(params: SendNftParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendOutputs(outputs: Output[], transactionOptions?: TransactionOptions): Promise<Transaction>
    setAlias(alias: string): Promise<void>
    setDefaultSyncOptions(options: SyncOptions): Promise<void>
    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence>
    signSecp256k1Ecdsa(message: HexEncodedString, chain: Bip44): Promise<Secp256k1EcdsaSignature>
    stopParticipating(eventId: string): Promise<Transaction>
    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction>
    sync(options?: SyncOptions): Promise<Balance>
    transactions(): Promise<Transaction[]>
    unspentOutputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    verifyEd25519Signature(signature: Ed25519Signature, message: HexEncodedString): Promise<boolean>
    verifySecp256k1EcdsaSignature(signature: Secp256k1EcdsaSignature, message: HexEncodedString): Promise<boolean>
    vote(eventId?: string, answers?: number[]): Promise<Transaction>
}
