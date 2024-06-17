import { IscSendMetadata, IscSendOptions } from '@core/isc/types'

export function buildUnwrapAssetParameters(): {
    sendMetadata: IscSendMetadata
    sendOptions: IscSendOptions
} {
    const sendMetadata: IscSendMetadata = {
        targetContract: 0,
        entrypoint: 0,
        params: {
            items: [],
        },
        allowance: {
            baseTokens: String(0),
            nativeTokens: [],
            nfts: [],
        },
        gasBudget: BigInt(0),
    }

    const sendOptions: IscSendOptions = {
        timelock: BigInt(0),
        expiration: {
            time: BigInt(0),
            returnAddress: {
                data: new Uint8Array([]),
            },
        },
    }

    return { sendMetadata, sendOptions }
}
