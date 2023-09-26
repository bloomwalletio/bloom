import { ILayer2SendMetadataParameterParameters } from './layer-2-send-metadata-parameter-parameters.interface'
import { ILayer2SendOptionsParameter } from './layer-2-send-options-parameter.interface'

export interface IscSendMethodInputs {
    targetAddress: {
        data: string
    }
    assets: {
        baseTokens: string
        nativeTokens: {
            ID: {
                data: string
            }
            amount: string
        }[]
        nfts: string[]
    }
    adjustMinimumStorageDeposit: boolean
    metadata: {
        targetContract: number
        entrypoint: number
        params: ILayer2SendMetadataParameterParameters[]
        allowance: {
            baseTokens: string
            nativeTokens: {
                ID: {
                    data: string
                }
                amount: string
            }[]
            nfts: string[]
        }
        gasBudget: number
    }
    sendOptions: ILayer2SendOptionsParameter
}
