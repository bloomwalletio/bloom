<script lang="ts">
    import { getCurrencySymbol, localize } from '@core/i18n'
    import { ITokenWithBalance } from '@core/token'
    import { isVisibleToken } from '@core/token/actions/isVisibleToken'
    import { selectedAccountTokens, tokenFilter, tokenSearchTerm } from '@core/token/stores'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import TokenListRow from './components/TokenListRow.svelte'
    import { activeProfile } from '@core/profile/stores'
    import { Text } from '@bloomwalletio/ui'

    let filteredTokenList: ITokenWithBalance[]
    $: $tokenFilter, $tokenSearchTerm, $selectedAccountTokens, (filteredTokenList = getFilteredTokenList())
    $: $tokenFilter, scrollToTop()

    let isEmptyBecauseOfFilter: boolean = false
    $: $selectedAccountTokens, (isEmptyBecauseOfFilter = getTokenList().length > 0 && filteredTokenList.length === 0)
    $: currency = getCurrencySymbol($activeProfile?.settings?.marketCurrency)

    function getFilteredTokenList(): ITokenWithBalance[] {
        const list = getTokenList()
        return list.filter((_nativeToken) => isVisibleToken(_nativeToken))
    }

    function getTokenList(): ITokenWithBalance[] {
        const list = []
        for (const networkTokens of Object.values($selectedAccountTokens)) {
            if (networkTokens?.baseCoin) {
                list.push(networkTokens.baseCoin)
            }
            list.push(...(networkTokens?.nativeTokens ?? []))
        }
        return list
    }

    function scrollToTop() {
        const listElement = document.querySelector('.token-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }
</script>

<portfolio-tab>
    <header-row>
        <Text type="sm" fontWeight="medium" color="secondary">{localize('views.dashboard.portfolio.asset')}</Text>
        <Text type="sm" fontWeight="medium" color="secondary">
            {localize('views.dashboard.portfolio.network')}
        </Text>
        <Text type="sm" fontWeight="medium" color="secondary">
            {localize('views.dashboard.portfolio.marketCap')}
            {currency}
        </Text>
        <Text type="sm" fontWeight="medium" color="secondary">
            {localize('views.dashboard.portfolio.price')}
            {currency}
        </Text>
        <div class="text-end">
            <Text type="sm" fontWeight="medium" color="secondary">
                {localize('views.dashboard.portfolio.amount')}
            </Text>
        </div>
    </header-row>
    {#if filteredTokenList.length > 0}
        <VirtualList items={filteredTokenList} let:item>
            <TokenListRow token={item} />
        </VirtualList>
    {:else}
        <div class="h-full flex flex-col items-center justify-center text-center">
            <Text color="secondary">
                {localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredAsset' : 'noAssets'}`)}
            </Text>
        </div>
    {/if}
</portfolio-tab>

<style lang="scss">
    $paneHeaderHeight: 68px;

    portfolio-tab {
        @apply flex flex-col flex-grow;
        height: calc(100% - $paneHeaderHeight);

        header-row {
            @apply w-full;
            @apply px-5 py-4;
            @apply bg-surface-1 dark:bg-surface-1-dark;
            @apply border-b border-solid border-stroke dark:border-stroke-dark;

            @apply grid;
            grid-template-columns: 2fr 2fr 1fr 1fr 2fr;
        }
    }
</style>
