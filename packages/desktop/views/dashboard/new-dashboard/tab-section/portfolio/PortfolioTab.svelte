<script lang="ts">
    import { localize } from '@core/i18n'
    import { ITokenWithBalance } from '@core/token'
    import { isVisibleToken } from '@core/token/actions/isVisibleToken'
    import { selectedAccountTokens, tokenFilter } from '@core/token/stores'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { Text } from '@ui'
    import TokenListRow from './components/TokenListRow.svelte'

    let filteredTokenList: ITokenWithBalance[]
    $: $tokenFilter, $selectedAccountTokens, (filteredTokenList = getFilteredTokenList())
    $: $tokenFilter, scrollToTop()

    let isEmptyBecauseOfFilter: boolean = false
    $: $selectedAccountTokens, (isEmptyBecauseOfFilter = getTokenList().length > 0 && filteredTokenList.length === 0)

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
        <div class="flex-auto h-full">
            {#if filteredTokenList.length > 0}
                <VirtualList items={filteredTokenList} itemHeight="75.5" let:item>
                    <TokenListRow token={item} />
                    <TokenListRow token={item} />
                    <TokenListRow token={item} />
                    <TokenListRow token={item} />
                    <TokenListRow token={item} />
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