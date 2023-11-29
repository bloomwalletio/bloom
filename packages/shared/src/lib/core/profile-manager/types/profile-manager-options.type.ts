import { IClientOptions } from '@core/network/interfaces'
import { WalletOptions } from '@iota/sdk'

export type ProfileManagerOptions = Omit<WalletOptions, 'clientOptions'> & {
    clientOptions: IClientOptions
}
