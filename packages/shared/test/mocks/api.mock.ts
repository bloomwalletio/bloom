/* eslint-disable @typescript-eslint/no-unused-vars */

import type { WalletOptions, CreateAccountPayload } from '@iota/sdk'
import { IAccount } from '@core/account'
import { IApi, RecoverAccountsPayload } from '@core/profile-manager'
import { AccountMock } from './account.mock'
import { ProfileManagerMock } from './profile-manager.mock'



export const MOCK_MNEMONIC =
    'term aisle loyal cradle talent buddy crater express asthma load antique game better head position master aspect print more wine sword speed joy story'

const profileManagers = {}

const api: IApi = {
    createWallet(id: string, _: WalletOptions): Promise<ProfileManagerMock> {
        const manager = new ProfileManagerMock(id)

        profileManagers[id] = manager

        return Promise.resolve(manager)
    },
    createAccount(_: string, __: CreateAccountPayload): Promise<IAccount> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
    deleteWallet(id: string) {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    generateMnemonic(): Promise<string> {
        return Promise.resolve(MOCK_MNEMONIC)
    },
    verifyMnemonic(mnemonic: string): Promise<void> {
        return Promise.resolve()
    },
    getAccount(_: string, __: number): Promise<AccountMock> {
        return new Promise((resolve) => {
            resolve(new AccountMock())
        })
    },
    getAccounts(_: string): Promise<AccountMock[]> {
        return new Promise((resolve) => {
            resolve([])
        })
    },
    recoverAccounts(_: string, __: RecoverAccountsPayload): Promise<IAccount[]> {
        return new Promise((resolve) => {
            resolve([])
        })
    },
    migrateStrongholdSnapshotV2ToV3(
        _currentPath: string,
        _newPath: string,
        _currentPassword: string,
        _newPassword: string
    ): Promise<void> {
        return new Promise((resolve) => {
            resolve()
        })
    },
}

window['__WALLET__API__'] = api
