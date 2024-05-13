import type {
    AliasId,
    Client,
    CreateAccountPayload,
    FoundryId,
    HexEncodedString,
    IAuth,
    IRent,
    NftId,
    Output,
    OutputId,
    TransactionId,
    WalletOptions,
} from '@iota/sdk'

import type { IAccount } from '@core/account/interfaces'
import type { INodeInfoResponse } from '@core/network/interfaces'
import type { ISecretManager } from '@core/secret-manager/interfaces'

import type { IProfileManager } from './profile-manager.interface'
import type { RecoverAccountsPayload } from './recover-account-payload.interface'

export interface IApi {
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    createWallet(id: string, options: WalletOptions): Promise<IProfileManager>
    deleteWallet(id: string): void
    getAccount(profileManagerId: string, index: number): Promise<IAccount>
    getAccounts(profileManagerId: string): Promise<IAccount[]>
    getClient(profileManagerId: string): Promise<Client>
    getNodeInfo(profileManagerId: string, url?: string, auth?: IAuth): Promise<INodeInfoResponse | undefined>
    getSecretManager(profileManagerId: string): Promise<ISecretManager>
    recoverAccounts(profileManagerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]>
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        currentPassword: string,
        newPath: string,
        newPassword: string
    ): Promise<void>
    // Mapped from sdk#Utils
    generateMnemonic(): Promise<string>
    verifyMnemonic(mnemonic: string): Promise<void>
    hexToBech32(hex: string, bech32Hrp: string): string
    bech32ToHex(bech32: string): string
    computeAliasId(outputId: string): AliasId
    computeFoundryId(aliasId: AliasId, serialNumber: number, tokenSchemeType: number): Promise<FoundryId>
    computeNftId(outputId: string): NftId
    hexPublicKeyToBech32Address(hex: string, bech32Hrp: string): string
    aliasIdToBech32(aliasId: string, bech32Hrp: string): string
    nftIdToBech32(nftId: string, bech32Hrp: string): string
    computeOutputId(id: TransactionId, index: number): Promise<OutputId>
    computeStorageDeposit(output: Output, rent: IRent): Promise<OutputId>
    outputHexBytes(output: Output): Promise<HexEncodedString>
}
