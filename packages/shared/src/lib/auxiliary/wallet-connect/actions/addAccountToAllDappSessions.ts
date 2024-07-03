import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { get } from 'svelte/store'
import { ISupportedNamespace } from '../types'
import { getWalletClient, walletClient } from '../stores'
import { EvmNetworkId } from '@core/network/types'
import { buildCaip10Address } from '../utils'
import { connectedDapps } from '../stores'

export async function addAccountToAllDappSessions(account: IAccountState): Promise<void> {
    const dapps = get(connectedDapps)
    for (const dapp of dapps) {
        if (dapp.sessionTopic && dapp.namespaces) {
            await addAccountForDappSession(dapp.sessionTopic, dapp.namespaces, account)
        }
    }
}

export async function addAccountForDappSession(
    sessionTopic: string,
    namespaces: Record<string, ISupportedNamespace>,
    account: IAccountState
): Promise<void> {
    const walletConnectClient = get(walletClient)
    if (!walletConnectClient) {
        return
    }

    const protocols = Object.keys(namespaces ?? {})
    for (const protocol of protocols) {
        if (!namespaces[protocol]) {
            continue
        }

        const chainsForSession = (namespaces[protocol].chains ?? []) as EvmNetworkId[]
        const addressOfAccountForEachChain = chainsForSession
            .map((chainId) => {
                const address = getAddressFromAccountForNetwork(account, chainId)
                return address ? buildCaip10Address(address, chainId) : undefined
            })
            .filter(Boolean) as string[]

        namespaces[protocol].accounts = [...addressOfAccountForEachChain, ...namespaces[protocol].accounts]
    }

    await getWalletClient()?.updateSession({ topic: sessionTopic, namespaces })
}
