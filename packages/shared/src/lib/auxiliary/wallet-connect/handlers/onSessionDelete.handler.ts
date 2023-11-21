import { showNotification } from '@auxiliary/notification'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDapps, setConnectedDapps } from '../stores'

export function onSessionDelete(event: Web3WalletTypes.SessionDelete): void {
    const { topic } = event

    const dapp = getConnectedDapps().find((_dapp) => _dapp.session?.topic === topic)

    showNotification({
        variant: 'warning',
        text: 'Disconnected from ' + dapp?.metadata?.name,
    })
    setConnectedDapps()
}
