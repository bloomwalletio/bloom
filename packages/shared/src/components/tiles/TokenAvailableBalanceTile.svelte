<script lang="ts">
    import { FontWeight, Text, TextType, Tile, TokenAvatar } from '@ui'
    import { localize } from '@core/i18n'
    import { ITokenWithBalance, formatTokenAmountBestMatch } from '@core/token'
    import { truncateString } from '@core/utils'

    export let token: ITokenWithBalance
    export let onMaxClick: () => unknown

    $: availableBalance = token?.balance?.available ?? 0
</script>

{#if token && token.metadata && token.balance}
    <Tile>
        <div class="w-full flex flex-row justify-between items-center">
            <div class="flex flex-row items-center text-left space-x-4">
                <TokenAvatar {token} />
                <div class="flex flex-col">
                    <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                        {token.metadata.name
                            ? truncateString(token.metadata.name, 13, 0)
                            : truncateString(token.id, 6, 7)}
                    </Text>
                    <div class="flex flex-row justify-between items-center text-left">
                        <Text type={TextType.p} secondary smaller>
                            {formatTokenAmountBestMatch(availableBalance, token.metadata)}
                        </Text>
                    </div>
                </div>
            </div>
            <div class="flex flex-col text-right">
                <button
                    on:click={onMaxClick}
                    class="py-2 px-3 rounded-md text-13 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
                >
                    {localize('actions.useMax')}
                </button>
            </div>
        </div>
    </Tile>
{/if}
