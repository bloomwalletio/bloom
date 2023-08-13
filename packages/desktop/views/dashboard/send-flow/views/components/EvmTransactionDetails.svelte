<script lang="ts">
    import { localize } from '@core/i18n'
    import { SupportedNetworkId } from '@core/network'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { NetworkIcon, Text, TooltipIcon } from '@ui'

    export let destinationNetwork: string
    export let gasBudget: number
</script>

<div class="border border-solid border-gray-200 dark:border-gray-700 rounded-lg">
    {#if destinationNetwork}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <Text>{localize('general.destinationNetwork')}</Text>
            <div class="flex flex-row gap-2">
                <!-- TODO: Add correct icon for L2 -->
                <NetworkIcon networkId={SupportedNetworkId.Testnet} height={16} width={16} outlined={false} />
                <Text color="gray-600">{destinationNetwork}</Text>
            </div>
        </section>
    {/if}
    {#if gasBudget}
        <section class="key-value-box border-gray-200 dark:border-gray-700">
            <div class="flex flex-row">
                <Text>{localize('general.gasBudget')}</Text>
                <TooltipIcon
                    title={localize('general.gasBudget')}
                    text={localize('tooltips.transactionDetails.outgoing.gasBudget')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
            <Text color="gray-600">{formatTokenAmountBestMatch(gasBudget, getBaseToken())}</Text>
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
