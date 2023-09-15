export interface IscCallMethodInputs {
    contractHname: string
    entryPoint: string
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
}
