import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { LedgerAppName } from '../enums'
import { ILedgerAppSettings, ILedgerDeviceState, ILedgerEthereumAppSettings } from '../interfaces'

export function buildLedgerDeviceState(
    status: LedgerNanoStatus,
    ethereumAppSettings?: ILedgerEthereumAppSettings
): ILedgerDeviceState {
    return <ILedgerDeviceState>{
        connected: ethereumAppSettings ? true : status.connected,
        locked: ethereumAppSettings ? false : status.locked,
        device: status.device,
        app: status.app?.name as LedgerAppName,
        settings: <ILedgerAppSettings>{
            ...((status.app?.name as LedgerAppName) === LedgerAppName.Shimmer && {
                [LedgerAppName.Shimmer]: {
                    version: status.app.version,
                    blindSigningEnabled: status?.blindSigningEnabled,
                },
            }),
            ...(ethereumAppSettings && { [LedgerAppName.Ethereum]: ethereumAppSettings }),
        },
    }
}
