import { NetworkNamespace, getNameFromNetworkId } from '@core/network'
import { Activity, EvmActivity, StardustActivity } from '../types'
import { IAccountState } from '@core/account'
import { getNameFromSubject } from './helper'
import { StardustActivityAsyncStatus } from '../enums'

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
        assetId: undefined,
        assetType: undefined,
        assetStandard: undefined,
        assetName: undefined,
        assetTicker: undefined,
        amount: undefined,
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
        assetId: undefined,
        assetType: undefined,
        assetStandard: undefined,
        assetName: undefined,
        assetTicker: undefined,
        amount: undefined,
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
