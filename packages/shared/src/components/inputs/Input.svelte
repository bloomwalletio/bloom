<script lang="ts">
    import { onMount, tick } from 'svelte'
    import { InputContainer } from '@ui'
    import { Text, TEXT_ALIGNMENT_MAP } from '@bloomwalletio/ui'
    import { DECIMAL_SEPARATORS, formatNumber, getDecimalSeparator, parseCurrency } from '@core/i18n'
    import { localize } from '@core/i18n'

    export let value: string = ''
    export let classes: string = ''
    export let style: string = ''
    export let placeholder: string = ''
    export let error: string = ''
    export let maxlength: number = 0
    export let float = false
    export let integer = false
    export let autofocus = false
    export let maxDecimals: number = 0
    export let capsLockWarning = false
    export let inputElement: HTMLInputElement | undefined = undefined
    export let clearBackground = false
    export let clearPadding = false
    export let clearBorder = false
    export let fontSize: 'text-32' | 'text-48' | 'text-64' = 'text-32'
    export let hasFocus = false
    export let validationFunction: ((arg: string) => void) | undefined = undefined

    export function validate(): void {
        error = ''
        if (validationFunction && typeof validationFunction === 'function') {
            try {
                validationFunction(value)
            } catch (err) {
                error = err?.message ?? err ?? ''
                throw err
            }
        }
    }

    const decimalSeparator = getDecimalSeparator()
    const LINE_HEIGHT_MAP: Record<string, string> = {
        'text-64': 'leading-140',
        'text-48': 'leading-160',
        'text-32': 'leading-160',
    }

    let capsLockOn = false

    function handleInput(event: Event): void {
        value = (event.target as HTMLInputElement).value
    }

    function onKeyCaps(event: KeyboardEvent): void {
        capsLockOn = event.getModifierState('CapsLock')
    }

    function onKeyPress(event: KeyboardEvent): void {
        if (event.key !== 'Tab') {
            const isEnter = event.key === 'Enter'
            if ((float || integer) && !isEnter) {
                // if the input is float, we accept one dot or comma depending on localization
                if (float && event.key === decimalSeparator) {
                    if (value?.indexOf(decimalSeparator) >= 0) {
                        event.preventDefault()
                    }
                } else if ('0123456789'?.indexOf(event.key) < 0) {
                    // if float or integer we accept numbers
                    event.preventDefault()
                } else if (float && maxDecimals !== undefined && '0123456789'?.indexOf(event.key) >= 0) {
                    // If max decimals are set only allow certain number after decimal separator
                    const sepPos = value?.indexOf(decimalSeparator)
                    if (sepPos >= 0) {
                        // If caret position is after the separator then check
                        if ((event.target as HTMLInputElement).selectionEnd > sepPos) {
                            // If sel start and end are different that means
                            // the text has been highlighted for overwrite
                            // if they are the same then it single insertion
                            if (
                                (event.target as HTMLInputElement).selectionStart ===
                                (event.target as HTMLInputElement).selectionEnd
                            ) {
                                const numDecimals = value.length - sepPos - 1
                                if (numDecimals >= maxDecimals) {
                                    event.preventDefault()
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function onPaste(event: ClipboardEvent): void {
        if (event.clipboardData && (float || integer)) {
            const pasteVal = event.clipboardData.getData('text')
            // Discard scientific notation or negative
            if (pasteVal?.indexOf('e') >= 0 || pasteVal?.indexOf('-') >= 0) {
                event.preventDefault()
            } else if (float) {
                const val = Number(parseCurrency(pasteVal))
                if (maxDecimals !== undefined) {
                    value = formatNumber(val, undefined, maxDecimals, 0)
                    event.preventDefault()
                }
            } else if (integer) {
                // Dicard anything with a decimal separator
                if (DECIMAL_SEPARATORS.some((sep) => pasteVal?.indexOf(sep) >= 0)) {
                    event.preventDefault()
                } else {
                    const val = Number.parseInt(pasteVal, 10)
                    // Discard any number we can't parse as integers
                    if (Number.isNaN(val)) {
                        event.preventDefault()
                    }
                }
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

<div class="w-full {classes}">
    <div class="w-full relative">
        <InputContainer
            bind:inputElement
            {error}
            isFocused={hasFocus}
            {clearBackground}
            {clearPadding}
            {clearBorder}
            classes="relative"
        >
            <Text class="flex w-full">
                <input
                    type="text"
                    {value}
                    bind:this={inputElement}
                    {maxlength}
                    class="w-full
                            bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark
                            {fontSize}
                            {LINE_HEIGHT_MAP[fontSize]}
                            {TEXT_ALIGNMENT_MAP['right']}
                        "
                    on:input={handleInput}
                    on:keypress={onKeyPress}
                    on:keydown={onKeyCaps}
                    on:keyup={onKeyCaps}
                    on:paste={onPaste}
                    on:focus={() => (hasFocus = true)}
                    on:blur={() => (hasFocus = false)}
                    {placeholder}
                    {style}
                    spellcheck={false}
                    {...$$restProps}
                />
            </Text>
        </InputContainer>
    </div>
    {#if capsLockWarning && hasFocus && capsLockOn}
        <Text smaller overrideColor classes="mt-1 text-orange-500">{localize('general.capsLock')}</Text>
    {/if}
</div>

<style lang="scss">
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        @apply m-0;
    }
    input {
        &::placeholder {
            @apply text-gray-500;
        }
    }
</style>
