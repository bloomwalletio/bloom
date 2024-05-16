import { ILayer2SendMetadataParameterParameters } from './layer-2-send-metadata-parameter-parameters.interface'
import { ILayer2SendOptionsParameter } from './layer-2-send-options-parameter.interface'

export interface IscSendMethodInputs {
    targetAddress: {
        name: string
        type: string
        value: {
            data: string
        }
    }
    assets: {
        name: string
        type: string
        value: {
            baseTokens: string
            nativeTokens: {
                ID: {
                    data: string
                }
                amount: string
            }[]
            nfts: string[]
        }
    }
    adjustMinimumStorageDeposit: boolean
    metadata: {
        name: string
        type: string
        value: {
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
    }
    sendOptions: {
        name: string
        type: string
        value: ILayer2SendOptionsParameter
    }
}
