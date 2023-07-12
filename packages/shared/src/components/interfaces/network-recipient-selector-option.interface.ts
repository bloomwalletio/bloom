import { Subject } from '@core/wallet'

export interface INetworkRecipientSelectorOption {
    name: string
    networkAddress: string
    chainId?: number
    recipient?: Subject
    disabled?: boolean
}
