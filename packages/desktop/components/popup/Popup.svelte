<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { Icon } from '@ui'
    import { closePopup, PopupComponentMap, PopupId } from '@desktop/auxiliary/popup'
    import { Icon as IconEnum } from '@auxiliary/icon/enums'
    import { IS_WINDOWS } from '@core/app/constants'
    import { clickOutside } from '@core/utils/ui'

    // Popups
    import AccountSwitcherPopup from './popups/AccountSwitcherPopup.svelte'
    import ActivityDetailsPopup from './popups/ActivityDetailsPopup.svelte'
    import AddNodePopup from './popups/AddNodePopup.svelte'
    import AddProposalPopup from './popups/AddProposalPopup.svelte'
    import AliasConfirmationPopup from './popups/AliasConfirmationPopup.svelte'
    import BackupStrongholdPopup from './popups/BackupStrongholdPopup.svelte'
    import BurnNativeTokensPopup from './popups/BurnNativeTokensPopup.svelte'
    import BurnNativeTokensConfirmationPopup from './popups/BurnNativeTokensConfirmationPopup.svelte'
    import ConfirmationPopup from './popups/ConfirmationPopup.svelte'
    import ConnectLedgerPopup from './popups/ConnectLedgerPopup.svelte'
    import CreateAccountPopup from './popups/CreateAccountPopup.svelte'
    import DeepLinkErrorPopup from './popups/DeepLinkErrorPopup.svelte'
    import DeleteAccountPopup from './popups/DeleteAccountPopup.svelte'
    import DeleteProfilePopup from './popups/DeleteProfilePopup.svelte'
    import DiagnosticsPopup from './popups/DiagnosticsPopup.svelte'
    import EnableLedgerBlindSigningPopup from './popups/EnableLedgerBlindSigningPopup.svelte'
    import ErrorLogPopup from './popups/ErrorLogPopup.svelte'
    import FaucetRequestPopup from './popups/FaucetRequestPopup.svelte'
    import ImportErc20TokenFormPopup from './popups/ImportErc20TokenFormPopup.svelte'
    import LedgerAppGuidePopup from './popups/LedgerAppGuidePopup.svelte'
    import LedgerConnectionGuidePopup from './popups/LedgerConnectionGuidePopup.svelte'
    import LegalUpdatePopup from './popups/LegalUpdatePopup.svelte'
    import ManageAccountPopup from './popups/ManageAccountPopup.svelte'
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
    import SignMessagePopup from './popups/SignMessagePopup.svelte'
    import SendFlowPopup from './popups/SendFlowPopup.svelte'
    import StopVotingPopup from './popups/StopVotingPopup.svelte'
    import BalanceBreakdownPopup from './popups/BalanceBreakdownPopup.svelte'
    import TestDeepLinkFormPopup from './popups/TestDeepLinkFormPopup.svelte'
    import TokenInformationPopup from './popups/TokenInformationPopup.svelte'
    import UnlockStrongholdPopup from './popups/UnlockStrongholdPopup.svelte'
    import VerifyLedgerTransactionPopup from './popups/VerifyLedgerTransactionPopup.svelte'
    import CheckForUpdatesPopup from './popups/CheckForUpdatesPopup.svelte'
    import VoteForProposal from './popups/VoteForProposalPopup.svelte'
    import VotingPowerToZeroPopup from './popups/VotingPowerToZeroPopup.svelte'
    import WalletFinderPopup from './popups/WalletFinderPopup.svelte'

    export let id: PopupId
    export let props: any
    export let hideClose: boolean = false
    export let preventClose: boolean = false
    export let fullScreen: boolean
    export let transition = true
    export let overflow = false
    export let autofocusContent = true
    export let relative = true

    enum PopupSize {
        Small = 'small',
        Medium = 'medium',
        Large = 'large',
    }

    let size: PopupSize = PopupSize.Medium

    $: switch (id) {
        case PopupId.ConnectLedger:
        case PopupId.CreateAccount:
        case PopupId.ManageAccount:
            size = PopupSize.Small
            break
        case PopupId.LedgerAppGuide:
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
        [PopupId.BurnNativeTokens]: BurnNativeTokensPopup,
        [PopupId.BurnNativeTokensConfirmation]: BurnNativeTokensConfirmationPopup,
        [PopupId.Confirmation]: ConfirmationPopup,
        [PopupId.ConnectLedger]: ConnectLedgerPopup,
        [PopupId.CreateAccount]: CreateAccountPopup,
        [PopupId.DeepLinkError]: DeepLinkErrorPopup,
        [PopupId.DeleteAccount]: DeleteAccountPopup,
        [PopupId.DeleteProfile]: DeleteProfilePopup,
        [PopupId.Diagnostics]: DiagnosticsPopup,
        [PopupId.EnableLedgerBlindSigning]: EnableLedgerBlindSigningPopup,
        [PopupId.ErrorLog]: ErrorLogPopup,
        [PopupId.FaucetRequest]: FaucetRequestPopup,
        [PopupId.ImportErc20Token]: ImportErc20TokenFormPopup,
        [PopupId.LedgerAppGuide]: LedgerAppGuidePopup,
        [PopupId.LedgerConnection]: LedgerConnectionGuidePopup,
        [PopupId.LegalUpdate]: LegalUpdatePopup,
        [PopupId.ManageAccount]: ManageAccountPopup,
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
        [PopupId.BalanceBreakdown]: BalanceBreakdownPopup,
        [PopupId.TestDeepLinkForm]: TestDeepLinkFormPopup,
        [PopupId.TokenInformation]: TokenInformationPopup,
        [PopupId.UnlockStronghold]: UnlockStrongholdPopup,
        [PopupId.VerifyLedgerTransaction]: VerifyLedgerTransactionPopup,
        [PopupId.CheckForUpdates]: CheckForUpdatesPopup,
        [PopupId.VoteForProposal]: VoteForProposal,
        [PopupId.VotingPowerToZero]: VotingPowerToZeroPopup,
        [PopupId.WalletFinder]: WalletFinderPopup,
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
            closePopup()
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

<popup
    in:fade={{ duration: transition ? 100 : 0 }}
    class={`flex items-center justify-center fixed ${IS_WINDOWS ? 'top-7' : 'top-0'} left-0 w-screen p-6 ${
        overflow ? '' : 'overflow-hidden'
    }
                h-full z-30 ${
                    fullScreen
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-800 bg-opacity-70 dark:bg-black dark:bg-opacity-50'
                }`}
>
    <button type="button" tabindex="0" on:focus={onFocusFirst} />
    <popup-content
        use:clickOutside
        on:clickOutside={tryClosePopup}
        bind:this={popupContent}
        class={`${size} bg-white rounded-xl pt-6 px-6 pb-6 ${
            fullScreen ? 'full-screen dark:bg-gray-900' : 'dark:bg-gray-800 shadow-elevation-4'
        } ${overflow ? 'overflow' : ''} ${relative ? 'relative' : ''}`}
    >
        {#if !hideClose}
            <button on:click={tryClosePopup} class="absolute top-6 right-6 focus:text-blue-500">
                <Icon
                    icon={IconEnum.Close}
                    classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100 bg-surface-2 rounded-full"
                />
            </button>
        {/if}
        <svelte:component this={POPUP_MAP[id]} {...props} />
    </popup-content>
    <button type="button" tabindex="0" on:focus={onFocusLast} />
</popup>

<style lang="scss">
    popup {
        popup-content {
            width: 100%;
            &.small {
                max-width: 360px;
            }
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
