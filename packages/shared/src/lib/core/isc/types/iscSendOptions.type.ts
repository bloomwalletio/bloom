import { Uint64 } from '@core/utils/types/solidity.types'
import { IscL1Address } from './iscL1Address.type'

export type IscSendOptions = {
    timelock: Uint64
    expiration: {
        time: Uint64
        returnAddress: IscL1Address
    }
}
