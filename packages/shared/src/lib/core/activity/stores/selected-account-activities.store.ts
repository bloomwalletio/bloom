import { SubjectType } from '@core/wallet/enums'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'
import { DEFAULT_ACTIVITY_FILTER } from '../constants'
import { StardustActivityType } from '../enums'
import { Activity, ActivityFilter } from '../types'
import { isVisibleActivity } from '../utils/isVisibleActivity'
import { getFormattedAmountFromActivity } from '../utils/outputs'
import { allAccountActivities } from './all-account-activities.store'
import { isValidIrc30Token } from '@core/token/utils'
import { getPersistedToken } from '@core/token/stores'
import { NetworkNamespace } from '@core/network'
import { EvmActivityType } from '../enums/evm'
import { TokenStandard } from '@core/token/enums'

export const selectedAccountActivities: Readable<Activity[]> = derived(
    [selectedAccount, allAccountActivities],
    ([$selectedAccount, $allAccountActivities]) => {
        if ($selectedAccount) {
            return $allAccountActivities[$selectedAccount?.index] ?? []
        } else {
            return []
        }
    }
)

export const activityFilter: Writable<ActivityFilter> = writable(DEFAULT_ACTIVITY_FILTER)

export const activitySearchTerm: Writable<string> = writable('')

export const queriedActivities: Readable<Activity[]> = derived(
    [selectedAccountActivities, activitySearchTerm, activityFilter],
    ([$selectedAccountActivities, $activitySearchTerm]) => {
        let activityList = $selectedAccountActivities.filter((_activity) => {
            const containsAssets =
                _activity.type === StardustActivityType.Basic || _activity.type === StardustActivityType.Foundry
            if (!_activity.isHidden && !containsAssets) {
                return true
            }

            const tokenId = _activity.tokenTransfer?.tokenId ?? _activity.baseTokenTransfer.tokenId
            const token =
                _activity.type === StardustActivityType.Basic || _activity.type === StardustActivityType.Foundry
                    ? getPersistedToken(tokenId)
                    : undefined
            const hasValidAsset = token?.metadata && isValidIrc30Token(token.metadata)
            return !_activity.isHidden && hasValidAsset
        })

        activityList = activityList.filter((activity) => isVisibleActivity(activity))

        if ($activitySearchTerm) {
            activityList = activityList.filter((activity) => {
                const fieldsToSearch = getFieldsToSearchFromActivity(activity)
                return fieldsToSearch.find((field) =>
                    field?.toLowerCase()?.includes($activitySearchTerm?.toLowerCase())
                )
            })
        }

        return activityList.sort((activity1, activity2) => activity2.time.getTime() - activity1.time.getTime())
    }
)

function getFieldsToSearchFromActivity(activity: Activity): string[] {
    if (!activity) return []
    const fieldsToSearch: string[] = []

    if (activity.transactionId) {
        fieldsToSearch.push(activity.transactionId)
    }

    if (activity.namespace === NetworkNamespace.Stardust) {
        if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
            fieldsToSearch.push(String(activity.baseTokenTransfer.rawAmount))
            fieldsToSearch.push(activity.baseTokenTransfer.tokenId)

            const baseTokenName = getPersistedToken(activity.baseTokenTransfer.tokenId)?.metadata?.name
            if (baseTokenName) {
                fieldsToSearch.push(baseTokenName)
            }

            if (activity.tokenTransfer) {
                fieldsToSearch.push(activity.tokenTransfer.tokenId)
                fieldsToSearch.push(String(activity.tokenTransfer.rawAmount))

                const tokenName = getPersistedToken(activity.tokenTransfer.tokenId)?.metadata?.name
                if (tokenName) {
                    fieldsToSearch.push(tokenName)
                }
            }
            const { rawAmount, tokenId } = activity.tokenTransfer ?? activity.baseTokenTransfer ?? {}

            fieldsToSearch.push(
                getFormattedAmountFromActivity(
                    rawAmount,
                    tokenId,
                    activity.direction,
                    activity.action,
                    false
                )?.toLowerCase()
            )
        }
    } else if (activity.namespace === NetworkNamespace.Evm) {
        if (activity.type === EvmActivityType.CoinTransfer) {
            fieldsToSearch.push(String(activity.baseTokenTransfer.rawAmount))

            fieldsToSearch.push(
                getFormattedAmountFromActivity(
                    activity.baseTokenTransfer.rawAmount,
                    activity.baseTokenTransfer.tokenId,
                    activity.direction,
                    activity.action,
                    false
                )?.toLowerCase()
            )
        } else if (activity.type === EvmActivityType.TokenTransfer) {
            fieldsToSearch.push(String(activity.tokenTransfer.rawAmount))
            fieldsToSearch.push(String(activity.tokenTransfer.tokenId))

            if (
                activity.tokenTransfer?.standard === TokenStandard.Erc20 ||
                activity.tokenTransfer?.standard === TokenStandard.Irc30
            ) {
                fieldsToSearch.push(
                    getFormattedAmountFromActivity(
                        activity.tokenTransfer.rawAmount,
                        activity.tokenTransfer.tokenId,
                        activity.direction,
                        activity.action,
                        false
                    )?.toLowerCase()
                )
            }
        }
    }

    if (activity.subject) {
        fieldsToSearch.push(activity.subject.address)
    }
    if (activity.subject?.type === SubjectType.Account) {
        fieldsToSearch.push(activity.subject.account?.name)
    } else if (activity.subject?.type === SubjectType.Contact) {
        fieldsToSearch.push(activity.subject.contact.name)
    } else if (activity.subject?.type === SubjectType.SmartContract) {
        fieldsToSearch.push(activity.subject.name)
    } else if (activity.subject?.type === SubjectType.Network) {
        fieldsToSearch.push(activity.subject.name)
    }

    if (activity.metadata) {
        fieldsToSearch.push(activity.metadata)
    }

    if (activity.namespace === NetworkNamespace.Stardust) {
        if (activity.asyncData?.claimingTransactionId) {
            fieldsToSearch.push(activity.asyncData.claimingTransactionId)
        }

        if (activity.tag) {
            fieldsToSearch.push(activity.tag)
        }

        if (activity.outputId) {
            fieldsToSearch.push(activity.outputId)
        }
    }

    return fieldsToSearch
}
