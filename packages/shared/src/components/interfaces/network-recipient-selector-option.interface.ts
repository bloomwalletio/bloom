import { NetworkId } from '@core/network'
import { Subject } from '@core/wallet'

export interface INetworkRecipientSelectorOption {
    networkId: NetworkId
    name: string
    recipients: Subject[]
    selectedRecipient?: Subject
    disabled?: boolean
}
