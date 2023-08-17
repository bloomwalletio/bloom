import { getNetwork } from '@core/network/stores'
import { Bech32Helper } from '@core/utils'
import { IUnwrapAssetTargetAddress } from '../interfaces'

export function buildUnwrapAssetTargetAddress(address: string): IUnwrapAssetTargetAddress {
    const hrp = getNetwork()?.getMetadata().protocol.bech32Hrp ?? ''
    const { addressBytes } = Bech32Helper.fromBech32(address, hrp) ?? {}
    return {
        data: new Uint8Array([0, ...(addressBytes ?? [])]),
    }
}
