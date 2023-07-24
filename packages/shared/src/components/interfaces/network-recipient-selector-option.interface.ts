import { Subject } from '@core/wallet'

export interface INetworkRecipientSelectorOption {
    name: string
    networkAddress: string
    chainId?: number
    recipients?: Subject[]
    selectedRecipient?: Subject
    disabled?: boolean
}
