import { IAssetAllowance, IUnwrapAssetSendMetadata, IUnwrapAssetSendOptions } from '../interfaces'
import { UnwrapAssetParameter } from '../types'
import { buildUnwrapAssetTargetAddress } from './buildUnwrapAssetTargetAddress'

export function buildUnwrapAssetParameters(
    assetAllowance: IAssetAllowance,
    recipientAddress: string
): UnwrapAssetParameter[] {
    const targetAddressParameter = buildUnwrapAssetTargetAddress(recipientAddress)

    const sendMetadataParameter: IUnwrapAssetSendMetadata = {
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

    const sendOptionsParameter: IUnwrapAssetSendOptions = {
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
