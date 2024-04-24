<script lang="ts">
    import { Table, IItem } from '@bloomwalletio/ui'
    import { formatCurrency, localize } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { activeProfile } from '@core/profile/stores'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { BalanceSummaryRow } from '@ui'

    export let titleKey: string
    export let subtitleKey: string = ''
    export let subBreakdown: { [key: string]: bigint } = {}
    export let amount: bigint
    export let bold: boolean = false
    export let expanded = false
    export let onClick: (() => void) | undefined = undefined

    $: hasChildren = !!Object.keys(subBreakdown ?? {}).length
    $: baseCoin = $selectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin

    function getAmount(amount: bigint): string {
        return baseCoin?.metadata ? formatTokenAmountBestMatch(amount, baseCoin.metadata) : ''
    }

    function getCurrencyAmount(amount: bigint): string {
        return baseCoin ? formatCurrency(getFiatValueFromTokenAmount(amount, baseCoin)) : ''
    }

    function toggleExpandedView(): void {
        if (hasChildren && onClick) {
            onClick()
        }
    }

    let items: IItem[] = []
    $: items = Object.keys(subBreakdown ?? {}).map((key) => ({
        key: localize(`popups.balanceBreakdown.${key}.title`),
        value: getAmount(subBreakdown[key] ?? 0),
    }))
</script>

<button type="button" class="space-y-2" class:expandable={hasChildren} class:expanded on:click={toggleExpandedView}>
    <BalanceSummaryRow
        title={titleKey ? localize(`popups.balanceBreakdown.${titleKey}.title`) : ''}
        subtitle={subtitleKey ? localize(`popups.balanceBreakdown.${subtitleKey}.subtitle`) : ''}
        amount={getAmount(amount)}
        convertedAmount={getCurrencyAmount(amount)}
        expandable={hasChildren}
        {expanded}
        {bold}
    />
    {#if expanded}
        <Table {items} />
    {/if}
</button>

<style lang="postcss">
    button {
        @apply rounded-xl;
        @apply p-2 -m-2;
        @apply cursor-default;
        width: 432x;
    }
    .expandable {
        @apply cursor-pointer;
        @apply hover:bg-surface-1 dark:hover:bg-surface-1-dark;
    }
    .expanded {
        @apply border border-solid border-stroke dark:border-stroke-dark;
    }
</style>
