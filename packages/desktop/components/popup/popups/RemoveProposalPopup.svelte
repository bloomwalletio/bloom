<script lang="ts">
    import { EventStatus } from '@iota/sdk/out/types'
    import { showNotification } from '@auxiliary/notification'
    import { Alert } from '@bloomwalletio/ui'
    import {
        clearSelectedParticipationEventStatus,
        removePersistedProposal,
        selectedProposal,
        selectedProposalId,
    } from '@contexts/governance/stores'
    import { getSelectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { governanceRouter } from '@core/router'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { IAccountState } from '@core/account'
    import { getProposalStatusForMilestone } from '@contexts/governance'
    import { getL1Network } from '@core/network/stores'

    function onCancelClick(): void {
        closePopup()
    }

    async function onConfirmClick(): Promise<void> {
        try {
            const account = getSelectedAccount()
            await account.deregisterParticipationEvent($selectedProposalId)
            updateActiveAccountPersistedData(account.index, {
                removedProposalIds: [...(account.removedProposalIds ?? []), $selectedProposalId],
            })
            $governanceRouter?.previous()
            clearEvent(account)
            closePopup()
            showNotification({
                variant: 'success',
                text: localize('views.governance.proposals.successRemove'),
            })
        } catch (err) {
            handleError(err)
        }
    }

    function clearEvent(account: IAccountState): void {
        removePersistedProposal($selectedProposalId, account.index)
        $selectedProposalId = ''
        clearSelectedParticipationEventStatus()
    }

    // TODO: User can only remove a proposal when he is not voting for it
    const { currentMilestone } = getL1Network()
    $: status = getProposalStatusForMilestone($currentMilestone, $selectedProposal?.milestones)
    $: showAlert = status === EventStatus.Commencing || status === EventStatus.Holding
</script>

<PopupTemplate
    title={localize('popups.removeProposal.title')}
    description={localize('popups.removeProposal.body')}
    backButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    continueButton={{
        text: localize('actions.remove'),
        onClick: onConfirmClick,
    }}
>
    {#if showAlert}
        <Alert variant="info" text={localize('popups.removeProposal.hint')} />
    {/if}
</PopupTemplate>
