<script lang="ts">
    import { Icon, IconName, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let pill: { localeKey: string; color: string }
    export let showArrows: boolean = false
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
        width="100%"
        height="100%"
        src="assets/illustrations/ledger/ledger-base.svg"
        alt="Ledger Device"
    />
    <div class="absolute">
        <slot />
    </div>
    {#if showArrows}
        <arrows class="absolute flex flex-row">
            <Icon name={IconName.ArrowsDown} />
            <Icon name={IconName.ArrowsDown} />
        </arrows>
    {/if}
</ledger-illustration>

<style lang="postcss">
    ledger-illustration {
        @apply rounded-xl border border-solid border-stroke dark:border-stroke-dark;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply w-[412px] h-[200px];
    }

    pill {
        @apply top-3 left-4;
    }

    arrows {
        @apply gap-16 top-8 animate-bounce;
    }
</style>
