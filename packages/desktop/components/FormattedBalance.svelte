<script lang="ts">
    import { Text, TextType } from '@bloomwalletio/ui'
    import { getDecimalSeparator } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'

    export let balanceText: string = ''
    export let textType: TextType = 'h1'

    let splitBalanceText: [string, string]
    $: splitBalanceText = getSplitBalanceText(balanceText)

    function getSplitBalanceText(balance: string): [string, string] {
        const separator = getDecimalSeparator($activeProfile?.settings?.marketCurrency)
        const [integer, decimals] = balance.split(separator)
        return [integer, separator + decimals]
    }
</script>

<formatted-balance class="flex flex-row items-center">
    <Text type={textType}>{splitBalanceText[0]}</Text>
    <Text type={textType} color="text-secondary">{splitBalanceText[1]}</Text>
</formatted-balance>
