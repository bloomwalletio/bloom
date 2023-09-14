<script lang="ts">
    import { localize } from '@core/i18n'
    import { ITokenWithBalance } from '@core/token'
    import { isVisibleToken } from '@core/token/actions/isVisibleToken'
    import { selectedAccountTokens, tokenFilter } from '@core/token/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { Text } from '@ui'

    let filteredTokenList: ITokenWithBalance[]
    $: $tokenFilter, $selectedAccountTokens, (filteredTokenList = getFilteredTokenList()), scrollToTop()

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

    function onTokenRowClick(token: ITokenWithBalance): void {
        openPopup({
            id: PopupId.TokenInformation,
            overflow: true,
            props: {
                token,
            },
        })
    }
</script>

{#if $selectedAccountTokens}
    <div class="token-list h-full p-6 flex flex-auto flex-col flex-grow shrink-0">
        <div class="flex-auto h-full pb-10">
            {#if filteredTokenList.length > 0}
                <VirtualList items={filteredTokenList} let:item>
                    <button on:click={() => onTokenRowClick(item)} class="w-full token-row px-5 py-4">
                        <div class="">{item.tokenId}</div>
                        <div class="">{item.networkId}</div>
                        <div class="">{item.marketprices}</div>
                        <div class="">{item.marketprices}</div>
                        <div class="">{item.balance.total}</div>
                    </button>
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

    .token-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 2fr;

        div {
            @apply flex justify-start;

            &:last-child {
                @apply flex justify-end;
            }
        }
    }
</style>
