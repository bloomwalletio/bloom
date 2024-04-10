<script lang="ts">
    import { FontWeight, Input, TextType } from '@ui'
    import { getDecimalSeparator } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let fontSize = 'text-64'
    export let fontWeight = FontWeight.semibold
    export let disabled = false
    export let hasFocus = false
    export let isInteger = false
    export let amount = ''

    $: amount, onAmountInputChange()
    $: textProps = { type: TextType.p, fontSize, fontWeight, lineHeight: '140' }

    function onAmountInputChange(): void {
        const separator = getDecimalSeparator($activeProfile?.settings?.marketCurrency)
        // Add leading zero if decimal separator was entered first
        if (amount?.[0] === separator) {
            amount = '0' + amount
        }
        // Prevent additional leading zeroes from being entered
        else if (amount?.[0] === '0' && amount?.[1] !== separator) {
            amount = amount.slice(1)
        }
    }
</script>

<Input
    bind:inputElement
    bind:value={amount}
    bind:hasFocus
    float={!isInteger}
    integer={isInteger}
    placeholder="0"
    type="text"
    alignment="right"
    {textProps}
    {disabled}
    {...$$restProps}
/>
