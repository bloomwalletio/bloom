import { NetworkNamespace } from '@core/network'
import { Activity, EvmActivity, StardustActivity } from '../types'
import { EvmActivityType } from '../enums/evm'

export function convertActvitiesToCsv(activities: Activity[]): string {
    const keys = 'time,action,direction,sender,recipient,baseTokenAmount,tokenAmount,tokenId,fee'

    const activityRows = activities.map((activity) => {
        if (activity.namespace === NetworkNamespace.Stardust) {
            return getRowForStardustActivity(activity)
        } else if (activity.namespace === NetworkNamespace.Evm) {
            return getRowForEvmActivity(activity)
        } else {
            return ''
        }
    })

    return `${keys}\n${activityRows.join('\n')}`
}

function getRowForStardustActivity(activity: StardustActivity): string {
    const fields = [
        activity.time,
        activity.action,
        activity.direction,
        activity.sender?.address ?? '',
        activity.recipient?.address ?? '',
        activity.baseTokenTransfer.rawAmount,
        activity.tokenTransfer?.rawAmount ?? '',
        activity.tokenTransfer?.tokenId ?? '',
        activity.transactionFee,
    ]

    return fields.join(',')
}

function getRowForEvmActivity(activity: EvmActivity): string {
    const fields = [
        activity.time,
        activity.action,
        activity.direction,
        activity.sender?.address ?? '',
        activity.recipient?.address ?? '',
        activity.type === EvmActivityType.CoinTransfer ? activity.baseTokenTransfer.rawAmount : '',
        activity.type === EvmActivityType.TokenTransfer ? activity.tokenTransfer.rawAmount : '',
        activity.type === EvmActivityType.TokenTransfer ? activity.tokenTransfer.tokenId : '',
        activity.transactionFee,
    ]

    return fields.join(',')
}
