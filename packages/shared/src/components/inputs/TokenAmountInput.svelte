<script lang="ts">
    import { formatCurrency, getDecimalSeparator } from '@core/i18n'
    import { getMarketAmountFromTokenValue } from '@core/market/utils'
    import { activeProfile } from '@core/profile'
    import { IToken, formatTokenAmountDefault, getMaxDecimalsFromTokenMetadata } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { convertToRawAmount } from '@core/wallet'
    import { validateTokenAmount } from '@core/wallet/utils/validateTokenAmount'
    import { AmountInput, FontWeight, InputContainer, Text } from '@ui'

    export let token: IToken | undefined = $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin
    export let rawAmount: string | undefined = undefined
    export let unit: string | undefined = undefined
    export let availableBalance: number
    export let inputtedAmount: string | undefined =
        rawAmount && token?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), token.metadata, unit, false)
            : undefined

    let amountInputElement: HTMLInputElement | undefined
    let error: string | undefined
    let inputLength = 0
    let fontSize = 64
    let maxLength = 0

    $: inputtedAmount,
        (error = ''),
        (inputLength = getInputLength()),
        (fontSize = getFontSizeForInputLength()),
        (maxLength = getMaxAmountOfDigits())
    $: allowedDecimals = token?.metadata && unit ? getMaxDecimalsFromTokenMetadata(token.metadata, unit) : 0
    $: bigAmount = inputtedAmount && token?.metadata ? convertToRawAmount(inputtedAmount, token.metadata, unit) : 0
    $: marketAmount = token ? getMarketAmountFromTokenValue(bigAmount, token) : undefined
    $: rawAmount = bigAmount?.toString()

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
            formatTokenAmountDefault(availableBalance, metadata).split(decimalSeparator)?.[0]?.length ?? 0

        return (
            allowedDecimalAmount +
            integerLengthOfBalance +
            (metadata.decimals ? 1 : 0) +
            (inputtedAmount?.includes(decimalSeparator) ? 1 : 0)
        )
    }

    function getFontSizeForInputLength(): number {
        if (inputLength < 10) {
            return 64
        } else if (inputLength < 14) {
            return 48
        } else {
            return 32
        }
    }

    export async function validate(allowZeroOrNull = false): Promise<void> {
        if (inputtedAmount === undefined || token === undefined || unit === undefined) {
            return Promise.reject()
        }
        try {
            rawAmount = await validateTokenAmount(inputtedAmount, token, unit, allowZeroOrNull)
            return Promise.resolve()
        } catch (err) {
            error = err as string
            console.error(error)
            return Promise.reject()
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex flex-col items-center w-full" on:click={() => amountInputElement?.focus()}>
    <InputContainer {error} clearBackground clearPadding clearBorder classes="w-full flex flex-col items-center">
        <div class="flex flex-row items-end space-x-0.5">
            <div class="flex flex-row w-full items-center">
                <amount-wrapper style:--max-width={`${(inputLength * fontSize * 2) / 3}px`}>
                    <AmountInput
                        bind:inputElement={amountInputElement}
                        bind:amount={inputtedAmount}
                        maxDecimals={allowedDecimals}
                        maxlength={maxLength}
                        isInteger={allowedDecimals === 0}
                        {fontSize}
                        clearBackground
                        clearPadding
                        clearBorder
                    />
                </amount-wrapper>
            </div>

            <Text fontWeight={FontWeight.semibold} classes={inputLength < 14 ? 'py-4' : 'py-2'}>
                {unit}
            </Text>
        </div>
    </InputContainer>
    <Text fontWeight={FontWeight.semibold} color="gray-600" darkColor="gray-600">
        {formatCurrency(marketAmount) || '--'}
    </Text>
</div>

<style lang="scss">
    amount-wrapper {
        max-width: var(--max-width);
        @apply flex;
    }
</style>
