import { IParsedInput } from '../interfaces'

type Erc20KnownContractTypes = 'transfer' | 'approve'

interface Erc20TransferMethod {
    name: 'transfer'
    inputs: {
        _to: {
            name: string
            type: string
            value: string
        }
        _value: {
            name: string
            type: string
            value: string
        }
    }
}

interface Erc20ApproveMethod {
    name: 'approve'
    inputs: {
        _spender: {
            name: string
            type: string
            value: string
        }
        _value: {
            name: string
            type: string
            value: string
        }
    }
}

interface Erc20UnknownMethod {
    name: Exclude<Erc20KnownContractTypes, string>
    inputs: Record<string, IParsedInput>
}

export type Erc20Abi = Erc20TransferMethod | Erc20ApproveMethod | Erc20UnknownMethod
