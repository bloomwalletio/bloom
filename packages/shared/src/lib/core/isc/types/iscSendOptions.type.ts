import { IscL1Address } from './iscL1Address.type'

export type IscSendOptions = {
    timelock: bigint
    expiration: {
        time: bigint
        returnAddress: IscL1Address
    }
}
