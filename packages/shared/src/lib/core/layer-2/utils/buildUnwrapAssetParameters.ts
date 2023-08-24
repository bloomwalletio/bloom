import { IAssetAllowance, ILayer2SendMetadataParameter, ILayer2SendOptionsParameter } from '../interfaces'
import { UnwrapAssetParameter } from '../types'
import { buildUnwrapAssetTargetAddress } from './buildUnwrapAssetTargetAddress'

export function buildUnwrapAssetParameters(
    assetAllowance: IAssetAllowance,
    recipientAddress: string
): UnwrapAssetParameter[] {
    const targetAddressParameter = buildUnwrapAssetTargetAddress(recipientAddress)

    const sendMetadataParameter: ILayer2SendMetadataParameter = {
        targetContract: 0,
        entrypoint: 0,
        params: {
            items: [],
        },
        allowance: <IAssetAllowance>{
            baseTokens: 0,
            nativeTokens: [],
            nfts: [],
        },
        gasBudget: 0,
    }

    const sendOptionsParameter: ILayer2SendOptionsParameter = {
        timelock: 0,
        expiration: {
            time: 0,
            returnAddress: {
                data: new Uint8Array([]),
            },
        },
    }

    return [
        {
            ...targetAddressParameter,
        },
        {
            ...assetAllowance,
        },
        false,
        {
            ...sendMetadataParameter,
        },
        {
            ...sendOptionsParameter,
        },
    ]
}
