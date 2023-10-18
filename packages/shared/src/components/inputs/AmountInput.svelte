<script lang="ts">
    import { NumberInput, FontWeight } from '@ui'
    import { getDecimalSeparator } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let fontSize = 24
    export let fontWeight = FontWeight.semibold
    export let disabled = false
    export let hasFocus = false
    export let amount: string = ''

    $: amount, onAmountInputChange()

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

<NumberInput
    bind:inputElement
    bind:value={amount}
    bind:hasFocus
    {disabled}
    placeholder="0"
    {fontSize}
    alignment="right"
    {fontWeight}
    {...$$restProps}
/>
