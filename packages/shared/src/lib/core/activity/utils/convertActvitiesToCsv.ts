import { NetworkNamespace, getNameFromNetworkId } from '@core/network'
import { Activity, EvmActivity, StardustActivity } from '../types'
import { IAccountState } from '@core/account'
import { getNameFromSubject } from './helper'
import { StardustActivityAsyncStatus, StardustActivityType } from '../enums'
import { EvmActivityType } from '../enums/evm'
import { getPersistedToken } from '@core/token/stores'
import {
    BASE_TOKEN_ID,
    IBaseToken,
    IErc20Metadata,
    IIrc30Metadata,
    TokenStandard,
    formatTokenAmountBestMatch,
} from '@core/token'
import { NftStandard } from '@core/nfts'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'

type ActivityCsvRow = {
    associatedAccount: string | undefined
    transactionId: string | undefined
    transactionTag: string | undefined
    transactionDate: string | undefined
    transactionType: string | undefined
    fromNetworkId: string | undefined
    fromNetworkName: string | undefined
    fromAddress: string | undefined
    fromAddressAlias: string | undefined
    toNetworkId: string | undefined
    toNetworkName: string | undefined
    toAddress: string | undefined
    toAddressAlias: string | undefined
    assetId: string | undefined
    assetType: string | undefined
    assetStandard: string | undefined
    assetName: string | undefined
    assetTicker: string | undefined
    amount: string | undefined
    feeInSMR: string | undefined
    storageDepositInSMR: string | undefined
    sdruc: string | undefined
    sdrucStatus: string | undefined
    expirationDate: string | undefined
    expirationStatus: string | undefined
    timelockDate: string | undefined
    timelockStatus: string | undefined
}

export function convertActvitiesToCsv(account: IAccountState, activities: Activity[]): string {
    const keys =
        'associatedAccount,transactionId,transactionTag,transactionDate,transactionType,fromNetworkId,fromNetworkName,fromAddress,fromAddressAlias,toNetworkId,toNetworkName,toAddress,toAddressAlias,assetId,assetType,assetStandard,assetName,assetTicker,amount,feeInSMR,storageDepositInSMR,sdruc,sdrucStatus,expirationDate,expirationStatus,timelockDate,timelockStatus'

    const activityRows = activities.map((activity) => {
        if (activity.namespace === NetworkNamespace.Stardust) {
            const activityRow = getRowForStardustActivity(account, activity)
            return Object.values(activityRow).join(',')
        } else if (activity.namespace === NetworkNamespace.Evm) {
            const activityRow = getRowForEvmActivity(account, activity)
            return Object.values(activityRow).join(',')
        } else {
            return ''
        }
    })

    return `${keys}\n${activityRows.join('\n')}`
}

function getRowForStardustActivity(account: IAccountState, activity: StardustActivity): ActivityCsvRow {
    let assetId: string | undefined
    let assetType: string | undefined
    let assetStandard: string | undefined
    let assetName: string | undefined
    let assetTicker: string | undefined
    let amount: string | undefined

    if (activity.type === StardustActivityType.Basic) {
        if (activity.tokenTransfer) {
            const tokenId = activity.tokenTransfer.tokenId
            const metadata = getPersistedToken(tokenId)?.metadata as IErc20Metadata | IIrc30Metadata
            amount = metadata ? formatTokenAmountBestMatch(activity.tokenTransfer.rawAmount, metadata) : ''

            assetId = tokenId
            assetType = 'TOKEN'
            assetStandard = metadata?.standard
            assetName = metadata?.name
            assetTicker = metadata?.symbol
        } else {
            const metadata = getPersistedToken(BASE_TOKEN_ID)?.metadata as IBaseToken
            amount = metadata ? formatTokenAmountBestMatch(activity.baseTokenTransfer.rawAmount, metadata) : ''

            assetId = 'BASE_COIN'
            assetType = 'TOKEN'
            assetStandard = metadata?.standard
            assetName = metadata?.name
            assetTicker = metadata?.tickerSymbol
        }
    } else if (activity.type === StardustActivityType.Nft) {
        const nft = getNftByIdFromAllAccountNfts(account.index, activity.nftId)

        assetId = activity.nftId
        assetType = 'NFT'
        assetStandard = nft?.standard
        assetName = nft?.metadata?.name
        assetTicker = ''
        amount = '1'
    }

    return {
        associatedAccount: account.name,
        transactionId: activity.transactionId,
        transactionTag: activity.tag,
        transactionDate: activity.time.toString(),
        transactionType: undefined,
        fromNetworkId: activity.sourceNetworkId,
        fromNetworkName: getNameFromNetworkId(activity.sourceNetworkId),
        fromAddress: activity.sender?.address,
        fromAddressAlias: getNameFromSubject(activity.sender),
        toNetworkId: activity.destinationNetworkId,
        toNetworkName: getNameFromNetworkId(activity.destinationNetworkId),
        toAddress: activity.recipient?.address,
        toAddressAlias: getNameFromSubject(activity.recipient),
        assetId,
        assetType,
        assetStandard,
        assetName,
        assetTicker,
        amount,
        feeInSMR: String(activity.transactionFee ?? ''),
        storageDepositInSMR: String(activity.storageDeposit ?? ''),
        sdruc: undefined,
        sdrucStatus: undefined,
        expirationDate: activity.asyncData?.expirationDate?.toString(),
        expirationStatus:
            activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Claimed ? 'Claimed' : undefined, //  TODO: Improve this
        timelockDate: activity.asyncData?.timelockDate?.toString(),
        timelockStatus:
            activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Timelocked ? 'timelocked' : undefined, //  TODO: Improve this
    }
}

function getRowForEvmActivity(account: IAccountState, activity: EvmActivity): ActivityCsvRow {
    let assetId: string | undefined
    let assetType: string | undefined
    let assetStandard: string | undefined
    let assetName: string | undefined
    let assetTicker: string | undefined
    let amount: string | undefined

    if (activity.type === EvmActivityType.CoinTransfer) {
        const metadata = getPersistedToken(BASE_TOKEN_ID)?.metadata as IBaseToken
        amount = metadata ? formatTokenAmountBestMatch(activity.baseTokenTransfer.rawAmount, metadata) : ''

        assetId = 'BASE_COIN'
        assetType = 'TOKEN'
        assetStandard = metadata?.standard
        assetName = metadata?.name
        assetTicker = metadata?.tickerSymbol
    } else if (activity.type === EvmActivityType.TokenTransfer || activity.type === EvmActivityType.BalanceChange) {
        const { standard, tokenId, rawAmount } = activity.tokenTransfer
        if (standard === TokenStandard.Erc20 || standard === TokenStandard.Irc30) {
            const metadata = getPersistedToken(tokenId)?.metadata as IErc20Metadata | IIrc30Metadata
            amount = metadata ? formatTokenAmountBestMatch(rawAmount, metadata) : ''

            assetId = tokenId
            assetType = 'TOKEN'
            assetStandard = standard
            assetName = metadata?.name
            assetTicker = metadata?.symbol
        } else if (standard === NftStandard.Erc721 || standard === NftStandard.Irc27) {
            const nft = getNftByIdFromAllAccountNfts(account.index, tokenId)

            assetId = tokenId
            assetType = 'NFT'
            assetStandard = standard
            assetName = nft?.metadata?.name
            assetTicker = ''
            amount = '1'
        }
    }

    return {
        associatedAccount: account.name,
        transactionId: activity.transactionId,
        transactionTag: undefined,
        transactionDate: activity.time.toString(),
        transactionType: undefined,
        fromNetworkId: activity.sourceNetworkId,
        fromNetworkName: getNameFromNetworkId(activity.sourceNetworkId),
        fromAddress: activity.sender?.address,
        fromAddressAlias: getNameFromSubject(activity.sender),
        toNetworkId: activity.destinationNetworkId,
        toNetworkName: getNameFromNetworkId(activity.destinationNetworkId),
        toAddress: activity.recipient?.address,
        toAddressAlias: getNameFromSubject(activity.recipient),
        assetId,
        assetType,
        assetStandard,
        assetName,
        assetTicker,
        amount,
        feeInSMR: String(activity.transactionFee ?? ''),
        storageDepositInSMR: undefined,
        sdruc: undefined,
        sdrucStatus: undefined,
        expirationDate: undefined,
        expirationStatus: undefined,
        timelockDate: undefined,
        timelockStatus: undefined,
    }
}
