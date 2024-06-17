import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { get } from 'svelte/store'
import { WalletConnectEvents } from '../enums'
import { walletClient } from '../stores'
import { NetworkId } from '@core/network/types'
import { ISupportedNamespace } from '../types'
import { doesNamespaceSupportEvent } from '../utils'

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

        for (const chainId of namespaces[protocol]?.chains ?? []) {
            const address = getAddressFromAccountForNetwork(account, chainId as NetworkId)

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
}
