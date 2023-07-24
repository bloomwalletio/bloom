import * as WalletApi from '@iota/wallet'
import type { CreateAccountPayload, SyncOptions } from '@iota/wallet/out/types'

import { bindObjectAcrossContextBridge } from '../utils/context-bridge.utils'
import { STRONGHOLD_V2_HASHING_ROUNDS, STRONGHOLD_V2_SALT } from '../constants/stronghold-v2-migration.constants'

interface PayloadType {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions: SyncOptions
}

const profileManagers: { [id: string]: WalletApi.AccountManager } = {}

export default {
    createAccountManager(id: string, options: unknown): unknown {
        const manager = new WalletApi.AccountManager(options)
        manager['id'] = id
        profileManagers[id] = manager
        return bindObjectAcrossContextBridge(WalletApi.AccountManager.prototype, manager)
    },
    async createAccount(managerId: string, payload: CreateAccountPayload): Promise<unknown> {
        const manager = profileManagers[managerId]
        const account = await manager.createAccount(payload)
        return bindObjectAcrossContextBridge(WalletApi.Account.prototype, account)
    },
    deleteAccountManager(id: string): void {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    async getAccount(managerId: string, index: number): Promise<unknown> {
        const manager = profileManagers[managerId]
        const account = await manager.getAccount(index)
        return bindObjectAcrossContextBridge(WalletApi.Account.prototype, account)
    },
    async getAccounts(managerId: string): Promise<unknown> {
        const manager = profileManagers[managerId]
        const accounts = await manager.getAccounts()
        return accounts.map((account) => bindObjectAcrossContextBridge(WalletApi.Account.prototype, account))
    },
    async recoverAccounts(managerId: string, payload: PayloadType): Promise<unknown> {
        const manager = profileManagers[managerId]
        const accounts = await manager.recoverAccounts(
            payload.accountStartIndex,
            payload.accountGapLimit,
            payload.addressGapLimit,
            payload.syncOptions
        )
        return accounts.map((account) => bindObjectAcrossContextBridge(WalletApi.Account.prototype, account))
    },
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        newPath: string,
        currentPassword: string,
        newPassword: string
    ): unknown {
        return WalletApi.migrateStrongholdSnapshotV2ToV3(
            currentPath,
            newPath,
            STRONGHOLD_V2_SALT,
            STRONGHOLD_V2_HASHING_ROUNDS,
            currentPassword,
            newPassword
        )
    },
}
