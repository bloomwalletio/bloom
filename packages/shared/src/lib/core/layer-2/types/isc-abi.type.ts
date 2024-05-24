import { IParsedInput } from '../interfaces'
import { ILayer2SendMetadataParameterParameters } from '../interfaces/layer-2-send-metadata-parameter-parameters.interface'
import { ILayer2SendOptionsParameter } from '../interfaces/layer-2-send-options-parameter.interface'

interface IscCallMethod {
    name: 'call'
    inputs: {
        contractHname: {
            name: string
            type: string
            value: string
        }
        entryPoint: {
            name: string
            type: string
            value: string
        }
        params: {
            name: string
            type: string
            value: {
                items: {
                    key: string
                    value: string
                }[]
            }
        }
        allowance: {
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
    }
}

interface IscSendMethod {
    name: 'send'
    inputs: {
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
}

type IscKnownContractTypes = 'send' | 'call'

interface IscUnknownMethod {
    name: Exclude<IscKnownContractTypes, string>
    inputs: Record<string, IParsedInput>
}
export type IscAbi = IscCallMethod | IscSendMethod | IscUnknownMethod
