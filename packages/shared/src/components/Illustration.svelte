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
        // Staking
        'shimmer-info-bg': {
            lightmode: 'staking/shimmer-info.png',
            darkmode: 'staking/shimmer-info.png',
        },
        'assembly-info-bg': {
            lightmode: 'staking/assembly-info.png',
            darkmode: 'staking/assembly-info.png',
        },
        'staking-notification': {
            lightmode: 'staking/staking-notification.svg',
            darkmode: 'staking/staking-notification.svg',
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
