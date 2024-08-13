<script lang="ts">
    import { activeProfile } from '@core/profile/stores'
    import { AmountInput } from '@ui'
    import { Error, Text } from '@bloomwalletio/ui'
    import { localize, formatCurrency } from '@core/i18n'

    export let currency = $activeProfile?.settings?.marketCurrency?.toUpperCase()
    export let value: string
    export let minValue: number | undefined = undefined
    export let maxValue: number | undefined = undefined

    const fontSize: 'text-32' | 'text-48' | 'text-64' = 'text-64'

    let inputLength: number
    let error: string = '​'

    $: value, (inputLength = getInputLength())
    $: maxWidth = `${(inputLength * Number(/\d+/.exec(fontSize)?.[0] ?? 0) * 2) / 3}px`
    $: {
        if (minValue !== undefined && Number(value) < minValue) {
            error = localize('error.buySell.minAmount', { amount: formatCurrency(String(minValue), currency) })
        } else if (maxValue !== undefined && Number(value) > maxValue) {
            error = localize('error.buySell.maxAmount', { amount: formatCurrency(String(maxValue), currency) })
        } else {
            error = '​'
        }
    }

    function getInputLength(): number {
        const length = value?.length || 1
        const isDecimal = value?.includes('.') || value?.includes(',')

        return length - (isDecimal ? 0.5 : 0)
    }
</script>

<div class="flex flex-col justify-center items-center gap-1">
    <div class="flex justify-center items-end gap-1">
        <AmountInput bind:value maxDecimals={2} {fontSize} {maxWidth} />
        <Text class="pb-5">{currency}</Text>
    </div>
    <Error {error} />
</div>
