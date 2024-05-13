import {
    Wallet,
    WalletOptions,
    Account,
    Client,
    migrateStrongholdSnapshotV2ToV3,
    SecretManager,
    SyncOptions,
    CreateAccountPayload,
    IAuth,
} from '@iota/sdk'

import { bindMethodsAcrossContextBridge, bindSdkUtilsMethods } from '../utils/context-bridge.utils'
import { STRONGHOLD_V2_HASHING_ROUNDS, STRONGHOLD_V2_SALT } from '../constants/stronghold-v2-migration.constants'
import type { INodeInfoResponse } from '@core/network'

interface PayloadType {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions: SyncOptions
}

const profileManagers: { [id: string]: Wallet } = {}

const sdkUtilsMethods = bindSdkUtilsMethods()

export default {
    ...sdkUtilsMethods,
    async getNodeInfo(managerId: number, url: string, auth: IAuth): Promise<INodeInfoResponse | undefined> {
        try {
            const manager = profileManagers[managerId]
            const client = await manager.getClient()

            const nodeUrl = url ?? (await client.getNode()).url
            const nodeInfo = await client.getNodeInfo(nodeUrl, auth)

            return {
                url: nodeUrl,
                nodeInfo,
            }
        } catch (err) {
            console.error(err)
            return undefined
        }
    },
    createWallet(id: string, options: WalletOptions): Wallet {
        const manager = new Wallet(options)
        manager['id'] = id
        profileManagers[id] = manager
        return bindMethodsAcrossContextBridge(Wallet, manager)
    },
    async createAccount(managerId: string, payload: CreateAccountPayload): Promise<Account> {
        const manager = profileManagers[managerId]
        const account = await manager.createAccount(payload)
        return bindMethodsAcrossContextBridge(Account, account)
    },
    deleteWallet(id: string): void {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    async getAccount(managerId: string, index: number): Promise<Account> {
        const manager = profileManagers[managerId]
        const account = await manager.getAccount(index)
        return bindMethodsAcrossContextBridge(Account, account)
    },
    async getAccounts(managerId: string): Promise<Account[]> {
        const manager = profileManagers[managerId]
        const accounts = await manager.getAccounts()
        return accounts.map((account) => bindMethodsAcrossContextBridge(Account, account))
    },
    async getClient(managerId: string): Promise<Client> {
        const manager = profileManagers[managerId]
        const client = await manager.getClient()
        return bindMethodsAcrossContextBridge(Client, client)
    },
    async recoverAccounts(managerId: string, payload: PayloadType): Promise<Account[]> {
        const manager = profileManagers[managerId]
        const accounts = await manager.recoverAccounts(
            payload.accountStartIndex,
            payload.accountGapLimit,
            payload.addressGapLimit,
            payload.syncOptions
        )
        return accounts.map((account) => bindMethodsAcrossContextBridge(Account, account))
    },
    async getSecretManager(managerId: string): Promise<SecretManager> {
        const manager = profileManagers[managerId]
        const secretManager = await manager.getSecretManager()
        return bindMethodsAcrossContextBridge(SecretManager, secretManager)
    },
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        newPath: string,
        currentPassword: string,
        newPassword: string
    ): unknown {
        return migrateStrongholdSnapshotV2ToV3(
            currentPath,
            newPath,
            STRONGHOLD_V2_SALT,
            STRONGHOLD_V2_HASHING_ROUNDS,
            currentPassword,
            newPassword
        )
    },
}
