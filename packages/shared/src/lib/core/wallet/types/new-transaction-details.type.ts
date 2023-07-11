import type { ILayer2Parameters } from '@core/layer-2'
import { INft } from '@core/nfts'
import type { IAsset, Subject } from '@core/wallet'
import { NewTransactionType } from '@core/wallet/stores'

export type NewTransactionData = NewNftTransactionData | NewTokenTransactionData

type NewBaseTransactionData = {
    recipient?: Subject
    tag?: string
    metadata?: string
    expirationDate?: Date
    timelockDate?: Date
    surplus?: string
    giftStorageDeposit?: boolean
    layer2Parameters?: ILayer2Parameters
    addSenderFeature?: boolean
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
}

export type NewTokenTransactionData = NewBaseTransactionData & {
    type: NewTransactionType.TokenTransfer
    rawAmount: string
    asset: IAsset
    unit: string
}

export type NewNftTransactionData = NewBaseTransactionData & {
    type: NewTransactionType.NftTransfer
    nft: INft
}
