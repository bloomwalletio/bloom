import { IAccountState } from '@core/account/interfaces'
import { handleError } from '@core/error/handlers'
import { buildApprovedNamespaces } from '@walletconnect/utils'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { ISession } from '../interface/session.interface'
import { getWalletClient, setConnectedDapps } from '../stores'
import { updateAccountForDappSession } from './updateAccountForDappSession'

export async function approveSession(
    sessionProposal: Web3WalletTypes.SessionProposal,
    supportedNamespaces: Record<
        string,
        {
            chains: string[]
            methods: string[]
            events: string[]
            accounts: string[]
        }
    >,
    account: IAccountState
): Promise<void> {
    const { id, params } = sessionProposal

    const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces,
    })

    try {
        const session = (await getWalletClient()?.approveSession({
            id,
            namespaces: approvedNamespaces,
        })) as unknown as ISession
        setConnectedDapps()
        await updateAccountForDappSession(session, account)
    } catch (err) {
        handleError(err)
    }
}
