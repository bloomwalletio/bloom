import {
    Bip44,
    IGenerateAddressesOptions,
    LedgerNanoStatus,
    TransactionPayload,
    Secp256k1EcdsaSignature,
    Unlock,
    PreparedTransactionData,
    Ed25519Signature,
} from '@iota/sdk/out/types'

export interface ISecretManager {
    generateEd25519Addresses(generateAddressesOptions: IGenerateAddressesOptions): Promise<string[]>
    generateEvmAddresses(generateAddressesOptions: IGenerateAddressesOptions): Promise<string[]>
    storeMnemonic(mnemonic: string): Promise<void>
    signTransaction(preparedTransactionData: PreparedTransactionData): Promise<TransactionPayload>
    signatureUnlock(transactionEssenceHash: string, chain: Bip44): Promise<Unlock>
    signEd25519(message: string, chain: Bip44): Promise<Ed25519Signature>
    signSecp256k1Ecdsa(message: string, chain: Bip44): Promise<Secp256k1EcdsaSignature>
    getLedgerNanoStatus(): Promise<LedgerNanoStatus>
}
