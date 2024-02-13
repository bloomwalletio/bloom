<script lang="ts">
    import { darkMode } from '@core/app/stores'

    export let illustration: string | undefined = undefined
    export let width: number | undefined = undefined
    export let height: number | undefined = undefined
    export let classes = ''

    $: selected = illustrations[illustration]?.[$darkMode ? 'darkmode' : 'lightmode']

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

        // Ledger Popup
        'ledger-base': {
            lightmode: 'ledger/ledger-base.svg',
            darkmode: 'ledger/ledger-base.svg',
        },
        'ledger-pin': {
            lightmode: 'ledger/ledger-pin.svg',
            darkmode: 'ledger/ledger-pin.svg',
        },
        'ledger-hash': {
            lightmode: 'ledger/ledger-hash.svg',
            darkmode: 'ledger/ledger-hash.svg',
        },

        // Bloom
        portal: {
            lightmode: 'onboarding/portal.webp',
            darkmode: 'onboarding/portal.webp',
        },
        landscape: {
            lightmode: 'onboarding/landscape.webp',
            darkmode: 'onboarding/landscape.webp',
        },
        balloon: {
            lightmode: 'onboarding/balloon.webp',
            darkmode: 'onboarding/balloon.webp',
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
