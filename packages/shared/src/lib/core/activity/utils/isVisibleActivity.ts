import { selectedAccountIndex } from '@core/account/stores'
import { NetworkNamespace } from '@core/network'
import { NftStandard } from '@core/nfts'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { BASE_TOKEN_ID, TokenStandard, convertToRawAmount } from '@core/token'
import { getPersistedToken } from '@core/token/stores'
import { dateIsAfterOtherDate, dateIsBeforeOtherDate, datesOnSameDay } from '@core/utils'
import {
    BooleanFilterOption,
    DateFilterOption,
    DateUnit,
    InternalExternalOption,
    NumberFilterOption,
    StatusFilterOption,
} from '@core/utils/enums/filters'
import { get } from 'svelte/store'
import { ActivityTypeFilterOption, InclusionState, StardustActivityAsyncStatus, StardustActivityType } from '../enums'
import { EvmActivityType } from '../enums/evm'
import { activityFilter } from '../stores'
import { Activity, ActivityFilter } from '../types'
import { isEvmTokenActivity } from './isEvmTokenActivity'

// Filters activities based on activity properties. If none of the conditionals are valid, then activity is shown.
export function isVisibleActivity(activity: Activity): boolean {
    const filter = get(activityFilter)

    if (!isVisibleWithActiveValuelessFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveHiddenFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveRejectedFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveTokenFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveAmountFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveDateFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveStatusFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveTypeFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithActiveDirectionFilter(activity, filter)) {
        return false
    }
    if (!isVisibleWithInternalExternalFilter(activity, filter)) {
        return false
    }
    return true
}

function isVisibleWithActiveHiddenFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (
        (!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) &&
        activity.isTokenHidden
    ) {
        return false
    }
    return true
}

function doesActivityContainScamNft(activity: Activity): boolean {
    if (activity.type === StardustActivityType.Nft) {
        const nft = getNftByIdFromAllAccountNfts(get(selectedAccountIndex), activity.nftId)
        return nft?.isScam ?? false
    } else {
        return false
    }
}

function isVisibleWithActiveValuelessFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (
        (!filter.showSpam.active || filter.showSpam.selected === BooleanFilterOption.No) &&
        (!filter.showHidden.active || filter.showHidden.selected === BooleanFilterOption.No) &&
        (activity.isSpam || doesActivityContainScamNft(activity))
    ) {
        return false
    }
    return true
}

function isVisibleWithActiveRejectedFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (
        (!filter.showRejected.active || filter.showRejected.selected === BooleanFilterOption.No) &&
        activity.namespace === NetworkNamespace.Stardust &&
        activity.asyncData?.isRejected
    ) {
        return false
    }
    return true
}

function isVisibleWithActiveTokenFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.token.active && filter.token.selected) {
        if (activity.namespace === NetworkNamespace.Stardust) {
            if (activity.type !== StardustActivityType.Basic && activity.type !== StardustActivityType.Foundry) {
                return false
            }
            const tokenId = activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer?.tokenId ?? BASE_TOKEN_ID
            if (filter.token.selected && tokenId !== filter.token.selected) {
                return false
            }
        }
        if (activity.namespace === NetworkNamespace.Evm) {
            const tokenId = isEvmTokenActivity(activity) ? activity.tokenTransfer?.tokenId : BASE_TOKEN_ID
            if (filter.token.selected && tokenId !== filter.token.selected) {
                return false
            }
        }
        return true
    }
    return true
}

function isVisibleWithActiveAmountFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.amount.active) {
        let rawAmount: bigint | undefined = undefined
        let tokenId: string | undefined = undefined

        if (activity.namespace === NetworkNamespace.Evm) {
            if (isEvmTokenActivity(activity)) {
                rawAmount = activity.tokenTransfer.rawAmount
                tokenId = activity.tokenTransfer.tokenId
            } else if (activity.type === EvmActivityType.CoinTransfer) {
                rawAmount = activity.baseTokenTransfer.rawAmount
                tokenId = activity.baseTokenTransfer.tokenId
            } else {
                return true
            }
        } else if (activity.namespace === NetworkNamespace.Stardust) {
            if (activity.type !== StardustActivityType.Basic && activity.type !== StardustActivityType.Foundry) {
                return true
            }
            rawAmount = (activity.tokenTransfer ?? activity.baseTokenTransfer)?.rawAmount
            tokenId = (activity.tokenTransfer ?? activity.baseTokenTransfer)?.tokenId
        } else {
            return true
        }
        const token = getPersistedToken(activity.sourceNetworkId, tokenId)

        if (!token || !token.metadata) {
            return false
        }

        if (
            filter.amount.selected === NumberFilterOption.Equal &&
            filter.amount.subunit.type === 'single' &&
            filter.amount.subunit.amount
        ) {
            const amount = convertToRawAmount(String(filter.amount.subunit.amount), token.metadata)
            const isEqual = amount && rawAmount === amount
            if (!isEqual) {
                return false
            }
        }
        if (
            filter.amount.selected === NumberFilterOption.Range &&
            filter.amount.subunit.type === 'range' &&
            filter.amount.subunit.start &&
            filter.amount.subunit.end
        ) {
            const startAmount = convertToRawAmount(String(filter.amount.subunit.start), token.metadata)
            const endAmount = convertToRawAmount(String(filter.amount.subunit.end), token.metadata)
            const isInRange = startAmount && endAmount && rawAmount <= endAmount && rawAmount >= startAmount
            if (!isInRange) {
                return false
            }
        }
        if (
            filter.amount.selected === NumberFilterOption.Greater &&
            filter.amount.subunit.type === 'single' &&
            filter.amount.subunit.amount
        ) {
            const amount = convertToRawAmount(String(filter.amount.subunit.amount), token.metadata)
            const isGreater = amount && rawAmount >= amount
            if (!isGreater) {
                return false
            }
        }
        if (
            filter.amount.selected === NumberFilterOption.Less &&
            filter.amount.subunit.type === 'single' &&
            filter.amount.subunit.amount
        ) {
            const amount = convertToRawAmount(String(filter.amount.subunit.amount), token.metadata)
            const isLess = amount && rawAmount <= amount
            if (!isLess) {
                return false
            }
        }
    }
    return true
}

function isVisibleWithActiveDateFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.date.active) {
        if (
            filter.date.selected === DateFilterOption.Equals &&
            filter.date.subunit.type === 'single' &&
            filter.date.subunit.value
        ) {
            const filterDate = new Date(filter.date.subunit.value)
            if (!datesOnSameDay(activity.time, filterDate)) {
                return false
            }
        }
        if (
            filter.date.selected === DateFilterOption.Before &&
            filter.date.subunit.type === 'single' &&
            filter.date.subunit.value
        ) {
            const filterDate = new Date(filter.date.subunit.value)
            if (!dateIsBeforeOtherDate(activity.time, filterDate)) {
                return false
            }
        }
        if (
            filter.date.selected === DateFilterOption.After &&
            filter.date.subunit.type === 'single' &&
            filter.date.subunit.value
        ) {
            const filterDate = new Date(filter.date.subunit.value)
            if (!dateIsAfterOtherDate(activity.time, filterDate)) {
                return false
            }
        }
        if (
            filter.date.selected === DateFilterOption.AfterOrEquals &&
            filter.date.subunit.type === 'single' &&
            filter.date.subunit.value
        ) {
            const filterDate = new Date(filter.date.subunit.value)
            if (!(dateIsAfterOtherDate(activity.time, filterDate) || datesOnSameDay(activity.time, filterDate))) {
                return false
            }
        }
        if (
            filter.date.selected === DateFilterOption.Range &&
            filter.date.subunit.type === 'range' &&
            filter.date.subunit.start &&
            filter.date.subunit.end
        ) {
            const startFilterDate = new Date(filter.date.subunit.start)
            const endFilterDate = new Date(filter.date.subunit.end)

            const isInRange =
                dateIsAfterOtherDate(activity.time, startFilterDate) &&
                dateIsBeforeOtherDate(activity.time, endFilterDate)
            const isOnBoundaries =
                datesOnSameDay(activity.time, startFilterDate) || datesOnSameDay(activity.time, endFilterDate)
            if (!(isInRange || isOnBoundaries)) {
                return false
            }
        }
        if (filter.date.selected === DateFilterOption.Last && filter.date.subunit.type === 'unit') {
            const startFilterDate = new Date()
            const endFilterDate = new Date()
            switch (filter.date.subunit.unit) {
                case DateUnit.Days:
                    startFilterDate.setDate(startFilterDate.getDate() - Number(filter.date.subunit.amount))
                    break
                case DateUnit.Months:
                    startFilterDate.setMonth(startFilterDate.getMonth() - Number(filter.date.subunit.amount))
                    break
                case DateUnit.Years:
                    startFilterDate.setFullYear(startFilterDate.getFullYear() - Number(filter.date.subunit.amount))
                    break
            }

            const isInRange =
                dateIsAfterOtherDate(activity.time, startFilterDate) &&
                dateIsBeforeOtherDate(activity.time, endFilterDate)
            const isOnBoundaries =
                datesOnSameDay(activity.time, startFilterDate) || datesOnSameDay(activity.time, endFilterDate)
            if (!(isInRange || isOnBoundaries)) {
                return false
            }
        }
    }
    return true
}

function isVisibleWithActiveStatusFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.status.active && filter.status.selected) {
        if (
            filter.status.selected === StatusFilterOption.Confirmed &&
            activity.inclusionState !== InclusionState.Confirmed
        ) {
            return false
        }
        if (
            filter.status.selected === StatusFilterOption.Pending &&
            activity.inclusionState !== InclusionState.Pending
        ) {
            return false
        }
        if (
            filter.status.selected === StatusFilterOption.Timelocked &&
            activity.namespace === NetworkNamespace.Stardust &&
            activity.asyncData?.asyncStatus !== StardustActivityAsyncStatus.Timelocked
        ) {
            return false
        }
        if (
            filter.status.selected === StatusFilterOption.Claimed &&
            activity.type === StardustActivityType.Basic &&
            activity.asyncData?.asyncStatus !== StardustActivityAsyncStatus.Claimed
        ) {
            return false
        }
        if (
            filter.status.selected === StatusFilterOption.Unclaimed &&
            activity.type === StardustActivityType.Basic &&
            (!activity.asyncData?.asyncStatus ||
                activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Claimed)
        ) {
            return false
        }
    }
    return true
}

function isVisibleWithActiveTypeFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.type.active && filter.type.selected) {
        if (activity.namespace === NetworkNamespace.Stardust) {
            switch (filter.type.selected) {
                case ActivityTypeFilterOption.Transfer:
                    if (activity.type !== StardustActivityType.Basic) {
                        return false
                    }
                    break
                case ActivityTypeFilterOption.SmartContract:
                    if (!activity.smartContract) {
                        return false
                    }
                    break
                case ActivityTypeFilterOption.Nft:
                    if (activity.type !== StardustActivityType.Nft) {
                        return false
                    }
                    break
                case ActivityTypeFilterOption.Alias:
                    if (activity.type !== StardustActivityType.Alias) {
                        return false
                    }
                    break
                case ActivityTypeFilterOption.Consolidation:
                    if (activity.type !== StardustActivityType.Consolidation) {
                        return false
                    }
                    break
                case ActivityTypeFilterOption.Foundry:
                    if (activity.type !== StardustActivityType.Foundry) {
                        return false
                    }
                    break
                case ActivityTypeFilterOption.Governance:
                    if (activity.type !== StardustActivityType.Governance) {
                        return false
                    }
                    break
                default:
                    return false
            }
        } else if (activity.namespace === NetworkNamespace.Evm) {
            switch (filter.type.selected) {
                case ActivityTypeFilterOption.Transfer: {
                    const isTokenTransfer =
                        isEvmTokenActivity(activity) &&
                        (activity.tokenTransfer.standard === TokenStandard.Erc20 ||
                            activity.tokenTransfer.standard === TokenStandard.Irc30)
                    if (activity.type !== EvmActivityType.CoinTransfer && !isTokenTransfer) {
                        return false
                    }
                    break
                }
                case ActivityTypeFilterOption.SmartContract:
                    if (activity.type !== EvmActivityType.ContractCall) {
                        return false
                    }
                    break
                case ActivityTypeFilterOption.Nft: {
                    const isNftTransfer =
                        isEvmTokenActivity(activity) &&
                        (activity.tokenTransfer.standard === NftStandard.Erc721 ||
                            activity.tokenTransfer.standard === NftStandard.Irc27)
                    if (!isNftTransfer) {
                        return false
                    }
                    break
                }
                default:
                    return false
            }
        }
    }
    return true
}

function isVisibleWithActiveDirectionFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.direction.active && filter.direction.selected) {
        if (filter.direction.selected !== activity.direction) {
            return false
        }
    }
    return true
}

function isVisibleWithInternalExternalFilter(activity: Activity, filter: ActivityFilter): boolean {
    if (filter.internalExternal.active && filter.internalExternal.selected) {
        if (filter.internalExternal.selected === InternalExternalOption.Internal && !activity.isInternal) {
            return false
        }
        if (filter.internalExternal.selected === InternalExternalOption.External && activity.isInternal) {
            return false
        }
    }
    return true
}
