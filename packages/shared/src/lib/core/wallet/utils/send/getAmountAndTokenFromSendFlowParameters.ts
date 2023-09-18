import { IToken } from '@core/token'
import { SendFlowType } from '@core/wallet/enums'
import { SendFlowParameters } from '../../types'

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
