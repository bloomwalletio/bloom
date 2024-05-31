import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { get } from 'svelte/store'
import { WalletConnectEvents } from '../enums'
import { walletClient } from '../stores'
import { NetworkId } from '@core/network/types'
import { ISession } from '../interface/session.interface'
import { doesNamespaceSupportEvent } from '../utils'

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

        for (const chainId of dappSession.namespaces[protocol]?.chains ?? []) {
            const address = getAddressFromAccountForNetwork(account, chainId as NetworkId)

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
}
