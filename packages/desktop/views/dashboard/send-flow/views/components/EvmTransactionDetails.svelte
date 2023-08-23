<script lang="ts">
    import { localize } from '@core/i18n'
    import { NetworkId, getActiveNetworkId, getNetwork } from '@core/network'
    import { getChainConfiguration } from '@core/network/actions/getChainConfiguration'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { BigIntLike } from '@ethereumjs/util'
    import { NetworkIcon, Text } from '@ui'

    export let destinationNetworkId: NetworkId | undefined = undefined
    export let estimatedGasFee: BigIntLike | undefined = undefined
    export let maxGasFee: BigIntLike | undefined = undefined

    $: destinationNetwork =
        destinationNetworkId === getActiveNetworkId()
            ? getNetwork().getMetadata().name
            : getChainConfiguration(destinationNetworkId)?.name
</script>

<div class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg">
    {#if destinationNetwork}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <Text>{localize('general.destinationNetwork')}</Text>
            <div class="flex flex-row gap-2">
                <NetworkIcon networkId={destinationNetworkId} height={16} width={16} outlined={false} />
                <Text color="gray-600">{destinationNetwork}</Text>
            </div>
        </section>
    {/if}
    <!-- TODO: use correct locales -->
    {#if estimatedGasFee}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.estimatedFee')}</Text>
            </div>
            <Text color="gray-600">{formatTokenAmountBestMatch(Number(estimatedGasFee), getBaseToken())}</Text>
        </section>
    {/if}
    {#if maxGasFee}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.maxFees')}</Text>
            </div>
            <Text color="gray-600">{formatTokenAmountBestMatch(Number(maxGasFee), getBaseToken())}</Text>
        </section>
    {/if}
</div>

<style lang="scss">
    .key-value-box {
        @apply flex flex-row justify-between p-4;
        @apply border-b border-solid;

        &:last-child {
            @apply border-0;
        }
    }
</style>
