import { Uint64 } from '@core/utils/types/solidity.types'
import { IscHName } from './IscHname.type'
import { IscAssets } from './iscAssets.type'
import { IscDict } from './iscDict.type'

export type IscSendMetadata = {
    targetContract: IscHName
    entrypoint: IscHName
    params: IscDict
    allowance: IscAssets
    gasBudget: Uint64
}
