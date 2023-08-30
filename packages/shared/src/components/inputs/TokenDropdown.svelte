<script lang="ts">
    import { IToken } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { TokenAmountTile, Icon, Text, TokenAvatar, FontWeight } from '@ui'
    import { clickOutside } from '@core/utils'
    import { activeProfile } from '@core/profile/stores'

    export let token = $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin
    export let readonly: boolean = false

    let isDropdownOpen = false
    let tokenList: IToken[] = []

    $: isReadonly = readonly || $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.nativeTokens.length === 0
    $: $visibleSelectedAccountTokens, (tokenList = getTokenList())

    function getTokenList(): IToken[] {
        const list = []
        for (const tokensPerNetwork of Object.values($visibleSelectedAccountTokens)) {
            if (tokensPerNetwork?.baseCoin) {
                list.push(tokensPerNetwork.baseCoin)
            }
            list.push(...(tokensPerNetwork?.nativeTokens ?? []))
        }
        return list
    }

    function onDropdownClick(): void {
        if (!isReadonly) {
            isDropdownOpen = !isDropdownOpen
        }
    }

    function onTokenClick(_asset: IToken): void {
        token = _asset
        isDropdownOpen = false
    }

    function onOutsideClick(): void {
        isDropdownOpen = false
    }
</script>

{#if token}
    <div class="flex flex-col" use:clickOutside on:clickOutside={onOutsideClick}>
        <button
            type="button"
            class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md cursor-default"
            class:cursor-pointer={!isReadonly}
            on:click={onDropdownClick}
        >
            <TokenAvatar size="xs" {token} />
            <div class="w-full relative" style="max-width: 75px;">
                <Text
                    color="gray-600"
                    darkColor="white"
                    fontWeight={FontWeight.semibold}
                    fontSize="15"
                    classes="overflow-hidden whitespace-nowrap text-ellipsis"
                >
                    {token.metadata?.name ?? token.id}
                </Text>
            </div>
            {#if !isReadonly}
                <div class="transform rotate-0">
                    <Icon height="18" width="18" icon="chevron-down" classes="text-gray-600 dark:text-gray-500" />
                </div>
            {/if}
        </button>
        {#if isDropdownOpen && !isReadonly}
            <div
                class="dropdown bg-white dark:bg-gray-800 absolute flex flex-col top-12 -left-5 -right-5 border border-solid border-blue-500 rounded-xl z-10 p-4 max-h-96"
            >
                <ul class="overflow-y-auto h-full -mr-2 pr-2">
                    {#each tokenList as token}
                        <li>
                            <TokenAmountTile
                                onClick={() => onTokenClick(token)}
                                {token}
                                amount={token.balance.total}
                                classes="bg-white hover:bg-gray-50 dark:bg-transparent"
                            />
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
    /* odd margin needed to match the size of the upper parent box */
    .dropdown {
        margin: 0 3px;
    }
</style>
