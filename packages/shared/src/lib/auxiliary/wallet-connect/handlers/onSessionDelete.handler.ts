import { showNotification } from '@auxiliary/notification'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { getConnectedDappBySessionTopic, setConnectedDapps } from '../stores'

export function onSessionDelete(event: Web3WalletTypes.SessionDelete): void {
    const { topic } = event

    const dapp = getConnectedDappBySessionTopic(topic)

    showNotification({
        variant: 'warning',
        text: 'Disconnected from ' + dapp?.metadata?.name,
    })
    setConnectedDapps()
}
