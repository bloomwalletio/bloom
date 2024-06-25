import { clearSessionInitiationRequest, getWalletClient, persistDapp } from '../stores'
import { clearOldPairings } from './clearOldPairings'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { DappVerification } from '../enums'
import { GENERAL_SUPPORTED_METHODS } from '../constants'
import { populateAuthPayload, buildAuthObject } from '@walletconnect/utils'
import { NetworkId, getEvmNetwork } from '@core/network'
import { AuthTypes, SessionTypes } from '@walletconnect/types'
import { ISelections } from '../interface'
import { signMessage } from '@core/wallet'
import { getCaip10AddressForAccount, normalizeSessionNamespace } from '../utils'
import { SupportedNamespaces } from '../types'

export async function approveSessionAuthenticate(
    sessionProposal: Web3WalletTypes.SessionAuthenticate,
    selections: ISelections
): Promise<void> {
    const walletClient = getWalletClient()
    if (!walletClient) {
        return
    }

    const allowedMethods = [...(selections.methods ?? []), ...GENERAL_SUPPORTED_METHODS]

    const authPayload = populateAuthPayload({
        authPayload: sessionProposal.params.authPayload,
        chains: selections.chains ?? [],
        methods: allowedMethods,
    })

    const auths: AuthTypes.Cacao[] = []
    for (const chain of authPayload.chains) {
        const network = getEvmNetwork(chain as NetworkId)
        if (!network) {
            continue
        }

        for (const account of selections.accounts ?? []) {
            const address = getCaip10AddressForAccount(account, network.id)
            if (!address) {
                continue
            }

            const message = walletClient.formatAuthMessage({
                request: authPayload,
                iss: address,
            })
            const signature = await signMessage(message, network.coinType, account)
            if (!signature) {
                continue
            }

            const auth = buildAuthObject(authPayload, { t: 'eip191', s: signature }, address)
            auths.push(auth)
        }
    }

    const { session } = await walletClient.approveSessionAuthenticate({
        id: sessionProposal.id,
        auths,
    })

    if (!session) {
        throw new Error('Failed to approve session authenticate')
    }

    const dappUrl = sessionProposal.params.requester.metadata.url
    await clearOldPairings(dappUrl)
    persistDapp(dappUrl, DappVerification.Unknown, {
        supported: cleanupNamespaces(session.namespaces),
        required: session.requiredNamespaces,
        optional: session.optionalNamespaces,
    })
    clearSessionInitiationRequest()
}

// This is needed because the returned namespaces from the wallet connect client can contain duplicated chains
function cleanupNamespaces(namespaces: SessionTypes.Namespaces): SupportedNamespaces {
    const normalizedNamespaces = normalizeSessionNamespace(namespaces)
    for (const key in normalizedNamespaces) {
        const namespace = normalizedNamespaces[key]
        namespace.chains = [...new Set(namespace.chains)]
    }
    return normalizedNamespaces
}
