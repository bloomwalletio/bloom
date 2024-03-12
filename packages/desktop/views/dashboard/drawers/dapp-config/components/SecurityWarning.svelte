<script lang="ts">
    import { Alert, Checkbox } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'

    export let verifiedState: DappVerification.Invalid | DappVerification.Scam | DappVerification.Unknown
    export let flashingCheckbox: boolean = false
    export let acceptedInsecureConnection

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'
</script>

{#if verifiedState === DappVerification.Invalid || verifiedState === DappVerification.Unknown}
    <Alert variant="warning" text={localize(`${localeKey}.${verifiedState.toLowerCase()}Hint`)}>
        <checkbox-container class:flashingCheckbox slot="body">
            <Checkbox
                label={localize(`${localeKey}.acceptInsecureConnection`)}
                bind:checked={acceptedInsecureConnection}
            />
        </checkbox-container>
    </Alert>
{:else if verifiedState === DappVerification.Scam}
    <Alert variant="warning" text={localize(`${localeKey}.scamHint`)} />
{/if}

<style lang="postcss">
    :global(checkbox-container.flashingCheckbox p) {
        @apply text-danger dark:text-danger-dark;
    }

    :global(checkbox-container.flashingCheckbox button) {
        animation: flashingCheckbox 0.5s ease-in-out 3;
    }

    @keyframes flashingCheckbox {
        0% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.6;
        }
    }
</style>
