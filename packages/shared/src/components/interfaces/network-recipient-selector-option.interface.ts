import { NetworkId } from '@core/network'
import { Subject } from '@core/wallet'

export interface INetworkRecipientSelectorOption {
    name: string
    networkAddress: string
    networkId?: NetworkId
    recipients: Subject[]
    selectedRecipient?: Subject
    disabled?: boolean
}
