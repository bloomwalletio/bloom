<script lang="ts">
    import { Table, IItem } from '@bloomwalletio/ui'
    import { formatCurrency, localize } from '@core/i18n'
    import { getFiatAmountFromTokenValue } from '@core/market/actions'
    import { activeProfile } from '@core/profile/stores'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { BalanceSummaryRow } from '@ui'

    export let titleKey: string
    export let subtitleKey: string = ''
    export let subBreakdown: { [key: string]: number } = {}
    export let amount: number
    export let bold: boolean = false
    export let expanded = false
    export let onClick: (() => void) | undefined = undefined

    $: hasChildren = !!Object.keys(subBreakdown ?? {}).length
    $: baseCoin = $selectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin

    function getAmount(amount: number): string {
        return baseCoin?.metadata ? formatTokenAmountBestMatch(amount, baseCoin.metadata) : ''
    }

    function getCurrencyAmount(amount: number): string {
        return baseCoin ? formatCurrency(getFiatAmountFromTokenValue(BigInt(amount), baseCoin)) : ''
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

<balance-summary-section
    class="flex flex-col space-y-2"
    class:expandable={hasChildren}
    class:expanded
    on:click={toggleExpandedView}
    on:keydown={() => {}}
>
    <div class="flex flex-row flex-grow justify-between space-x-2">
        <BalanceSummaryRow
            title={titleKey ? localize(`popups.balanceBreakdown.${titleKey}.title`) : ''}
            subtitle={subtitleKey ? localize(`popups.balanceBreakdown.${subtitleKey}.subtitle`) : ''}
            amount={getAmount(amount)}
            convertedAmount={getCurrencyAmount(amount)}
            expandable={hasChildren}
            {expanded}
            {bold}
        />
    </div>
    {#if expanded}
        <Table {items} />
    {/if}
</balance-summary-section>

<style lang="scss">
    balance-summary-section {
        @apply rounded-xl;
        @apply p-2 -m-2;
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
