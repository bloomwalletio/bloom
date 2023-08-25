import {
    ILayer2AssetAllowance,
    ILayer2SendMetadataParameter,
    ILayer2SendOptionsParameter,
    ILayer2TargetAddressParameter,
} from '../interfaces'
import { buildUnwrapAssetTargetAddress } from './buildUnwrapAssetTargetAddress'

export function buildUnwrapAssetParameters(recipientAddress: string): Partial<IUnwrapAssetParameters> {
    const targetAddress = buildUnwrapAssetTargetAddress(recipientAddress)

    const sendMetadata: ILayer2SendMetadataParameter = {
        targetContract: 0,
        entrypoint: 0,
        params: {
            items: [],
        },
        allowance: <ILayer2AssetAllowance>{
            baseTokens: 0,
            nativeTokens: [],
            nfts: [],
        },
        gasBudget: 0,
    }

    const sendOptions: ILayer2SendOptionsParameter = {
        timelock: 0,
        expiration: {
            time: 0,
            returnAddress: {
                data: new Uint8Array([]),
            },
        },
    }

    return {
        targetAddress,
        adjustMinimumStorageDeposit: false,
        sendMetadata,
        sendOptions,
    }
}

export interface IUnwrapAssetParameters {
    targetAddress: ILayer2TargetAddressParameter
    assetAllowance: ILayer2AssetAllowance
    adjustMinimumStorageDeposit: boolean
    sendMetadata: ILayer2SendMetadataParameter
    sendOptions: ILayer2SendOptionsParameter
}
