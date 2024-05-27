import { IToken } from '@core/token/interfaces'

export type TokenTransferData = {
    rawAmount: bigint
    token?: IToken
    unit?: string
}
