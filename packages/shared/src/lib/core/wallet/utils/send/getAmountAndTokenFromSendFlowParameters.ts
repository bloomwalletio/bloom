import { SendFlowParameters } from '../../types'
import { SendFlowType } from '@core/wallet/enums'
import { IToken } from '@core/token'

export function getAmountAndTokenFromSendFlowParameters(sendFlowParameters: SendFlowParameters): {
    token: IToken | undefined
    amount: string | undefined
} {
    let token: IToken | undefined
    let amount: string | undefined
    if (sendFlowParameters.type === SendFlowType.BaseCoinTransfer) {
        token = sendFlowParameters.baseCoinTransfer?.token
        amount = sendFlowParameters.baseCoinTransfer?.rawAmount ?? '0'
    } else if (sendFlowParameters.type === SendFlowType.TokenTransfer) {
        token = sendFlowParameters.tokenTransfer?.token
        amount = sendFlowParameters.tokenTransfer?.rawAmount ?? '0'
    }

    return { token, amount }
}
