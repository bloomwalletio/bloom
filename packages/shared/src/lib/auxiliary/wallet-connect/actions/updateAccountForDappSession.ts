import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { get } from 'svelte/store'
import { WalletConnectEvents } from '../enums'
import { ISupportedNamespace } from '../types'
import { getWalletClient, walletClient } from '../stores'
import { EvmNetworkId } from '@core/network/types'
import { buildCaip10Address, doesNamespaceSupportEvent } from '../utils'

export async function updateAccountForDappSession(
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
        if (
            !namespaces[protocol] ||
            !doesNamespaceSupportEvent(namespaces[protocol], WalletConnectEvents.AccountsChanged)
        ) {
            continue
        }

        const chainsForSession = (namespaces[protocol].chains ?? []) as EvmNetworkId[]
        const addressOfAccountForEachChain = chainsForSession
            .map((chainId) => {
                const address = getAddressFromAccountForNetwork(account, chainId)
                return address ? buildCaip10Address(address, chainId) : undefined
            })
            .filter(Boolean) as string[]

        const sortedAccountsForNamespace = namespaces[protocol].accounts.sort((a, b) => {
            const aIsThisAccount = addressOfAccountForEachChain.includes(a)
            const bIsThisAccount = addressOfAccountForEachChain.includes(b)

            if (aIsThisAccount && !bIsThisAccount) {
                return -1
            } else if (!aIsThisAccount && bIsThisAccount) {
                return 1
            } else {
                return 0
            }
        })

        namespaces[protocol].accounts = sortedAccountsForNamespace

        for (const chainId of namespaces[protocol]?.chains ?? []) {
            const address = getAddressFromAccountForNetwork(account, chainId as EvmNetworkId)

            await walletConnectClient.emitSessionEvent({
                topic: sessionTopic,
                event: {
                    name: WalletConnectEvents.AccountsChanged,
                    data: [address],
                },
                chainId,
            })
        }
    }

    await getWalletClient()?.updateSession({ topic: sessionTopic, namespaces })
}
