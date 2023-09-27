<script lang="ts">
    import { Text, TextType } from '@bloomwalletio/ui'
    import { getDecimalSeparator } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'

    export let balanceText: string = ''
    export let textType: TextType = 'h1'

    $: ({ integer, separator, decimals, unit } = getSplitBalanceText(balanceText))

    function getSplitBalanceText(balance: string): {
        integer: string
        separator: string
        decimals: string
        unit: string
    } {
        const separator = getDecimalSeparator($activeProfile?.settings?.marketCurrency)
        const [integer, decimals] = balance.split(separator)
        if (decimals) {
            const [_decimals, unit] = decimals.split(/\s/g)
            return { integer, separator, decimals: _decimals, unit }
        } else {
            const [_integer, unit] = integer.split(/\s/g)
            return { integer: _integer, separator, decimals: '00', unit }
        }
    }
</script>

<formatted-balance class="flex flex-row w-full items-center space-x-2">
    <div class="flex flex-row items-center overflow-hidden">
        <Text type={textType}>{integer}</Text>
        <Text type={textType} textColor="secondary">{separator}</Text>
        <Text type={textType} textColor="secondary" truncate>{decimals}</Text>
    </div>
    {#if unit}
        <Text type={textType}>{unit}</Text>
    {/if}
</formatted-balance>
