import { get, writable, type Writable } from 'svelte/store'
import type { IConnectedDapp } from '../interface/connected-dapp.interface'
import { normalizeSessionNamespace } from '../utils'
import { getWalletClient } from './wallet-client.store'

export const connectedDapps: Writable<IConnectedDapp[]> = writable([])

export function setConnectedDapps(): void {
    const pairings = getWalletClient()?.core.pairing.getPairings() ?? []
    const sessions = getWalletClient()?.getActiveSessions() ?? {}

    const dapps: IConnectedDapp[] = []
    for (const session of Object.values(sessions)) {
        dapps.push({
            sessionTopic: session.topic,
            pairingTopic: session.pairingTopic,
            metadata: session.peer.metadata,
            namespaces: normalizeSessionNamespace(session.namespaces),
            requiredNamespaces: session.requiredNamespaces,
            optionalNamespaces: session.optionalNamespaces,
        })
    }
    for (const pairing of pairings) {
        if (!pairing.peerMetadata) {
            continue
        }

        const existingDapp = dapps.find((dapp) => dapp.pairingTopic === pairing.topic)
        if (existingDapp) {
            existingDapp.pairingTopic = pairing.topic
        } else {
            dapps.push({
                pairingTopic: pairing.topic,
                metadata: pairing.peerMetadata,
            })
        }
    }
    connectedDapps.set(dapps)
}

export function getConnectedDapps(): IConnectedDapp[] {
    return get(connectedDapps)
}

export function getConnectedDappByOrigin(origin: string): IConnectedDapp | undefined {
    return get(connectedDapps).find((dapp) => dapp.metadata?.url === origin)
}

export function getConnectedDappBySessionTopic(sessionTopic: string): IConnectedDapp | undefined {
    return get(connectedDapps).find((dapp) => dapp.sessionTopic === sessionTopic)
}
