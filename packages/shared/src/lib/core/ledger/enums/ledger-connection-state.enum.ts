import { LedgerAppName } from './ledger-app-name.enum'

export enum LedgerConnectionState {
    AppNotOpen = 'appNotOpen',
    Locked = 'locked',
    Disconnected = 'notConnected',
    EthereumAppOpen = LedgerAppName.Ethereum,
    ShimmerAppOpen = LedgerAppName.Shimmer,
}
