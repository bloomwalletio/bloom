import { IEvmNetwork } from '@core/network/interfaces'
import { IConnectedDapp } from '../interface/connected-dapp.interface'
import { CallbackParameters } from './callback-parameters.type'
import { DappVerification } from '../enums/dapp-verification.enum'

export type WCRequestInfo = {
    dapp: IConnectedDapp
    evmNetwork: IEvmNetwork
    responseCallback: (params: CallbackParameters) => void
    verifiedState: DappVerification
    expiryTimestamp: number
}
