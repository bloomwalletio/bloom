import { get } from 'svelte/store'
import { INode } from '@iota/sdk/out/types'

import { IAccountState } from '@core/account/interfaces'
import { activeProfile } from '@core/profile/stores'

import { registerProposalsForAccounts } from './registerProposalsForAccounts'
import { logAndNotifyError } from '@core/error/actions'
import { IError } from '@core/error'

export async function registerProposalsFromNodes(accounts: IAccountState[], nodes?: INode[]): Promise<void> {
    try {
        const _nodes = nodes ?? get(activeProfile)?.clientOptions?.nodes
        if (_nodes) {
            await Promise.all(_nodes.map((node) => registerProposalsForAccounts({ node }, accounts)))
        }
    } catch (err) {
        logAndNotifyError({
            type: 'error',
            message: (err as IError).error ?? 'Error in register proposals',
            saveToErrorLog: true,
            showNotification: false,
        })
    }
}
