import { getNetwork } from '@core/network/stores'
import { Bech32Helper } from '@core/utils'
import { ILayer2TargetAddressParameter } from '../interfaces'

export function buildUnwrapAssetTargetAddress(address: string): ILayer2TargetAddressParameter {
    const hrp = getNetwork()?.getMetadata().protocol.bech32Hrp ?? ''
    const { addressBytes } = Bech32Helper.fromBech32(address, hrp) ?? {}
    return {
        data: new Uint8Array([0, ...(addressBytes ?? [])]),
    }
}
