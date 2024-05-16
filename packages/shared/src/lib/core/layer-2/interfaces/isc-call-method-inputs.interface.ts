export interface IscCallMethodInputs {
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
