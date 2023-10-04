<script lang="ts">
    import { appSettings } from '@core/app/stores'

    export let illustration = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode

    $: selected = illustrations[illustration]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

    const illustrations = {
        // Misc
        'balance-desktop': {
            lightmode: 'balance-desktop.svg',
            darkmode: 'balance-desktop-darkmode.svg',
        },
        'white-arrow': {
            lightmode: 'onboarding/white-arrow.svg',
            darkmode: 'onboarding/white-arrow.svg',
        },

        // Ledger
        'ledger-install-new-app-desktop': {
            lightmode: 'onboarding/ledger-install-new-app-desktop.svg',
            darkmode: 'onboarding/ledger-install-new-app-desktop.svg',
        },
        'ledger-live-updated-desktop': {
            lightmode: 'onboarding/ledger-live-updated-desktop.svg',
            darkmode: 'onboarding/ledger-live-updated-desktop-darkmode.svg',
        },
        'ledger-connected-2-desktop': {
            lightmode: 'onboarding/ledger-connected-2-desktop.svg',
            darkmode: 'onboarding/ledger-connected-2-desktop.svg',
        },
        'ledger-search-apps-desktop': {
            lightmode: 'onboarding/ledger-search-apps-desktop.svg',
            darkmode: 'onboarding/ledger-search-apps-desktop.svg',
        },
        'ledger-install-apps-desktop': {
            lightmode: 'onboarding/ledger-install-apps-desktop.svg',
            darkmode: 'onboarding/ledger-install-apps-desktop.svg',
        },
        'ledger-close-live-desktop': {
            lightmode: 'onboarding/ledger-close-live-desktop.svg',
            darkmode: 'onboarding/ledger-close-live-desktop.svg',
        },
        'ledger-background-live-desktop': {
            lightmode: 'onboarding/ledger-background-live-desktop.svg',
            darkmode: 'onboarding/ledger-background-live-desktop.svg',
        },
        'ledger-pin-desktop': {
            lightmode: 'onboarding/ledger-pin-desktop.svg',
            darkmode: 'onboarding/ledger-pin-desktop.svg',
        },
        'ledger-open-app-desktop': {
            lightmode: 'onboarding/ledger-open-app-desktop.svg',
            darkmode: 'onboarding/ledger-open-app-desktop.svg',
        },
        'ledger-support': {
            lightmode: 'onboarding/ledger-support.svg',
            darkmode: 'onboarding/ledger-support.svg',
        },

        // Ledger Popup
        'ledger-confirm': {
            lightmode: 'ledger/ledger-confirm.svg',
            darkmode: 'ledger/ledger-confirm.svg',
        },
        'ledger-disconnected': {
            lightmode: 'ledger/ledger-disconnected.svg',
            darkmode: 'ledger/ledger-disconnected.svg',
        },
        'ledger-locked': {
            lightmode: 'ledger/ledger-locked.svg',
            darkmode: 'ledger/ledger-locked.svg',
        },
        'ledger-open-ethereum': {
            lightmode: 'ledger/ledger-open-ethereum.svg',
            darkmode: 'ledger/ledger-open-ethereum.svg',
        },
        'ledger-open-shimmer': {
            lightmode: 'ledger/ledger-open-shimmer.svg',
            darkmode: 'ledger/ledger-open-shimmer.svg',
        },
        'ledger-verify': {
            lightmode: 'ledger/ledger-verify.svg',
            darkmode: 'ledger/ledger-verify.svg',
        },

        // Wallet
        'empty-collectibles': {
            lightmode: 'wallet/empty-collectibles.svg',
            darkmode: 'wallet/empty-collectibles-darkmode.svg',
        },

        // Bloom
        portal: {
            lightmode: 'onboarding/portal.png',
            darkmode: 'onboarding/portal.png',
        },
    }
</script>

{#if selected}
    <img
        data-label="illustration"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/illustrations/${selected}`}
        alt=""
    />
{:else}
    <div class={`${classes}`} width={width || '100%'} height={height || '100%'} />
{/if}
