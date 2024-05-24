import { IParsedInput } from '../interfaces'

type Erc721KnownContractTypes = 'safeTransferFrom'

interface Erc721SafeTransferMethod {
    name: 'safeTransferFrom'
    inputs: {
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
}

interface Erc721UnknwonMethod {
    name: Exclude<Erc721KnownContractTypes, string>
    inputs: Record<string, IParsedInput>
}

export type Erc721Abi = Erc721SafeTransferMethod | Erc721UnknwonMethod
