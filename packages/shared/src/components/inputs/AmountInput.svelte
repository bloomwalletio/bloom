<script lang="ts">
    import { onMount, tick } from 'svelte'
    import { DECIMAL_SEPARATORS, formatNumber, getDecimalSeparator, parseCurrency } from '@core/i18n'
    import { isNumber } from '@core/utils'

    export let value: string = ''
    export let maxlength: number | undefined = undefined
    export let maxDecimals: number = 0
    export let maxWidth: string | undefined = undefined
    export let disabled = false
    export let autofocus = false
    export let inputElement: HTMLInputElement | undefined = undefined
    export let fontSize: 'text-32' | 'text-48' | 'text-64' = 'text-32'

    $: isFloat = maxDecimals !== 0

    const decimalSeparator = getDecimalSeparator()

    const LINE_HEIGHT_MAP: Record<string, string> = {
        'text-64': 'leading-140',
        'text-48': 'leading-160',
        'text-32': 'leading-160',
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            return
        }

        if (!isValidInput(event.key)) {
            event.preventDefault()
            return
        }

        removeLeadingZero()

        const isDecimalSeparator = DECIMAL_SEPARATORS.includes(event.key)

        if (!isDecimalSeparator) {
            return
        }

        if (value === '') {
            value = '0' + decimalSeparator
        } else {
            replaceDecimalSeparator(event)
        }

        event.preventDefault()
    }

    function isValidInput(key: string): boolean {
        const isDecimalSeparator = DECIMAL_SEPARATORS.includes(key)

        if (!isDecimalSeparator && !isNumber(key)) {
            return false
        }

        if (isDecimalSeparator && !isFloat) {
            return false
        }

        const hasDecimalSeparator = value?.includes(decimalSeparator)
        const isDuplicateSeparator = hasDecimalSeparator && isDecimalSeparator
        const numberOfDecimals = value.split(decimalSeparator)[1]?.length ?? 0
        const isCursorAfterDecimalSeparator =
            hasDecimalSeparator && (inputElement?.selectionStart ?? 0) > value.indexOf(decimalSeparator)

        if (isDuplicateSeparator || (isCursorAfterDecimalSeparator && numberOfDecimals >= maxDecimals)) {
            return false
        }

        return true
    }

    function removeLeadingZero(): void {
        if (value.startsWith('0') && value.length > 0 && value[1] !== decimalSeparator) {
            value = value.slice(1)
        }
    }

    function replaceDecimalSeparator(event: KeyboardEvent): void {
        const target = event.target as HTMLInputElement
        const currentCaretPosition = target.selectionStart ?? 0
        value = value.slice(0, currentCaretPosition) + decimalSeparator + value.slice(target.selectionEnd ?? 0)
        target.setSelectionRange(currentCaretPosition + 1, currentCaretPosition + 1)
    }

    function onPaste(event: ClipboardEvent): void {
        if (!event.clipboardData) {
            return
        }

        const pasteValue = event.clipboardData.getData('text')

        if (!isValidPasteValue(pasteValue)) {
            event.preventDefault()
            return
        }

        const currencyValue = Number(parseCurrency(pasteValue))
        if (maxDecimals !== undefined) {
            value = formatNumber(currencyValue, undefined, maxDecimals, 0)
            event.preventDefault()
        }
    }

    function isValidPasteValue(value: string): boolean {
        const isNegativeOrScientific = value.includes('e') || value.includes('-')
        const hasDecimalSeparator = DECIMAL_SEPARATORS.some((separator) => value.includes(separator))

        return isNegativeOrScientific || (!isFloat && hasDecimalSeparator) || !isNumber(value)
    }

    onMount(async () => {
        if (autofocus) {
            await tick()
            inputElement?.focus()
        }
    })
</script>

<input
    bind:value
    bind:this={inputElement}
    on:keypress={onKeyPress}
    on:paste={onPaste}
    on:focus
    on:blur
    style:max-width={maxWidth}
    {disabled}
    {maxlength}
    type="text"
    placeholder="0"
    spellcheck="false"
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
