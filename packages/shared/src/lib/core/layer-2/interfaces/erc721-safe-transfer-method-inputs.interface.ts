export interface Erc721SafeTransferMethodInputs {
    from: {
        name: string
        type: string
        value: string
    }
    to: {
        name: string
        type: string
        value: string
    }
    tokenId: {
        name: string
        type: string
        value: string
    }
    data?: {
        name: string
        type: string
        value: string
    }
}
