import { IAccountState } from '@core/account/interfaces'
import { handleError } from '@core/error/handlers'
import { buildApprovedNamespaces } from '@walletconnect/utils'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { ISession } from '../interface/session.interface'
import { connectedDapps, getWalletClient, setConnectedDapps } from '../stores'
import { updateAccountForDappSession } from './updateAccountForDappSession'
import { ISupportedNamespace } from '../types'
import { normalizeSessionNamespace } from '../utils'
import { IDappMetadata } from '../interface'
import { get } from 'svelte/store'
import { disconnectDapp } from './disconnectDapp'

export async function approveSession(
    sessionProposal: Web3WalletTypes.SessionProposal,
    supportedNamespaces: Record<string, ISupportedNamespace>,
    dappMetadata: IDappMetadata,
    account: IAccountState
): Promise<void> {
    const { id, params } = sessionProposal

    const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces,
    })

    try {
        const dapp = get(connectedDapps).find((_dapp) => _dapp.metadata.url === dappMetadata.url)
        if (dapp?.sessionTopic) {
            await disconnectDapp(dapp)
        }

        const session = (await getWalletClient()?.approveSession({
            id,
            namespaces: approvedNamespaces,
        })) as unknown as ISession
        setConnectedDapps()
        await updateAccountForDappSession(session.topic, normalizeSessionNamespace(session.namespaces), account)
    } catch (err) {
        handleError(err)
    }
}
