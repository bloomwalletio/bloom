<script lang="ts">
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { Text, TextType, TokenAmountTile } from '@ui'
    import { AssetListMenuButton, Filter } from '../../../../desktop/components'
    import { localize } from '@core/i18n'
    import { AccountTokens, IToken } from '@core/token'
    import { tokenFilter } from '@core/token/stores'
    import { isVisibleToken } from '@core/token/utils/isVisibleToken'
    import { PopupId, openPopup } from '../../../../desktop/lib/auxiliary/popup'

    export let accountTokens: AccountTokens

    let filteredTokenList: IToken[]
    $: $tokenFilter, accountTokens, (filteredTokenList = getFilteredTokenList()), scrollToTop()

    let isEmptyBecauseOfFilter: boolean = false
    $: accountTokens, (isEmptyBecauseOfFilter = getTokenList().length > 0 && filteredTokenList.length === 0)

    function getFilteredTokenList(): IToken[] {
        const list = getTokenList()
        return list.filter((_nativeToken) => isVisibleToken(_nativeToken))
    }

    function getTokenList(): IToken[] {
        const list = []
        for (const networkTokens of Object.values(accountTokens)) {
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

    function onTokenAmountTileClick(token: IToken): void {
        openPopup({
            id: PopupId.TokenInformation,
            overflow: true,
            props: {
                token,
            },
        })
    }
</script>

{#if accountTokens}
    <div class="token-list h-full p-6 flex flex-auto flex-col flex-grow shrink-0">
        <div class="w-full flex flex-row justify-between items-center mb-4">
            <Text classes="text-left" type={TextType.h5}>{localize('general.accountTokens')}</Text>
            <div class="flex flex-row gap-1">
                <Filter filterStore={tokenFilter} />
                <AssetListMenuButton />
            </div>
        </div>
        <div class="flex-auto h-full pb-10">
            {#if filteredTokenList.length > 0}
                <VirtualList items={filteredTokenList} let:item>
                    <TokenAmountTile
                        onClick={() => onTokenAmountTileClick(item)}
                        token={item}
                        amount={item.balance.total}
                        classes="mb-2"
                    />
                </VirtualList>
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary
                        >{localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredAsset' : 'noAssets'}`)}</Text
                    >
                </div>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .token-list :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
    }
    .token-list :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
