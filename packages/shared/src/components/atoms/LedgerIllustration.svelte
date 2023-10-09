<script lang="ts">
    import { Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let pill: { localeKey: string; color: string }
</script>

<ledger-illustration class="flex relative justify-center items-center w-full">
    {#if pill}
        <pill class="absolute">
            <Pill color={pill.color}>
                {localize(pill.localeKey)}
            </Pill>
        </pill>
    {/if}
    <img
        data-label="illustration"
        class="absolute inset-0"
        width="100%"
        height="100%"
        src={'assets/illustrations/ledger/ledger-base.svg'}
        alt=""
    />
    <slot />
</ledger-illustration>

<style lang="postcss">
    ledger-illustration {
        @apply rounded-xl border border-solid border-stroke dark:border-stroke-dark;
        @apply bg-surface-1 dark:bg-surface-1-dark;
    }

    pill {
        @apply top-3 left-4;
    }
</style>
