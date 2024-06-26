import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { connectedDapps } from '../stores'
import { updateAccountForDappSession } from './updateAccountForDappSession'

export async function updateAccountForConnectedDapps(account: IAccountState): Promise<void> {
    const dapps = get(connectedDapps)
    for (const dapp of dapps) {
        if (dapp.sessionTopic && dapp.namespaces) {
            await updateAccountForDappSession(dapp.sessionTopic, dapp.namespaces, account)
        }
    }
}
