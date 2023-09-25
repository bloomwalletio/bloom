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
        params: {
            items: {
                key: string
                value: string
            }[]
        }
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
    sendOptions: {
        timelock: number
        expiration: {
            time: number
            returnAddress: {
                data: string
            }
        }
    }
}
