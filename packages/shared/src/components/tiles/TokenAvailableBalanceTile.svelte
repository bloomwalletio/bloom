<script lang="ts">
    import { localize } from '@core/i18n'
    import { ITokenWithBalance, formatTokenAmount } from '@core/token'
    import { truncateString } from '@core/utils'
    import { Tile, Text } from '@bloomwalletio/ui'
    import { TokenAvatar } from '@ui'

    export let token: ITokenWithBalance
    export let onMaxClick: () => unknown

    $: availableBalance = token?.balance?.available ?? BigInt(0)
</script>

{#if token && token.metadata && token.balance}
    <Tile surface={1}>
        <div class="w-full flex flex-row justify-between items-center">
            <div class="flex flex-row items-center text-left space-x-4">
                <TokenAvatar {token} />
                <div class="flex flex-col">
                    <Text>
                        {token.metadata.name
                            ? truncateString(token.metadata.name, 13, 0)
                            : truncateString(token.id, 6, 7)}
                    </Text>
                    <div class="flex flex-row justify-between items-center text-left">
                        <Text textColor="secondary" fontWeight="medium">
                            {formatTokenAmount(availableBalance, token.metadata, { round: false })}
                        </Text>
                    </div>
                </div>
            </div>
            <div class="flex flex-col text-right">
                <button
                    on:click={onMaxClick}
                    class="py-2 px-3 rounded-md hover:bg-surface-2 hover:dark:bg-surface-2-dark border border-solid border-stroke dark:border-stroke-dark"
                >
                    <Text textColor="secondary">
                        {localize('actions.useMax')}
                    </Text>
                </button>
            </div>
        </div>
    </Tile>
{/if}
