import * as WalletApi from '@iota/wallet'
import type { CreateAccountPayload, SyncOptions } from '@iota/wallet/out/types'

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
        manager.id = id
        profileManagers[id] = manager
        bindMethodsAcrossContextBridge(WalletApi.AccountManager.prototype, manager)
        return manager
    },
    async createAccount(managerId: string, payload: CreateAccountPayload): Promise<unknown> {
        const manager = profileManagers[managerId]
        const account = await manager.createAccount(payload)
        bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
        return account
    },
    deleteAccountManager(id: string): void {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    async getAccount(managerId: string, index: number): Promise<unknown> {
        const manager = profileManagers[managerId]
        const account = await manager.getAccount(index)
        bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account)
        return account
    },
    async getAccounts(managerId: string): Promise<unknown> {
        const manager = profileManagers[managerId]
        const accounts = await manager.getAccounts()
        accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
        return accounts
    },
    async recoverAccounts(managerId: string, payload: PayloadType): Promise<unknown> {
        const manager = profileManagers[managerId]
        const accounts = await manager.recoverAccounts(
            payload.accountStartIndex,
            payload.accountGapLimit,
            payload.addressGapLimit,
            payload.syncOptions
        )
        accounts.forEach((account) => bindMethodsAcrossContextBridge(WalletApi.Account.prototype, account))
        return accounts
    },
    migrateStrongholdSnapshotV2ToV3(currentPath: string, newPath: string, currentPassword: string, newPassword: string): unknown {
        return WalletApi.migrateStrongholdSnapshotV2ToV3(currentPath, newPath, currentPassword, newPassword)
    },
}

function bindMethodsAcrossContextBridge(prototype: unknown, object: object): void {
    const prototypeProperties = Object.getOwnPropertyNames(prototype)
    prototypeProperties.forEach((key) => {
        if (key !== 'constructor') {
            object[key] = object[key].bind(object)
        }
    })
}
