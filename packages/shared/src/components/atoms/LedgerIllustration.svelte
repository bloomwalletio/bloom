<script lang="ts">
    import { Color, Icon, IconName, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let pill: { localeKey: string; color: Color } | undefined = undefined
    export let showArrows: boolean = false
    export let illustration: 'ledger-device' | 'ledger-live' = 'ledger-device'

    const isLedgerLiveIllustration = illustration === 'ledger-live'
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
        width={isLedgerLiveIllustration ? '60%' : '100%'}
        height={isLedgerLiveIllustration ? '60%' : '100%'}
        src={`assets/illustrations/ledger/${illustration}.svg`}
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
        @apply w-full h-[200px];
    }

    pill {
        @apply top-3 left-4;
    }

    arrows {
        @apply gap-16 top-8 animate-bounce;
    }
</style>
