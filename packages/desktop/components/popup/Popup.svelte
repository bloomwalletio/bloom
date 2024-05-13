<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { CloseButton } from '@bloomwalletio/ui'
    import {
        closePopup,
        PopupComponentMap,
        PopupId,
        modifyPopupState,
        profileAuthPopup,
    } from '@desktop/auxiliary/popup'

    import { IS_WINDOWS } from '@core/app/constants'
    import { clickOutside } from '@core/utils/ui'
    import ConfirmationDialog from '../ConfirmationDialog.svelte'

    // Popups
    import AccountSwitcherPopup from './popups/AccountSwitcherPopup.svelte'
    import ActivityDetailsPopup from './popups/ActivityDetailsPopup.svelte'
    import AddNodePopup from './popups/AddNodePopup.svelte'
    import AddProposalPopup from './popups/AddProposalPopup.svelte'
    import AliasConfirmationPopup from './popups/AliasConfirmationPopup.svelte'
    import BackupStrongholdPopup from './popups/BackupStrongholdPopup.svelte'
    import BalanceBreakdownPopup from './popups/BalanceBreakdownPopup.svelte'
    import BurnNativeTokensConfirmationPopup from './popups/BurnNativeTokensConfirmationPopup.svelte'
    import BurnNativeTokensPopup from './popups/BurnNativeTokensPopup.svelte'
    import CheckForUpdatesPopup from './popups/CheckForUpdatesPopup.svelte'
    import ConfirmationPopup from './popups/ConfirmationPopup.svelte'
    import CreateAccountPopup from './popups/CreateAccountPopup.svelte'
    import CustomiseAccountPopup from './popups/CustomiseAccountPopup.svelte'
    import DappAccountSwitcherPopup from './popups/DappAccountSwitcherPopup.svelte'
    import DeepLinkErrorPopup from './popups/DeepLinkErrorPopup.svelte'
    import DiagnosticsPopup from './popups/DiagnosticsPopup.svelte'
    import ErrorLogPopup from './popups/ErrorLogPopup.svelte'
    import EvmTransactionFromDappPopup from './popups/EvmTransactionFromDappPopup.svelte'
    import ExportActivitiesPopup from './popups/ExportActivitiesPopup.svelte'
    import FaucetRequestPopup from './popups/FaucetRequestPopup.svelte'
    import ImportErc20TokenFormPopup from './popups/ImportErc20TokenFormPopup.svelte'
    import ImportErc721TokenFormPopup from './popups/ImportErc721TokenFormPopup.svelte'
    import ImportProfilesFromThirdPartyPopup from './popups/ImportProfilesFromThirdPartyPopup.svelte'
    import InputPopup from './popups/InputPopup.svelte'
    import LegalUpdatePopup from './popups/LegalUpdatePopup.svelte'
    import ManageVotingPowerPopup from './popups/ManageVotingPowerPopup.svelte'
    import MarkdownBlockPopup from './popups/MarkdownBlockPopup.svelte'
    import MintNativeTokenConfirmationPopup from './popups/MintNativeTokenConfirmationPopup.svelte'
    import MintNativeTokenFormPopup from './popups/MintNativeTokenFormPopup.svelte'
    import MintNftCollectionConfirmationPopup from './popups/MintNftCollectionConfirmationPopup.svelte'
    import MintNftCollectionFormPopup from './popups/MintNftCollectionFormPopup.svelte'
    import MintNftConfirmationPopup from './popups/MintNftConfirmationPopup.svelte'
    import MintNftFormPopup from './popups/MintNftFormPopup.svelte'
    import NodeAuthRequiredPopup from './popups/NodeAuthRequiredPopup.svelte'
    import NodeInfoPopup from './popups/NodeInfoPopup.svelte'
    import ProfileDiagnosticsPopup from './popups/ProfileDiagnosticsPopup.svelte'
    import ReceiveAddressPopup from './popups/ReceiveAddressPopup.svelte'
    import RemoveProposalPopup from './popups/RemoveProposalPopup.svelte'
    import RevotePopup from './popups/RevotePopup.svelte'
    import SendFlowPopup from './popups/SendFlowPopup.svelte'
    import SiwePopup from './popups/SiwePopup.svelte'
    import SignTypedDataPopup from './popups/SignTypedDataPopup.svelte'
    import SignMessagePopup from './popups/SignMessagePopup.svelte'
    import StopVotingPopup from './popups/StopVotingPopup.svelte'
    import SuccessfulDappInteraction from './popups/SuccessfulDappInteraction.svelte'
    import SyncAccountsPopup from './popups/SyncAccountsPopup.svelte'
    import TestDeepLinkFormPopup from './popups/TestDeepLinkFormPopup.svelte'
    import TokenInformationPopup from './popups/TokenInformationPopup.svelte'
    import VoteForProposal from './popups/VoteForProposalPopup.svelte'
    import VotingPowerToZeroPopup from './popups/VotingPowerToZeroPopup.svelte'
    import { localize } from '@core/i18n'

    export let id: PopupId
    export let props: any
    export let hideClose: boolean = false
    export let preventClose: boolean = false
    export let transition = true
    export let overflow = false
    export let autofocusContent = true
    export let relative = true
    export let confirmClickOutside = false

    enum PopupSize {
        Small = 'small',
        Medium = 'medium',
        Large = 'large',
        Fit = 'fit',
    }

    let size: PopupSize = PopupSize.Medium

    $: switch (id) {
        default:
            size = PopupSize.Medium
            break
    }

    let popupContent
    let confirmationDialog: ConfirmationDialog

    const POPUP_MAP: PopupComponentMap = {
        [PopupId.AccountSwitcher]: AccountSwitcherPopup,
        [PopupId.ActivityDetails]: ActivityDetailsPopup,
        [PopupId.AddNode]: AddNodePopup,
        [PopupId.AddProposal]: AddProposalPopup,
        [PopupId.AliasConfirmation]: AliasConfirmationPopup,
        [PopupId.BackupStronghold]: BackupStrongholdPopup,
        [PopupId.BalanceBreakdown]: BalanceBreakdownPopup,
        [PopupId.BurnNativeTokensConfirmation]: BurnNativeTokensConfirmationPopup,
        [PopupId.BurnNativeTokens]: BurnNativeTokensPopup,
        [PopupId.CheckForUpdates]: CheckForUpdatesPopup,
        [PopupId.Confirmation]: ConfirmationPopup,
        [PopupId.CreateAccount]: CreateAccountPopup,
        [PopupId.CustomiseAccount]: CustomiseAccountPopup,
        [PopupId.DappAccountSwitcher]: DappAccountSwitcherPopup,
        [PopupId.DeepLinkError]: DeepLinkErrorPopup,
        [PopupId.Diagnostics]: DiagnosticsPopup,
        [PopupId.ErrorLog]: ErrorLogPopup,
        [PopupId.EvmTransactionFromDapp]: EvmTransactionFromDappPopup,
        [PopupId.ExportActivities]: ExportActivitiesPopup,
        [PopupId.FaucetRequest]: FaucetRequestPopup,
        [PopupId.ImportErc20Token]: ImportErc20TokenFormPopup,
        [PopupId.ImportErc721Token]: ImportErc721TokenFormPopup,
        [PopupId.ImportProfilesFromThirdParty]: ImportProfilesFromThirdPartyPopup,
        [PopupId.Input]: InputPopup,
        [PopupId.LegalUpdate]: LegalUpdatePopup,
        [PopupId.ManageVotingPower]: ManageVotingPowerPopup,
        [PopupId.MarkdownBlock]: MarkdownBlockPopup,
        [PopupId.MintNativeTokenConfirmation]: MintNativeTokenConfirmationPopup,
        [PopupId.MintNativeTokenForm]: MintNativeTokenFormPopup,
        [PopupId.MintNftConfirmation]: MintNftConfirmationPopup,
        [PopupId.MintNftForm]: MintNftFormPopup,
        [PopupId.MintNftCollectionForm]: MintNftCollectionFormPopup,
        [PopupId.MintNftCollectionConfirmation]: MintNftCollectionConfirmationPopup,
        [PopupId.NodeAuthRequired]: NodeAuthRequiredPopup,
        [PopupId.NodeInfo]: NodeInfoPopup,
        [PopupId.ProfileDiagnostics]: ProfileDiagnosticsPopup,
        [PopupId.ReceiveAddress]: ReceiveAddressPopup,
        [PopupId.RemoveProposal]: RemoveProposalPopup,
        [PopupId.Revote]: RevotePopup,
        [PopupId.SendFlow]: SendFlowPopup,
        [PopupId.Siwe]: SiwePopup,
        [PopupId.SignTypedData]: SignTypedDataPopup,
        [PopupId.SignMessage]: SignMessagePopup,
        [PopupId.StopVoting]: StopVotingPopup,
        [PopupId.SuccessfulDappInteraction]: SuccessfulDappInteraction,
        [PopupId.SyncAccounts]: SyncAccountsPopup,
        [PopupId.TestDeepLinkForm]: TestDeepLinkFormPopup,
        [PopupId.TokenInformation]: TokenInformationPopup,
        [PopupId.VoteForProposal]: VoteForProposal,
        [PopupId.VotingPowerToZero]: VotingPowerToZeroPopup,
    }

    function onKey(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            tryClosePopup()
        }
    }

    function tryClosePopup(): void {
        if (!preventClose) {
            closePopup({ callOnCancel: true })
        }
    }

    function tryClosePopupOnClickOutside(): void {
        if ($profileAuthPopup.active) {
            return
        }
        if (!preventClose) {
            if (confirmClickOutside) {
                confirmationDialog?.openDialog()
            } else {
                closePopup({ callOnCancel: true })
            }
        }
    }

    function focusableElements(): HTMLElement[] {
        return [
            ...popupContent.querySelectorAll(
                'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
            ),
        ].filter((el) => !el.hasAttribute('disabled'))
    }

    function onFocusFirst(event: FocusEvent): void {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[elems.length - 1].focus()
        }
        event.preventDefault()
    }

    function onFocusLast(event: FocusEvent): void {
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[0].focus()
        }
        event.preventDefault()
    }

    onMount(() => {
        if (!autofocusContent) {
            return
        }
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[hideClose || elems.length === 1 ? 0 : 1].focus()
        }
    })
</script>

<svelte:window on:keydown={onKey} />

<overlay
    in:fade|global={{ duration: transition ? 100 : 0 }}
    class:overflow-hidden={overflow}
    class="flex items-center justify-center fixed {IS_WINDOWS
        ? 'top-7'
        : 'top-0'} left-0 w-screen h-full z-30 bg-neutral-6/75
        {$profileAuthPopup.active && 'opacity-0 pointer-events-none'}
        "
>
    <button type="button" tabindex="0" on:focus={onFocusFirst} />
    <popup
        use:clickOutside
        on:clickOutside={tryClosePopupOnClickOutside}
        bind:this={popupContent}
        class:relative
        class="popup {size}"
    >
        <svelte:component this={POPUP_MAP[id]} {...props} />
        {#if !hideClose}
            <CloseButton on:click={tryClosePopup} size="sm" class="absolute top-8 right-8 p-2" />
        {/if}
    </popup>
    <button type="button" tabindex="0" on:focus={onFocusLast} />
</overlay>
{#if confirmClickOutside}
    <ConfirmationDialog
        bind:this={confirmationDialog}
        onConfirm={() => {
            modifyPopupState({ confirmClickOutside: false })
            closePopup()
        }}
        confirmText={localize('actions.close')}
        title="Close popup"
        variant="danger"
        alert={{ variant: 'danger', text: localize('warning.closePopup') }}
    />
{/if}

<style lang="postcss">
    :global(.popup) {
        @apply w-full p-0 max-h-full;
        @apply bg-surface dark:bg-surface-dark;
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply shadow-elevation-4;
        border-radius: 32px;
    }

    .medium {
        max-width: 480px;
    }
    .large {
        max-width: 630px;
    }
</style>
