import { NetworkId } from '@core/network'
import { Nft } from '@core/nfts'
import { IToken } from '@core/token/interfaces'
import type { Subject } from '@core/wallet'
import { SendFlowType } from '@core/wallet/enums'

export type SendFlowParameters = TokenSendFlowParameters | NftSendFlowParameters | BaseSendFlowParameters

export interface BaseSendFlowParameters {
    type: SendFlowType.BaseCoinTransfer
    recipient?: Subject
    tag?: string
    metadata?: string
    expirationDate?: Date
    timelockDate?: Date
    giftStorageDeposit?: boolean
    destinationNetworkId?: NetworkId
    addSenderFeature?: boolean
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
    disableChangeTimelock?: boolean
    baseCoinTransfer?: TokenTransferData
    gasFee?: number
}

export interface TokenSendFlowParameters extends Omit<BaseSendFlowParameters, 'type'> {
    type: SendFlowType.TokenTransfer
    tokenTransfer?: TokenTransferData
}

export interface NftSendFlowParameters extends Omit<BaseSendFlowParameters, 'type'> {
    type: SendFlowType.NftTransfer
    nft?: Nft
}

// TODO move to own file and check optional params
export type TokenTransferData = {
    rawAmount: string
    token: IToken
    unit?: string
}
