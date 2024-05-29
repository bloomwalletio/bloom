import { IscSendMetadata, IscSendOptions } from '@core/isc/types'
import { Uint32, Uint64 } from '@core/utils/types/solidity.types'

export function buildUnwrapAssetParameters(): {
    sendMetadata: IscSendMetadata
    sendOptions: IscSendOptions
} {
    const sendMetadata: IscSendMetadata = {
        targetContract: Uint32.from('0'),
        entrypoint: Uint32.from('0'),
        params: {
            items: [],
        },
        allowance: {
            baseTokens: BigInt(0),
            nativeTokens: [],
            nfts: [],
        },
        gasBudget: Uint64.from('0'),
    }

    const sendOptions: IscSendOptions = {
        timelock: Uint64.from('0'),
        expiration: {
            time: Uint64.from('0'),
            returnAddress: {
                data: new Uint8Array([]),
            },
        },
    }

    return { sendMetadata, sendOptions }
}
