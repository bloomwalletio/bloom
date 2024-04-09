<script lang="ts">
    import { localize } from '@core/i18n'
    import { ITokenWithBalance, sortTokens } from '@core/token'
    import { isVisibleToken } from '@core/token/actions/isVisibleToken'
    import { selectedAccountTokens, tokenFilter, tokenSearchTerm } from '@core/token/stores'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import TokenListRow from './components/TokenListRow.svelte'
    import { Text } from '@bloomwalletio/ui'

    let filteredTokenList: ITokenWithBalance[]
    $: $tokenFilter, $tokenSearchTerm, $selectedAccountTokens, (filteredTokenList = getFilteredTokens())
    $: $tokenFilter, scrollToTop()

    let isEmptyBecauseOfFilter: boolean = false
    $: $selectedAccountTokens,
        (isEmptyBecauseOfFilter = getSortedTokenForAllNetworks().length > 0 && filteredTokenList.length === 0)

    function getFilteredTokens(): ITokenWithBalance[] {
        const sortedTokens = getSortedTokenForAllNetworks()
        return sortedTokens.filter((_nativeToken) => isVisibleToken(_nativeToken))
    }

    function getSortedTokenForAllNetworks(): ITokenWithBalance[] {
        const baseCoins: ITokenWithBalance[] = []
        const nativeTokens: ITokenWithBalance[] = []
        for (const networkTokens of Object.values($selectedAccountTokens)) {
            if (networkTokens?.baseCoin) {
                baseCoins.push(networkTokens.baseCoin)
            }
            nativeTokens.push(...(networkTokens?.nativeTokens ?? []))
        }
        return [...baseCoins, ...sortTokens(nativeTokens)]
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
        <Text type="sm" fontWeight="medium" textColor="secondary">{localize('views.dashboard.portfolio.asset')}</Text>
        <div class="text-center">
            <Text type="sm" fontWeight="medium" textColor="secondary">
                {localize('views.dashboard.portfolio.network')}
            </Text>
        </div>
        <div class="text-end">
            <Text type="sm" fontWeight="medium" textColor="secondary">
                {localize('views.dashboard.portfolio.marketCap')}
            </Text>
        </div>
        <div class="text-end">
            <Text type="sm" fontWeight="medium" textColor="secondary">
                {localize('views.dashboard.portfolio.price')}
            </Text>
        </div>
        <div class="text-end">
            <Text type="sm" fontWeight="medium" textColor="secondary">
                {localize('views.dashboard.portfolio.available')}
            </Text>
        </div>
        <div class="text-end">
            <Text type="sm" fontWeight="medium" textColor="secondary">
                {localize('views.dashboard.portfolio.total')}
            </Text>
        </div>
    </header-row>
    {#if filteredTokenList.length > 0}
        <VirtualList items={filteredTokenList} let:item itemHeight={73}>
            <TokenListRow token={item} />
        </VirtualList>
    {:else}
        <div class="h-full flex flex-col items-center justify-center text-center">
            <Text textColor="secondary">
                {localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredAsset' : 'noAssets'}`)}
            </Text>
        </div>
    {/if}
</portfolio-tab>

<style lang="postcss">
    $paneHeaderHeight: 68px;

    portfolio-tab {
        @apply flex flex-col flex-grow;
        height: calc(100% - $paneHeaderHeight);

        header-row {
            @apply w-full;
            @apply pl-5 py-2 pr-7;
            @apply bg-surface-1 dark:bg-surface-1-dark;
            @apply border-y border-solid border-stroke dark:border-stroke-dark;

            @apply grid gap-2;
            grid-template-columns: 3fr 2fr 2fr 2fr 2fr 2fr;
        }
    }
</style>
