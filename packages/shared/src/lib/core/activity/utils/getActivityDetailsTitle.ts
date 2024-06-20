import { localize } from '@core/i18n'
import { ActivityAction, StardustActivityType } from '../enums'
import { Activity } from '../types'
import { getVotingEvent } from '@contexts/governance/actions'
import { truncateString } from '@core/utils'
import { getNameFromSubject } from './helper'
import { NetworkNamespace } from '@core/network/enums'
import { EvmActivityType } from '../enums/evm'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'

export async function getActivityDetailsTitle(activity: Activity): Promise<string> {
    const localizationPrefix = 'popups.activityDetails.title'

    if (activity.namespace === NetworkNamespace.Stardust) {
        if (activity.type === StardustActivityType.Consolidation) {
            const key = `${localizationPrefix}.consolidation.${activity.inclusionState}`
            return localize(key)
        } else if (activity.type === StardustActivityType.Alias) {
            const key = `${localizationPrefix}.alias.creation.${activity.inclusionState}`
            return localize(key)
        } else if (activity.type === StardustActivityType.Governance) {
            let proposalName: string = ''
            if (activity?.participation?.eventId) {
                try {
                    proposalName = (await getVotingEvent(activity.participation.eventId)).data.name
                } catch (err) {
                    proposalName = truncateString(activity.participation?.eventId, 6, 6)
                }
            }
            const key = `${localizationPrefix}.governance.${activity.governanceAction}.${activity.inclusionState}`
            return localize(key, { proposalName })
        } else if (activity.action === ActivityAction.Send) {
            const key = `${localizationPrefix}.${(activity.isInternal ? 'internal.' : 'external.') + activity.direction}.${
                activity.inclusionState
            }`
            const displayedSubject = getNameFromSubject(
                activity.subject,
                true,
                activity.type === StardustActivityType.Basic && activity?.isShimmerClaiming
            )

            return localize(key, { subject: displayedSubject })
        } else if (activity.action === ActivityAction.Mint || activity.action === ActivityAction.Burn) {
            const key = `${localizationPrefix}.${activity.action}.${activity.inclusionState}`
            const displayedSubject = getNameFromSubject(activity.subject, true)

            return localize(key, { subject: displayedSubject })
        } else {
            return localize(`${localizationPrefix}.fallback`)
        }
    } else if (activity.namespace === NetworkNamespace.Evm) {
        if (
            activity.type === EvmActivityType.CoinTransfer ||
            activity.type === EvmActivityType.TokenTransfer ||
            activity.type === EvmActivityType.BalanceChange
        ) {
            const key = `${localizationPrefix}.${(activity.isInternal ? 'internal.' : 'external.') + activity.direction}.${
                activity.inclusionState
            }`
            const displayedSubject = getNameFromSubject(activity.subject, true)

            return localize(key, { subject: displayedSubject })
        } else if (activity.type === EvmActivityType.TokenMinting) {
            const displayedSubject = getNameFromSubject(activity.subject, true)

            return localize(`${localizationPrefix}.mint.${activity.inclusionState}`, { subject: displayedSubject })
        } else if (activity.type === EvmActivityType.ContractCall) {
            const displayedSubject = getNameFromSubject(activity.subject, true)

            return localize('general.contractCall') + ` - ${displayedSubject}`
        } else if (activity.type === EvmActivityType.TokenApproval) {
            const key = `${localizationPrefix}.tokenApproval.${activity.inclusionState}`
            const token = getTokenFromSelectedAccountTokens(activity.tokenTransfer.tokenId, activity.sourceNetworkId)

            // We are looking for the spender by address because the input name does not have to be 'spender'
            const spender = activity.inputs?.find((input) => input.type === 'address')?.value as string | undefined

            return localize(key, {
                address: spender ? truncateString(spender, 4, 6) : '',
                assetName: token?.metadata?.name ?? '',
            })
        } else {
            return localize(`${localizationPrefix}.fallback`)
        }
    } else {
        return localize(`${localizationPrefix}.fallback`)
    }
}
