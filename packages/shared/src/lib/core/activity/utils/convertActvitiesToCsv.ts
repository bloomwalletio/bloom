import { NetworkNamespace, getNameFromNetworkId } from '@core/network'
import {
    Activity,
    EvmActivity,
    EvmBalanceChangeActivity,
    EvmCoinTransferActivity,
    EvmTokenMintingActivity,
    EvmTokenTransferActivity,
    StardustActivity,
    StardustNftActivity,
    StardustTransactionActivity,
} from '../types'
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
import { isEvmTokenActivity } from './isEvmTokenActivity'

const CSV_KEYS = [
    'associatedAccount',
    'transactionId',
    'transactionTag',
    'transactionDate',
    'transactionType',
    'direction',
    'fromNetworkId',
    'fromNetworkName',
    'fromAddress',
    'fromAddressAlias',
    'toNetworkId',
    'toNetworkName',
    'toAddress',
    'toAddressAlias',
    'assetId',
    'assetType',
    'assetStandard',
    'assetName',
    'assetTicker',
    'amount',
    'feeInSMR',
    'storageDepositInSMR',
    'sdruc',
    'sdrucStatus',
    'expirationDate',
    'expirationStatus',
    'timelockDate',
    'timelockStatus',
]

type ActivityCsvRow = {
    [key in (typeof CSV_KEYS)[number]]: string | undefined
}

export function convertActvitiesToCsv(account: IAccountState[], activities: Activity[][]): string {
    const activityRows = account.flatMap((account) => {
        return activities[account.index]
            .map((activity) => {
                if (activity.namespace === NetworkNamespace.Stardust && shouldStardustActivityBeInCsv(activity)) {
                    const activityRow = getRowForStardustActivity(account, activity)
                    const values = CSV_KEYS.map((key) => escapeValue(activityRow[key] ?? ''))
                    return values.join(',')
                } else if (activity.namespace === NetworkNamespace.Evm && shouldEvmActivityBeInCsv(activity)) {
                    const activityRow = getRowForEvmActivity(account, activity)
                    const values = CSV_KEYS.map((key) => escapeValue(activityRow[key] ?? ''))
                    return values.join(',')
                } else {
                    return ''
                }
            })
            .filter(Boolean)
    })

    const header = CSV_KEYS.join(',')
    const table = activityRows.join('\n')

    return `${header}\n${table}`
}

function getRowForStardustActivity(
    account: IAccountState,
    activity: StardustTransactionActivity | StardustNftActivity
): ActivityCsvRow {
    let assetId: string | undefined
    let assetType: string | undefined
    let assetStandard: string | undefined
    let assetName: string | undefined
    let assetTicker: string | undefined
    let amount: string | undefined

    const baseCoinMetadata = getPersistedToken(activity.sourceNetworkId, BASE_TOKEN_ID)?.metadata as IBaseToken
    if (activity.type === StardustActivityType.Basic) {
        if (activity.tokenTransfer) {
            const tokenId = activity.tokenTransfer.tokenId
            const metadata = getPersistedToken(activity.sourceNetworkId, tokenId)?.metadata as
                | IErc20Metadata
                | IIrc30Metadata
            amount = metadata
                ? formatTokenAmountBestMatch(activity.tokenTransfer.rawAmount, metadata, {
                      round: false,
                      withUnit: false,
                  })
                : ''

            assetId = tokenId
            assetType = 'TOKEN'
            assetStandard = metadata?.standard
            assetName = metadata?.name
            assetTicker = metadata?.symbol
        } else {
            amount = baseCoinMetadata
                ? formatTokenAmountBestMatch(activity.baseTokenTransfer.rawAmount, baseCoinMetadata, {
                      round: false,
                      withUnit: false,
                  })
                : ''

            assetId = BASE_TOKEN_ID
            assetType = 'TOKEN'
            assetStandard = baseCoinMetadata?.standard
            assetName = baseCoinMetadata?.name
            assetTicker = baseCoinMetadata?.tickerSymbol
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

    const transactionType = assetId === BASE_TOKEN_ID ? EvmActivityType.CoinTransfer : EvmActivityType.TokenTransfer

    const storageDepositInSMR = activity.storageDeposit
        ? formatTokenAmountBestMatch(activity.storageDeposit, baseCoinMetadata, {
              round: false,
              withUnit: false,
          })
        : undefined
    const feeInSMR = activity.transactionFee
        ? formatTokenAmountBestMatch(activity.transactionFee, baseCoinMetadata, {
              round: false,
              withUnit: false,
          })
        : undefined

    return {
        associatedAccount: account.name,
        transactionId: activity.transactionId,
        transactionTag: activity.tag,
        transactionDate: activity.time.toString(),
        transactionType,
        direction: activity.direction,
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
        feeInSMR,
        storageDepositInSMR,
        sdruc: activity.storageDeposit ? 'True' : 'False',
        sdrucStatus: activity.storageDeposit ? activity.asyncData?.asyncStatus : undefined,
        expirationDate: activity.asyncData?.expirationDate?.toString(),
        expirationStatus: activity.asyncData?.expirationDate ? activity.asyncData?.asyncStatus : undefined, //  TODO: Improve this
        timelockDate: activity.asyncData?.timelockDate?.toString(),
        timelockStatus: activity.asyncData?.timelockDate
            ? activity.asyncData?.timelockDate > new Date()
                ? StardustActivityAsyncStatus.Timelocked
                : undefined
            : undefined, //  TODO: Improve this
    }
}

function getRowForEvmActivity(
    account: IAccountState,
    activity: EvmCoinTransferActivity | EvmTokenTransferActivity | EvmTokenMintingActivity | EvmBalanceChangeActivity
): ActivityCsvRow {
    let assetId: string | undefined
    let assetType: string | undefined
    let assetStandard: string | undefined
    let assetName: string | undefined
    let assetTicker: string | undefined
    let amount: string | undefined
    const baseCoinMetadata = getPersistedToken(activity.sourceNetworkId, BASE_TOKEN_ID)?.metadata as IBaseToken

    if (activity.type === EvmActivityType.CoinTransfer) {
        amount = baseCoinMetadata
            ? formatTokenAmountBestMatch(activity.baseTokenTransfer.rawAmount, baseCoinMetadata, {
                  round: false,
                  withUnit: false,
              })
            : ''

        assetId = BASE_TOKEN_ID
        assetType = 'TOKEN'
        assetStandard = baseCoinMetadata?.standard
        assetName = baseCoinMetadata?.name
        assetTicker = baseCoinMetadata?.tickerSymbol
    } else if (isEvmTokenActivity(activity)) {
        const { standard, tokenId, rawAmount } = activity.tokenTransfer
        if (standard === TokenStandard.Erc20 || standard === TokenStandard.Irc30) {
            const metadata = getPersistedToken(activity.sourceNetworkId, tokenId)?.metadata as
                | IErc20Metadata
                | IIrc30Metadata
            amount = metadata ? formatTokenAmountBestMatch(rawAmount, metadata, { round: false, withUnit: false }) : ''

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

    const feeInSMR = activity.transactionFee
        ? formatTokenAmountBestMatch(activity.transactionFee, baseCoinMetadata, {
              round: false,
              withUnit: false,
          })
        : undefined

    return {
        associatedAccount: account.name,
        transactionId: activity.transactionId,
        transactionTag: undefined,
        transactionDate: activity.time.toString(),
        transactionType: activity.type,
        direction: activity.direction,
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
        feeInSMR,
        storageDepositInSMR: undefined,
        sdruc: undefined,
        sdrucStatus: undefined,
        expirationDate: undefined,
        expirationStatus: undefined,
        timelockDate: undefined,
        timelockStatus: undefined,
    }
}

function escapeValue(value: string): string {
    const valuesToEscape = ['"', ',']

    return valuesToEscape.some((valueToEscape) => value?.includes(valueToEscape)) ? `"${value}"` : value
}

function shouldStardustActivityBeInCsv(
    activity: StardustActivity
): activity is StardustTransactionActivity | StardustNftActivity {
    return activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Nft
}

function shouldEvmActivityBeInCsv(
    activity: EvmActivity
): activity is EvmCoinTransferActivity | EvmTokenTransferActivity | EvmTokenMintingActivity | EvmBalanceChangeActivity {
    return (
        activity.type === EvmActivityType.CoinTransfer ||
        activity.type === EvmActivityType.TokenTransfer ||
        activity.type === EvmActivityType.TokenMinting ||
        activity.type === EvmActivityType.BalanceChange
    )
}
