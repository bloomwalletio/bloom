import type {
    AliasId,
    Client,
    CreateAccountPayload,
    FoundryId,
    NftId,
    OutputId,
    TransactionId,
    WalletOptions,
} from '@iota/sdk'

import { IAccount } from '@core/account'

import { IProfileManager } from './profile-manager.interface'
import { RecoverAccountsPayload } from './recover-account-payload.interface'
import { IAuth, INodeInfoResponse } from '@core/network'

export interface IApi {
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    createWallet(id: string, options: WalletOptions): Promise<IProfileManager>
    deleteWallet(id: string): void
    getAccount(profileManagerId: string, index: number): Promise<IAccount>
    getAccounts(profileManagerId: string): Promise<IAccount[]>
    getClient(profileManagerId: string): Promise<Client>
    getNodeInfo(profileManagerId: string, url?: string, auth?: IAuth): Promise<INodeInfoResponse>
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
}
