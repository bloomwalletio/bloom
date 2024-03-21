<script lang="ts">
    import { CloseButton } from '@bloomwalletio/ui'
    import { closeProfileAuthPopup, ProfileAuthPopupId } from '@desktop/auxiliary/popup'

    import { IS_WINDOWS } from '@core/app/constants'
    import { clickOutside } from '@core/utils/ui'

    // Popups
    import ConnectLedgerPopup from './profileAuthPopups/ConnectLedgerPopup.svelte'
    import UnlockStrongholdPopup from './profileAuthPopups/UnlockStrongholdPopup.svelte'
    import VerifyLedgerTransactionPopup from './profileAuthPopups/VerifyLedgerTransactionPopup.svelte'
    import EnableLedgerBlindSigningPopup from './profileAuthPopups/EnableLedgerBlindSigningPopup.svelte'

    export let id: ProfileAuthPopupId | undefined
    export let props: any
    export let hideClose: boolean = false
    export let preventClose: boolean = false

    let popupContent
    function onKey(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            tryClosePopup()
        }
    }

    function tryClosePopup(): void {
        if (!preventClose) {
            closeProfileAuthPopup({ callOnCancel: true })
        }
    }
</script>

<svelte:window on:keydown={onKey} />

<overlay
    class="flex items-center justify-center fixed {IS_WINDOWS
        ? 'top-7'
        : 'top-0'} left-0 w-screen h-full z-50 bg-neutral-6/75"
>
    <profile-auth-popup use:clickOutside on:clickOutside={tryClosePopup} bind:this={popupContent}>
        {#if id === ProfileAuthPopupId.ConnectLedger}
            <ConnectLedgerPopup {...props} />
        {:else if id === ProfileAuthPopupId.UnlockStronghold}
            <UnlockStrongholdPopup {...props} />
        {:else if id === ProfileAuthPopupId.EnableLedgerBlindSigning}
            <EnableLedgerBlindSigningPopup {...props} />
        {:else if id === ProfileAuthPopupId.VerifyLedgerTransaction}
            <VerifyLedgerTransactionPopup {...props} />
        {/if}
        {#if !hideClose}
            <CloseButton on:click={tryClosePopup} size="sm" class="absolute top-8 right-8 p-2" />
        {/if}
    </profile-auth-popup>
</overlay>

<style lang="postcss">
    profile-auth-popup {
        @apply w-full max-w-[480px] p-0 relative;
        @apply bg-surface dark:bg-surface-dark;
        @apply border border-solid border-stroke dark:border-stroke-dark rounded-[32px];
        @apply shadow-elevation-4;
    }
</style>
