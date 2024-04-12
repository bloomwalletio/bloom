<script lang="ts">
    import { onMount, tick } from 'svelte'
    import { TEXT_ALIGNMENT_MAP } from '@bloomwalletio/ui'
    import { DECIMAL_SEPARATORS, formatNumber, getDecimalSeparator, parseCurrency } from '@core/i18n'

    export let amount: string = ''
    export let maxlength: number = 0
    export let maxDecimals: number = 0
    export let disabled = false
    export let integer = false
    export let autofocus = false
    export let hasFocus = false
    export let inputElement: HTMLInputElement | undefined = undefined
    export let fontSize: 'text-32' | 'text-48' | 'text-64' = 'text-32'

    const decimalSeparator = getDecimalSeparator()
    const LINE_HEIGHT_MAP: Record<string, string> = {
        'text-64': 'leading-140',
        'text-48': 'leading-160',
        'text-32': 'leading-160',
    }

    function handleInput(event: Event): void {
        // Add leading zero if decimal separator was entered first
        if (amount?.[0] === decimalSeparator) {
            amount = '0' + amount
        }
        // Prevent additional leading zeroes from being entered
        else if (amount?.[0] === '0' && amount?.[1] !== decimalSeparator) {
            amount = amount.slice(1)
        }

        amount = (event.target as HTMLInputElement).value
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Tab') return

        const isEnter = event.key === 'Enter'
        if (integer && isEnter) return

        // if the input is float, we accept one dot or comma depending on localization
        if (!integer && event.key === decimalSeparator) {
            if (amount?.indexOf(decimalSeparator) >= 0) {
                event.preventDefault()
            }
            return
        }

        if ('0123456789'?.indexOf(event.key) < 0) {
            // if float or integer we accept numbers
            event.preventDefault()
            return
        }

        // If max decimals are set only allow certain number after decimal separator
        if (!integer && maxDecimals !== undefined && '0123456789'?.indexOf(event.key) >= 0) {
            const sepPos = amount?.indexOf(decimalSeparator)
            if (sepPos < 0) return

            // If caret position is after the separator then check
            const target = event.target as HTMLInputElement
            if (target.selectionEnd && target.selectionEnd <= sepPos) return

            // If sel start and end are different that means
            // the text has been highlighted for overwrite
            // if they are the same then it single insertion
            if (target.selectionStart !== target.selectionEnd) return

            const numDecimals = amount.length - sepPos - 1
            if (numDecimals >= maxDecimals) {
                event.preventDefault()
            }
        }
    }

    function onPaste(event: ClipboardEvent): void {
        if (!event.clipboardData || !integer) return

        const pasteVal = event.clipboardData.getData('text')
        // Discard scientific notation or negative
        if (pasteVal?.indexOf('e') >= 0 || pasteVal?.indexOf('-') >= 0) {
            event.preventDefault()
            return
        }

        if (!integer) {
            const val = Number(parseCurrency(pasteVal))
            if (maxDecimals !== undefined) {
                amount = formatNumber(val, undefined, maxDecimals, 0)
                event.preventDefault()
            }
            return
        }

        if (integer) {
            // Discard anything with a decimal separator
            if (DECIMAL_SEPARATORS.some((sep) => pasteVal?.indexOf(sep) >= 0)) {
                event.preventDefault()
                return
            }

            const val = Number.parseInt(pasteVal, 10)
            // Discard any number we can't parse as integers
            if (Number.isNaN(val)) {
                event.preventDefault()
            }
        }
    }

    onMount(async () => {
        if (autofocus) {
            await tick()
            inputElement?.focus()
        }
    })
</script>

<input
    type="text"
    value={amount}
    bind:this={inputElement}
    {maxlength}
    class="w-full block font-semibold
            bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark
            {fontSize}
            {LINE_HEIGHT_MAP[fontSize]}
            {TEXT_ALIGNMENT_MAP['right']}
        "
    on:input={handleInput}
    on:keypress={onKeyPress}
    on:paste={onPaste}
    on:focus={() => (hasFocus = true)}
    on:blur={() => (hasFocus = false)}
    placeholder="0"
    spellcheck={false}
    {disabled}
/>

<style lang="postcss">
    input {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            @apply m-0;
        }

        &::placeholder {
            @apply text-secondary;
        }
    }
</style>
