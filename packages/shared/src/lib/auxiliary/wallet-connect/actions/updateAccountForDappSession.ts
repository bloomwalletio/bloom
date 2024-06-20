import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { get } from 'svelte/store'
import { WalletConnectEvents } from '../enums'
import { getWalletClient, walletClient } from '../stores'
import { EvmNetworkId } from '@core/network/types'
import { ISession } from '../interface/session.interface'
import { buildCaip10Address, doesNamespaceSupportEvent } from '../utils'

export async function updateAccountForDappSession(dappSession: ISession, account: IAccountState): Promise<void> {
    const walletConnectClient = get(walletClient)
    if (!walletConnectClient || !dappSession) {
        return
    }

    const protocols = Object.keys(dappSession.namespaces)
    for (const protocol of protocols) {
        if (
            !dappSession.namespaces[protocol] ||
            !doesNamespaceSupportEvent(dappSession.namespaces[protocol], WalletConnectEvents.AccountsChanged)
        ) {
            continue
        }

        const chains = (dappSession.namespaces[protocol].chains ?? []) as EvmNetworkId[]
        const accounts = chains
            .map((chainId) => {
                const address = getAddressFromAccountForNetwork(account, chainId)
                return address ? buildCaip10Address(address, chainId) : undefined
            })
            .filter(Boolean) as string[]

        const sortedAccountsForNamespace = dappSession.namespaces[protocol].accounts.sort((a, b) => {
            const aIsInAccounts = accounts.includes(a)
            const bIsInAccounts = accounts.includes(b)

            if (aIsInAccounts && !bIsInAccounts) {
                return -1
            } else if (!aIsInAccounts && bIsInAccounts) {
                return 1
            } else {
                return 0
            }
        })

        dappSession.namespaces[protocol].accounts = sortedAccountsForNamespace

        for (const chainId of dappSession.namespaces[protocol]?.chains ?? []) {
            const address = getAddressFromAccountForNetwork(account, chainId as EvmNetworkId)

            await walletConnectClient.emitSessionEvent({
                topic: dappSession.topic,
                event: {
                    name: WalletConnectEvents.AccountsChanged,
                    data: [address],
                },
                chainId,
            })
        }
    }

    await getWalletClient()?.updateSession({ topic: dappSession.topic, namespaces: dappSession.namespaces })
}
