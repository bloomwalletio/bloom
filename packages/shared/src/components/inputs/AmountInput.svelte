<script lang="ts">
    import { onMount, tick } from 'svelte'
    import { DECIMAL_SEPARATORS, formatNumber, getDecimalSeparator, parseCurrency } from '@core/i18n'
    import { isNumber } from '@core/utils'

    export let amount: string = ''
    export let maxlength: number = 0
    export let maxDecimals: number = 0
    export let disabled = false
    export let autofocus = false
    export let hasFocus = false
    export let inputElement: HTMLInputElement | undefined = undefined
    export let fontSize: 'text-32' | 'text-48' | 'text-64' = 'text-32'

    $: isFloat = maxDecimals !== 0

    const decimalSeparator = getDecimalSeparator()

    const LINE_HEIGHT_MAP: Record<string, string> = {
        'text-64': 'leading-140',
        'text-48': 'leading-160',
        'text-32': 'leading-160',
    }

    function handleInput(event: Event): void {
        if (amount?.[0] === decimalSeparator) {
            amount = '0' + amount
        } else if (amount?.[0] === '0' && amount?.[1] !== decimalSeparator) {
            amount = amount.slice(1)
        }
        amount = (event.target as HTMLInputElement).value
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (isFloat && event.key === decimalSeparator) {
            if (amount?.indexOf(decimalSeparator) >= 0) {
                event.preventDefault()
            }
            return
        }

        if (!isNumber(event.key)) {
            event.preventDefault()
            return
        }

        if (isFloat) {
            const sepPos = amount?.indexOf(decimalSeparator)
            if (sepPos < 0) return

            const target = event.target as HTMLInputElement

            if (target.selectionEnd && target.selectionEnd <= sepPos) return
            if (target.selectionStart !== target.selectionEnd) return

            const numDecimals = amount.length - sepPos - 1
            if (numDecimals >= maxDecimals) {
                event.preventDefault()
            }
        }
    }

    function onPaste(event: ClipboardEvent): void {
        if (!event.clipboardData) {
            return
        }

        const pasteVal = event.clipboardData.getData('text')

        const isNegativeOrScientific = pasteVal?.indexOf('e') >= 0 || pasteVal?.indexOf('-') >= 0
        const hasDecimalSeparator = DECIMAL_SEPARATORS.some((sep) => pasteVal?.indexOf(sep) >= 0)

        if (isNegativeOrScientific || (!isFloat && hasDecimalSeparator) || !isNumber(pasteVal)) {
            event.preventDefault()
            return
        }

        const val = Number(parseCurrency(pasteVal))
        if (maxDecimals !== undefined) {
            amount = formatNumber(val, undefined, maxDecimals, 0)
            event.preventDefault()
        }
        return
    }

    onMount(async () => {
        if (autofocus) {
            await tick()
            inputElement?.focus()
        }
    })
</script>

<input
    bind:this={inputElement}
    on:input={handleInput}
    on:keypress={onKeyPress}
    on:paste={onPaste}
    on:focus={() => (hasFocus = true)}
    on:blur={() => (hasFocus = false)}
    {disabled}
    {maxlength}
    type="text"
    placeholder="0"
    spellcheck="false"
    value={amount}
    class="w-full block font-semibold text-right
        bg-surface dark:bg-surface-dark
        text-primary dark:text-primary-dark
        placeholder:text-secondary
        {fontSize}
        {LINE_HEIGHT_MAP[fontSize]}
    "
/>

<style lang="postcss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        @apply m-0;
    }
</style>
