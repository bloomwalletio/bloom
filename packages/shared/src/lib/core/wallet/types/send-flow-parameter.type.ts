import { NetworkId } from '@core/network'
import { Nft } from '@core/nfts'
import type { Subject } from '@core/wallet'
import { SendFlowType } from '@core/wallet/enums'
import { TokenTransferData } from './token-transfer-data.type'

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
    sourceNetworkId?: NetworkId
    addSenderFeature?: boolean
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
    disableChangeTimelock?: boolean
    baseCoinTransfer?: TokenTransferData
    gasFee?: bigint
}

export interface TokenSendFlowParameters extends Omit<BaseSendFlowParameters, 'type'> {
    type: SendFlowType.TokenTransfer
    tokenTransfer?: TokenTransferData
}

export interface NftSendFlowParameters extends Omit<BaseSendFlowParameters, 'type'> {
    type: SendFlowType.NftTransfer
    nft?: Nft
}
