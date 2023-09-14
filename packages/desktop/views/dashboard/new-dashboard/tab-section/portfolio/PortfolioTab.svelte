<script lang="ts">
    import { getCurrencySymbol, localize } from '@core/i18n'
    import { ITokenWithBalance } from '@core/token'
    import { isVisibleToken } from '@core/token/actions/isVisibleToken'
    import { selectedAccountTokens, tokenFilter } from '@core/token/stores'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { FontWeight, Text } from '@ui'
    import TokenListRow from './components/TokenListRow.svelte'
    import { activeProfile } from '@core/profile/stores'

    let filteredTokenList: ITokenWithBalance[]
    $: $tokenFilter, $selectedAccountTokens, (filteredTokenList = getFilteredTokenList())
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

{#if $selectedAccountTokens}
    <div class="h-full flex flex-auto flex-col flex-grow shrink-0">
        <div class="header-row">
            <Text fontWeight={FontWeight.medium} secondary classes="text-start"
                >{localize('views.dashboard.portfolio.asset')}</Text
            >
            <Text fontWeight={FontWeight.medium} secondary classes="text-start"
                >{localize('views.dashboard.portfolio.network')}</Text
            >
            <Text fontWeight={FontWeight.medium} secondary classes="text-start"
                >{localize('views.dashboard.portfolio.marketCap')} {currency}</Text
            >
            <Text fontWeight={FontWeight.medium} secondary classes="text-start"
                >{localize('views.dashboard.portfolio.price')} {currency}</Text
            >
            <Text fontWeight={FontWeight.medium} secondary classes="text-end"
                >{localize('views.dashboard.portfolio.amount')}</Text
            >
        </div>
        <div class="flex-auto h-full">
            {#if filteredTokenList.length > 0}
                <VirtualList items={filteredTokenList} let:item>
                    <TokenListRow token={item} />
                </VirtualList>
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>
                        {localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredAsset' : 'noAssets'}`)}
                    </Text>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .header-row {
        @apply w-full;
        @apply px-5 py-4;
        @apply bg-gray-50;
        @apply border-b border-solid border-gray-100;

        @apply grid;
        grid-template-columns: 2fr 2fr 1fr 1fr 2fr;
    }
</style>
