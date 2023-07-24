import type { ILayer2Parameters } from '@core/layer-2'
import { INft } from '@core/nfts'
import type { IAsset, Subject } from '@core/wallet'
import { SendFlowType } from '@core/wallet/stores'

export type SendFlowParameters = TokenSendFlowParameters | NftSendFlowParameters | BaseSendFlowParameters

export interface BaseSendFlowParameters {
    type: SendFlowType.BaseCoinTransfer
    recipient?: Subject
    tag?: string
    metadata?: string
    expirationDate?: Date
    timelockDate?: Date
    giftStorageDeposit?: boolean
    layer2Parameters?: ILayer2Parameters
    addSenderFeature?: boolean
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
    baseCoinTransfer?: TokenTransferData
}

export interface TokenSendFlowParameters extends Omit<BaseSendFlowParameters, 'type'> {
    type: SendFlowType.TokenTransfer
    tokenTransfer?: TokenTransferData
}

export interface NftSendFlowParameters extends Omit<BaseSendFlowParameters, 'type'> {
    type: SendFlowType.NftTransfer
    nft?: INft
}

export type TokenTransferData = {
    rawAmount?: string
    asset?: IAsset
    unit?: string
}
