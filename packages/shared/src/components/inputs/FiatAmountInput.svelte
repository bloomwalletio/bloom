<script lang="ts">
    import { formatCurrency, getDecimalSeparator, localize } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { activeProfile } from '@core/profile/stores'
    import {
        ITokenWithBalance,
        convertToRawAmount,
        formatTokenAmount,
        getMaxDecimalsFromTokenMetadata,
        validateTokenAmount,
    } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { AmountInput } from '@ui'
    import { Error as ErrorComponent, Text } from '@bloomwalletio/ui'

    export let token: ITokenWithBalance | undefined =
        $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin
    export let rawAmount: bigint | undefined = undefined
    export let unit: string | undefined = undefined
    export let availableBalance: bigint
    export let inputtedAmount: string | undefined =
        rawAmount && token?.metadata
            ? formatTokenAmount(rawAmount, token.metadata, { withUnit: false, round: false })
            : undefined

    type InputFontSize = 'text-32' | 'text-48' | 'text-64'

    let inputElement: HTMLInputElement | undefined
    let error: string | undefined
    let inputLength = 0
    let fontSize: InputFontSize
    let maxLength = 0

    $: inputtedAmount,
        (error = ''),
        (inputLength = getInputLength()),
        (fontSize = getFontSizeForInputLength()),
        (maxLength = getMaxAmountOfDigits())
    $: allowedDecimals = token?.metadata && unit ? getMaxDecimalsFromTokenMetadata(token.metadata, unit) : 0
    $: rawAmount =
        inputtedAmount && token?.metadata ? convertToRawAmount(inputtedAmount, token.metadata, unit) : BigInt(0)
    $: fiatAmount = token ? getFiatValueFromTokenAmount(rawAmount, token) : undefined
    $: maxWidth = `${(inputLength * Number(/\d+/.exec(fontSize)?.[0] ?? 0) * 2) / 3}px`

    function getInputLength(): number {
        const length = inputtedAmount?.length || 1
        const isDecimal = inputtedAmount?.includes('.') || inputtedAmount?.includes(',')

        return length - (isDecimal ? 0.5 : 0)
    }

    function getMaxAmountOfDigits(): number {
        const metadata = token?.metadata
        if (!metadata) {
            return 32
        }

        const decimalSeparator = getDecimalSeparator()

        const decimalPlacesAmount = inputtedAmount?.includes(decimalSeparator)
            ? inputtedAmount.split(decimalSeparator)[1].length || 1
            : 0
        const allowedDecimalAmount = Math.min(decimalPlacesAmount, metadata.decimals)

        const integerLengthOfBalance =
            formatTokenAmount(availableBalance, metadata, { withUnit: false, round: false }).split(
                decimalSeparator
            )?.[0]?.length ?? 0

        return (
            allowedDecimalAmount +
            integerLengthOfBalance +
            (metadata.decimals ? 1 : 0) +
            (inputtedAmount?.includes(decimalSeparator) ? 1 : 0)
        )
    }

    function getFontSizeForInputLength(): InputFontSize {
        if (inputLength < 10) {
            return 'text-64'
        } else if (inputLength < 14) {
            return 'text-48'
        } else {
            return 'text-32'
        }
    }

    export async function validate(allowZeroOrNull = false): Promise<void> {
        if (inputtedAmount === undefined || token === undefined || unit === undefined) {
            throw new Error(localize('error.send.amountInvalidFormat'))
        }
        try {
            rawAmount = await validateTokenAmount(inputtedAmount, token, unit, allowZeroOrNull)
        } catch (err) {
            error = err as string
            throw new Error(error)
        }
    }
</script>

<token-amount-input class="flex flex-col items-center w-full">
    <div class="w-full flex flex-col items-center space-y-1">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            on:click={() => inputElement?.focus()}
            class="flex flex-row justify-center items-end w-full
                gap-0.5 cursor-text rounded-lg"
        >
            <AmountInput
                bind:inputElement
                bind:value={inputtedAmount}
                maxDecimals={allowedDecimals}
                maxlength={maxLength}
                {fontSize}
                {maxWidth}
                autofocus
            />
            <Text class={inputLength < 14 ? 'py-4' : 'py-2'}>
                {unit}
            </Text>
        </div>
        {#if error}
            <ErrorComponent {error} />
        {/if}
    </div>
    <Text textColor="secondary">
        {formatCurrency(fiatAmount) || '--'}
    </Text>
</token-amount-input>
