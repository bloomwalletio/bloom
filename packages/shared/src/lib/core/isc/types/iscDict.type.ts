import { bytes } from '@core/utils/types/solidity.types'

export type IscDict = {
    items: IscDictItem[]
}

type IscDictItem = {
    key: bytes
    value: bytes
}
