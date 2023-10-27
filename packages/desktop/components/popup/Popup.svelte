<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { CloseButton } from '@bloomwalletio/ui'
    import { closePopup, PopupComponentMap, PopupId } from '@desktop/auxiliary/popup'
    import { IS_WINDOWS } from '@core/app/constants'
    import { clickOutside } from '@core/utils/ui'

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
    import ConnectLedgerPopup from './popups/ConnectLedgerPopup.svelte'
    import CreateAccountPopup from './popups/CreateAccountPopup.svelte'
    import CustomiseAccountPopup from './popups/CustomiseAccountPopup.svelte'
    import DeepLinkErrorPopup from './popups/DeepLinkErrorPopup.svelte'
    import DiagnosticsPopup from './popups/DiagnosticsPopup.svelte'
    import EnableLedgerBlindSigningPopup from './popups/EnableLedgerBlindSigningPopup.svelte'
    import ErrorLogPopup from './popups/ErrorLogPopup.svelte'
    import FaucetRequestPopup from './popups/FaucetRequestPopup.svelte'
    import ImportErc20TokenFormPopup from './popups/ImportErc20TokenFormPopup.svelte'
    import LedgerConnectionGuidePopup from './popups/LedgerConnectionGuidePopup.svelte'
    import LegalUpdatePopup from './popups/LegalUpdatePopup.svelte'
    import ManageVotingPowerPopup from './popups/ManageVotingPowerPopup.svelte'
    import MintNativeTokenConfirmationPopup from './popups/MintNativeTokenConfirmationPopup.svelte'
    import MintNativeTokenFormPopup from './popups/MintNativeTokenFormPopup.svelte'
    import MintNftConfirmationPopup from './popups/MintNftConfirmationPopup.svelte'
    import MintNftFormPopup from './popups/MintNftFormPopup.svelte'
    import NodeAuthRequiredPopup from './popups/NodeAuthRequiredPopup.svelte'
    import NodeInfoPopup from './popups/NodeInfoPopup.svelte'
    import ReceiveAddressPopup from './popups/ReceiveAddressPopup.svelte'
    import RemoveProposalPopup from './popups/RemoveProposalPopup.svelte'
    import RevotePopup from './popups/RevotePopup.svelte'
    import SendFlowPopup from './popups/SendFlowPopup.svelte'
    import SignMessagePopup from './popups/SignMessagePopup.svelte'
    import StopVotingPopup from './popups/StopVotingPopup.svelte'
    import SyncAccountsPopup from './popups/SyncAccountsPopup.svelte'
    import TestDeepLinkFormPopup from './popups/TestDeepLinkFormPopup.svelte'
    import TokenInformationPopup from './popups/TokenInformationPopup.svelte'
    import UnlockStrongholdPopup from './popups/UnlockStrongholdPopup.svelte'
    import VerifyLedgerTransactionPopup from './popups/VerifyLedgerTransactionPopup.svelte'
    import VoteForProposal from './popups/VoteForProposalPopup.svelte'
    import VotingPowerToZeroPopup from './popups/VotingPowerToZeroPopup.svelte'
    import { modifyPopupState } from '@desktop/auxiliary/popup/helpers'
    import { localize } from '@core/i18n'

    export let id: PopupId
    export let props: any
    export let hideClose: boolean = false
    export let preventClose: boolean = false
    export let fullScreen: boolean
    export let transition = true
    export let overflow = false
    export let autofocusContent = true
    export let relative = true
    export let confirmClickOutside = false

    enum PopupSize {
        Small = 'small',
        Medium = 'medium',
        Large = 'large',
    }

    let size: PopupSize = PopupSize.Medium

    $: switch (id) {
        case PopupId.LedgerConnection:
            size = PopupSize.Large
            break
        default:
            size = PopupSize.Medium
            break
    }

    let popupContent

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
        [PopupId.ConnectLedger]: ConnectLedgerPopup,
        [PopupId.CreateAccount]: CreateAccountPopup,
        [PopupId.CustomiseAccount]: CustomiseAccountPopup,
        [PopupId.DeepLinkError]: DeepLinkErrorPopup,
        [PopupId.Diagnostics]: DiagnosticsPopup,
        [PopupId.EnableLedgerBlindSigning]: EnableLedgerBlindSigningPopup,
        [PopupId.ErrorLog]: ErrorLogPopup,
        [PopupId.FaucetRequest]: FaucetRequestPopup,
        [PopupId.ImportErc20Token]: ImportErc20TokenFormPopup,
        [PopupId.LedgerConnection]: LedgerConnectionGuidePopup,
        [PopupId.LegalUpdate]: LegalUpdatePopup,
        [PopupId.ManageVotingPower]: ManageVotingPowerPopup,
        [PopupId.MintNativeTokenConfirmation]: MintNativeTokenConfirmationPopup,
        [PopupId.MintNativeTokenForm]: MintNativeTokenFormPopup,
        [PopupId.MintNftConfirmation]: MintNftConfirmationPopup,
        [PopupId.MintNftForm]: MintNftFormPopup,
        [PopupId.NodeAuthRequired]: NodeAuthRequiredPopup,
        [PopupId.NodeInfo]: NodeInfoPopup,
        [PopupId.ReceiveAddress]: ReceiveAddressPopup,
        [PopupId.RemoveProposal]: RemoveProposalPopup,
        [PopupId.Revote]: RevotePopup,
        [PopupId.SendFlow]: SendFlowPopup,
        [PopupId.SignMessage]: SignMessagePopup,
        [PopupId.StopVoting]: StopVotingPopup,
        [PopupId.SyncAccounts]: SyncAccountsPopup,
        [PopupId.TestDeepLinkForm]: TestDeepLinkFormPopup,
        [PopupId.TokenInformation]: TokenInformationPopup,
        [PopupId.UnlockStronghold]: UnlockStrongholdPopup,
        [PopupId.VerifyLedgerTransaction]: VerifyLedgerTransactionPopup,
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
            if ('function' === typeof props?.onCancelled) {
                props?.onCancelled()
            }
            modifyPopupState({ confirmClickOutside: false })
            closePopup()
        }
    }

    function tryClosePopupOnClickOutside(): void {
        if (!preventClose) {
            if ('function' === typeof props?.onCancelled) {
                props?.onCancelled()
            }
            if (confirmClickOutside) {
                const confirm = window.confirm(localize('warning.closePopup'))
                if (confirm) {
                    modifyPopupState({ confirmClickOutside: false })
                    closePopup()
                }
            } else {
                closePopup()
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
        const elems = focusableElements()
        if (elems && elems.length > 0) {
            elems[hideClose || elems.length === 1 || !autofocusContent ? 0 : 1].focus()
        }
    })
</script>

<svelte:window on:keydown={onKey} />

<overlay
    in:fade={{ duration: transition ? 100 : 0 }}
    class:overflow-hidden={overflow}
    class="flex items-center justify-center fixed {IS_WINDOWS
        ? 'top-7'
        : 'top-0'} left-0 w-screen h-full z-30 bg-neutral-6/75"
>
    <button type="button" tabindex="0" on:focus={onFocusFirst} />
    <popup
        use:clickOutside
        on:clickOutside={tryClosePopupOnClickOutside}
        bind:this={popupContent}
        class:overflow
        class:relative
        class={size}
    >
        <svelte:component this={POPUP_MAP[id]} {...props} />
        {#if !hideClose}
            <CloseButton on:click={tryClosePopup} size="sm" class="absolute top-8 right-8 p-2" />
        {/if}
    </popup>
    <button type="button" tabindex="0" on:focus={onFocusLast} />
</overlay>

<style lang="scss">
    overlay {
        popup {
            @apply w-full p-8;
            @apply bg-surface dark:bg-surface-dark;
            @apply border border-solid border-stroke dark:border-stroke-dark;
            @apply shadow-elevation-4;
            border-radius: 32px;

            &.medium {
                max-width: 480px;
            }
            &.large {
                max-width: 630px;
            }
            &:not(.full-screen):not(.overflow) {
                @apply overflow-y-auto;
                max-height: calc(100vh - 50px);
            }
        }
    }
</style>
