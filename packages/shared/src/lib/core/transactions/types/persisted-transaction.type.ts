import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { LocalEvmTransaction } from './local-evm-transaction.interface'
import { BlockscoutTokenTransfer } from '@auxiliary/blockscout/types'
import { NovesTxResponse } from '@auxiliary/noves'
import { AtLeastOne } from '@core/utils/types'

export type PersistedTransaction = AtLeastOne<{
    blockscout?: IBlockscoutTransaction
    noves?: NovesTxResponse
    tokenTransfer?: BlockscoutTokenTransfer
    local?: LocalEvmTransaction
}>
