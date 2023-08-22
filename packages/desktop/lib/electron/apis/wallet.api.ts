import * as IotaSdk from '@iota/sdk'
import type { CreateAccountPayload, IAuth, SyncOptions } from '@iota/sdk'

import { bindMethodsAcrossContextBridge, bindSdkUtilsMethods } from '../utils/context-bridge.utils'
import { STRONGHOLD_V2_HASHING_ROUNDS, STRONGHOLD_V2_SALT } from '../constants/stronghold-v2-migration.constants'
import type { INodeInfoResponse } from '@core/network'

interface PayloadType {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions: SyncOptions
}

const profileManagers: { [id: string]: IotaSdk.Wallet } = {}

const sdkUtilsMethods = bindSdkUtilsMethods()

export default {
    ...sdkUtilsMethods,
    async getNodeInfo(managerId: number, url: string, auth: IAuth): Promise<INodeInfoResponse> {
        const manager = profileManagers[managerId]
        const client = await manager.getClient()

        const nodeUrl = url ?? (await client.getNode()).url
        const nodeInfo = await client.getNodeInfo(nodeUrl, auth)

        return {
            url: nodeUrl,
            nodeInfo,
        }
    },
    createWallet(id: string, options: unknown): IotaSdk.Wallet {
        const manager = new IotaSdk.Wallet(options)
        manager['id'] = id
        profileManagers[id] = manager
        return bindMethodsAcrossContextBridge(IotaSdk.Wallet.prototype, manager)
    },
    async createAccount(managerId: string, payload: CreateAccountPayload): Promise<IotaSdk.Account> {
        const manager = profileManagers[managerId]
        const account = await manager.createAccount(payload)
        return bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account)
    },
    deleteWallet(id: string): void {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    async getAccount(managerId: string, index: number): Promise<IotaSdk.Account> {
        const manager = profileManagers[managerId]
        const account = await manager.getAccount(index)
        return bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account)
    },
    async getAccounts(managerId: string): Promise<IotaSdk.Account[]> {
        const manager = profileManagers[managerId]
        const accounts = await manager.getAccounts()
        return accounts.map((account) => bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account))
    },
    async getClient(managerId: string): Promise<IotaSdk.Client> {
        const manager = profileManagers[managerId]
        const client = await manager.getClient()
        return bindMethodsAcrossContextBridge(IotaSdk.Client.prototype, client)
    },
    async recoverAccounts(managerId: string, payload: PayloadType): Promise<IotaSdk.Account[]> {
        const manager = profileManagers[managerId]
        const accounts = await manager.recoverAccounts(
            payload.accountStartIndex,
            payload.accountGapLimit,
            payload.addressGapLimit,
            payload.syncOptions
        )
        return accounts.map((account) => bindMethodsAcrossContextBridge(IotaSdk.Account.prototype, account))
    },
    async getSecretManager(managerId: string): Promise<IotaSdk.SecretManager> {
        const manager = profileManagers[managerId]
        const secretManager = await manager.getSecretManager()
        return bindMethodsAcrossContextBridge(IotaSdk.SecretManager, secretManager)
    },
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        newPath: string,
        currentPassword: string,
        newPassword: string
    ): unknown {
        return IotaSdk.migrateStrongholdSnapshotV2ToV3(
            currentPath,
            newPath,
            STRONGHOLD_V2_SALT,
            STRONGHOLD_V2_HASHING_ROUNDS,
            currentPassword,
            newPassword
        )
    },
}
