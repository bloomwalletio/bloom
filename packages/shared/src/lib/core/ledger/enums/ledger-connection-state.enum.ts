import { LedgerAppName } from './ledger-app-name.enum'

export enum LedgerConnectionState {
    AppNotOpen = 'appNotOpen',
    Locked = 'locked',
    NotConnected = 'notConnected',
    EthereumAppOpen = LedgerAppName.Ethereum,
    ShimmerAppOpen = LedgerAppName.Shimmer,
    BolosAppOpen = LedgerAppName.Bolos,
}
