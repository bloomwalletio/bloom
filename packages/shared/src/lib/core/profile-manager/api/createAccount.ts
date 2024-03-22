import { get, Writable } from 'svelte/store'

import { CreateAccountPayload } from '@iota/sdk/out/types'

import { IAccount } from '@core/account'

import { api, IProfileManager, profileManager } from '..'

export function createAccount(
    payload: CreateAccountPayload,
    manager: Writable<IProfileManager | undefined> = profileManager
): Promise<IAccount> {
    const { id } = get(manager) ?? {}
    if (!id) {
        return Promise.reject('Manager ID is undefined!')
    }
    return api.createAccount(id, payload)
}
