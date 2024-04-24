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
import { isEvmTokenActivity } from '../utils/isEvmTokenActivity'

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
            if (_activity.namespace === NetworkNamespace.Stardust) {
                const containsAssets =
                    _activity.type === StardustActivityType.Basic || _activity.type === StardustActivityType.Foundry
                if (!_activity.isHidden && !containsAssets) {
                    return true
                }

                const tokenId = _activity.tokenTransfer?.tokenId ?? _activity.baseTokenTransfer.tokenId
                const token = containsAssets ? getPersistedToken(_activity.sourceNetworkId, tokenId) : undefined
                const hasValidAsset = token?.metadata && isValidIrc30Token(token.metadata)
                return !_activity.isHidden && hasValidAsset
            } else if (_activity.namespace === NetworkNamespace.Evm) {
                return !_activity.isHidden
            } else {
                return false
            }
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
    const { sourceNetworkId, direction, action } = activity

    if (activity.namespace === NetworkNamespace.Stardust) {
        if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
            fieldsToSearch.push(String(activity.baseTokenTransfer.rawAmount))
            fieldsToSearch.push(activity.baseTokenTransfer.tokenId)

            const { rawAmount, tokenId } = activity.tokenTransfer ?? activity.baseTokenTransfer ?? {}

            fieldsToSearch.push(tokenId)
            fieldsToSearch.push(String(rawAmount))

            const tokenName = getPersistedToken(activity.sourceNetworkId, tokenId)?.metadata?.name
            if (tokenName) {
                fieldsToSearch.push(tokenName)
            }

            fieldsToSearch.push(
                getFormattedAmountFromActivity(
                    rawAmount,
                    tokenId,
                    sourceNetworkId,
                    direction,
                    action,
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
                    sourceNetworkId,
                    direction,
                    action,
                    false
                )?.toLowerCase()
            )
        } else if (isEvmTokenActivity(activity)) {
            const { rawAmount, tokenId, standard } = activity.tokenTransfer

            fieldsToSearch.push(String(rawAmount))
            fieldsToSearch.push(tokenId)

            if (standard === TokenStandard.Erc20 || standard === TokenStandard.Irc30) {
                const tokenName = getPersistedToken(sourceNetworkId, tokenId)?.metadata?.name
                if (tokenName) {
                    fieldsToSearch.push(tokenName)
                }

                fieldsToSearch.push(
                    getFormattedAmountFromActivity(
                        rawAmount,
                        tokenId,
                        sourceNetworkId,
                        direction,
                        action,
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
        activity.subject.name && fieldsToSearch.push(activity.subject.name)
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
