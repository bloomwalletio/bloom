<script lang="ts">
    import { IMenuItem, IconName, Menu } from '@bloomwalletio/ui'
    import { IProposal } from '@contexts/governance'
    import { participationOverviewForSelectedAccount } from '@contexts/governance/stores'
    import { isVotingForSelectedProposal } from '@contexts/governance/utils'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { onMount } from 'svelte'

    export let proposal: IProposal

    let menu: Menu | undefined = undefined

    let isVotingForProposal: boolean

    $: isTransferring = $selectedAccount?.isTransferring
    $: isTransferring, $participationOverviewForSelectedAccount, void updateIsVoting() // vote/stop vote changes the isTransferring value. Relying on this requires less updates than relying on proposalsState

    function getDisabled(proposal: IProposal, isVoting: boolean): boolean {
        if (features.governance.removeProposals.enabled) {
            if (proposal.error === undefined) {
                return isVoting
            } else {
                return false
            }
        } else {
            return true
        }
    }

    function onChangeNodeClick(): void {
        openPopup({
            id: PopupId.AddProposal,
            props: {
                initialEventId: proposal.id,
                initialNodeUrl: proposal.nodeUrl,
            },
            overflow: true,
        })
        menu?.close()
    }

    function onRemoveProposalClick(): void {
        openPopup({
            id: PopupId.RemoveProposal,
        })
        menu?.close()
    }

    function updateIsVoting(): void {
        try {
            isVotingForProposal = isVotingForSelectedProposal()
        } catch (err) {
            handleError(err)
        }
    }

    let items: IMenuItem[] = []
    function setItems(proposal: IProposal, isVotingForProposal: boolean): void {
        items = [
            {
                icon: IconName.SettingsSliders,
                text: localize('actions.changeNode'),
                onClick: onChangeNodeClick,
            },
            {
                icon: IconName.Trash,
                text: localize('actions.removeProposal'),
                variant: 'danger',
                disabled: getDisabled(proposal, isVotingForProposal),
                onClick: onRemoveProposalClick,
            },
        ]
    }
    $: setItems(proposal, isVotingForProposal)

    onMount(() => void updateIsVoting())
</script>

<Menu bind:this={menu} {items} />
