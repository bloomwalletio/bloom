<script lang="ts">
    import { Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let pill: { localeKey: string; color: string }
</script>

<ledger-illustration class="flex relative justify-center items-center w-full h-80 {$$restProps.class}">
    {#if pill}
        <pill class="absolute">
            <Pill color={pill.color}>
                {localize(pill.localeKey)}
            </Pill>
        </pill>
    {/if}
    <slot />
</ledger-illustration>

<style lang="postcss">
    ledger-illustration {
        @apply rounded-xl border border-solid border-stroke dark:border-stroke-dark;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply bg-[url('./assets/illustrations/ledger/ledger-base.svg')] bg-cover bg-center;
    }

    pill {
        @apply top-3 left-4;
    }
</style>
