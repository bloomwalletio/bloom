import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { LedgerAppName } from '../enums'
import { ILedgerAppSettings, ILedgerDeviceState, ILedgerEthereumAppSettings } from '../interfaces'

export function buildLedgerDeviceState(
    status: LedgerNanoStatus,
    ethereumAppSettings?: ILedgerEthereumAppSettings
): ILedgerDeviceState {
    const { app, connected, locked, device } = status

    return <ILedgerDeviceState>{
        connected,
        locked,
        device,
        app: app?.name as LedgerAppName,
        settings: <ILedgerAppSettings>{
            ...(app &&
                (app?.name as LedgerAppName) === LedgerAppName.Shimmer && {
                    [LedgerAppName.Shimmer]: {
                        version: app.version,
                        blindSigningEnabled: status?.blindSigningEnabled,
                    },
                }),
            ...(app &&
                (app?.name as LedgerAppName) === LedgerAppName.Iota && {
                    [LedgerAppName.Iota]: {
                        version: app.version,
                        blindSigningEnabled: status?.blindSigningEnabled,
                    },
                }),
            ...(ethereumAppSettings && { [LedgerAppName.Ethereum]: ethereumAppSettings }),
        },
    }
}
