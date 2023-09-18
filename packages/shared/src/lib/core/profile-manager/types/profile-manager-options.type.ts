import { WalletOptions } from '@iota/sdk'
import { IClientOptions } from '@core/network/interfaces'

export type ProfileManagerOptions = Omit<WalletOptions, 'clientOptions'> & {
    clientOptions: IClientOptions
}
