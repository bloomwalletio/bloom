import { derived, Readable, writable, Writable } from 'svelte/store'
import { getPersistedToken } from '@core/token/stores'
import { isValidIrc30Token } from '@core/token/utils'
import { SubjectType } from '@core/wallet/enums'
import { selectedAccount } from '../../account/stores/selected-account.store'
import { DEFAULT_ACTIVITY_FILTER } from '../constants'
import { ActivityType } from '../enums'
import { ActivityFilter } from '../types'
import { Activity } from '../types/activity.type'
import { isVisibleActivity } from '../utils/isVisibleActivity'
import { getFormattedAmountFromActivity } from '../utils/outputs'
import { allAccountActivities } from './all-account-activities.store'

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
            const containsAssets = _activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry
            if (!_activity.isHidden && !containsAssets) {
                return true
            }

            const tokenId = _activity.tokenTransfer?.tokenId ?? _activity.baseTokenTransfer.tokenId
            const token =
                _activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry
                    ? getPersistedToken(tokenId)
                    : undefined
            const hasValidAsset = token?.metadata && isValidIrc30Token(token.metadata)
            return !_activity.isHidden && hasValidAsset
        })

        activityList = activityList.filter((activity) => isVisibleActivity(activity))

        if ($activitySearchTerm) {
            activityList = activityList.filter((activity) => {
                const fieldsToSearch = getFieldsToSearchFromActivity(activity)
                return fieldsToSearch.find(
                    (field) => field?.toLowerCase()?.includes($activitySearchTerm?.toLowerCase())
                )
            })
        }

        return activityList.sort((activity1, activity2) => activity2.time.getTime() - activity1.time.getTime())
    }
)

function getFieldsToSearchFromActivity(activity: Activity): string[] {
    const fieldsToSearch: string[] = []

    if (activity?.transactionId) {
        fieldsToSearch.push(activity.transactionId)
    }

    if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        fieldsToSearch.push(activity.baseTokenTransfer.tokenId)

        const baseTokenName = getPersistedToken(activity.baseTokenTransfer.tokenId)?.metadata?.name
        if (baseTokenName) {
            fieldsToSearch.push(baseTokenName)
        }

        if (activity.tokenTransfer) {
            fieldsToSearch.push(activity.tokenTransfer.tokenId)

            const tokenName = getPersistedToken(activity.tokenTransfer.tokenId)?.metadata?.name
            if (tokenName) {
                fieldsToSearch.push(tokenName)
            }
        }
    }

    if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        fieldsToSearch.push(activity.baseTokenTransfer.rawAmount)

        if (activity.tokenTransfer) {
            fieldsToSearch.push(activity.tokenTransfer.rawAmount)
        }
        fieldsToSearch.push(getFormattedAmountFromActivity(activity, false)?.toLowerCase())
    }

    if (activity.subject) {
        fieldsToSearch.push(activity.subject.address)
    }
    if (activity.subject?.type === SubjectType.Account) {
        fieldsToSearch.push(activity.subject.account?.name)
    } else if (activity.subject?.type === SubjectType.Contact) {
        fieldsToSearch.push(activity.subject.contact.name)
    }

    if (activity?.asyncData?.claimingTransactionId) {
        fieldsToSearch.push(activity.asyncData.claimingTransactionId)
    }

    if (activity?.metadata) {
        fieldsToSearch.push(activity.metadata)
    }

    if (activity?.tag) {
        fieldsToSearch.push(activity.tag)
    }

    if (activity.outputId) {
        fieldsToSearch.push(activity.outputId)
    }

    return fieldsToSearch
}
