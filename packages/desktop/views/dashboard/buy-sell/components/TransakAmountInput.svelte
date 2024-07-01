<script lang="ts">
    import { activeProfile } from '@core/profile/stores'
    import { AmountInput } from '@ui'
    import { Text } from '@bloomwalletio/ui'

    export let currency = $activeProfile?.settings?.marketCurrency?.toUpperCase()
    export let value: string

    let inputLength: number
    const fontSize: 'text-32' | 'text-48' | 'text-64' = 'text-64'

    $: value, (inputLength = getInputLength())
    $: maxWidth = `${(inputLength * Number(/\d+/.exec(fontSize)?.[0] ?? 0) * 2) / 3}px`

    function getInputLength(): number {
        const length = value?.length || 1
        const isDecimal = value?.includes('.') || value?.includes(',')

        return length - (isDecimal ? 0.5 : 0)
    }
</script>

<div class="flex justify-center items-end gap-1">
    <AmountInput bind:value maxDecimals={2} {fontSize} {maxWidth} />
    <Text class="pb-5">{currency}</Text>
</div>
