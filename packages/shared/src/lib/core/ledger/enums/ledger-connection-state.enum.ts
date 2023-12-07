import { LedgerAppName } from './ledger-app-name.enum'

export enum LedgerConnectionState {
    AppNotOpen = 'appNotOpen',
    Locked = 'locked',
    Disconnected = 'notConnected',
    IotaAppOpen = LedgerAppName.Iota,
    ShimmerAppOpen = LedgerAppName.Shimmer,
    EthereumAppOpen = LedgerAppName.Ethereum,
}
