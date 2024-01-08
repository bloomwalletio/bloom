<script lang="ts">
    import { getDecimalSeparator, localize, parseCurrency } from '@core/i18n'
    import {
        ITokenWithBalance,
        TokenStandard,
        convertToRawAmount,
        formatTokenAmountBestMatch,
        getUnitFromTokenMetadata,
    } from '@core/token'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import { AmountInput, InputContainer, SliderInput, TokenLabel, UnitInput } from '@ui'
    import { Text } from '@bloomwalletio/ui'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let disabled = false
    export let isFocused = false
    export let votingPower: bigint = BigInt(0)
    export let token: ITokenWithBalance
    export let rawAmount: bigint | undefined = undefined
    export let unit: string | undefined = undefined
    export let inputtedAmount: string | undefined =
        rawAmount && token?.metadata ? formatTokenAmountBestMatch(rawAmount, token?.metadata, false, false) : undefined

    let amountInputElement: HTMLInputElement
    let error: string
    let inputLength = 0
    let fontSize = '64'
    let maxLength = 0

    $: isFocused && (error = '')
    $: allowedDecimals = getMaxDecimalsFromTokenMetadata(token?.metadata, unit)
    $: availableBalance = (token.balance.available ?? BigInt(0)) + votingPower
    $: max = Number(parseCurrency(formatTokenAmountBestMatch(availableBalance, token?.metadata, false, false)))
    $: inputtedAmount,
        (error = ''),
        (inputLength = getInputLength()),
        (fontSize = getFontSizeForInputLength()),
        (maxLength = getMaxAmountOfDigits())

    export function validate(allowZeroOrNull = false): void {
        if (inputtedAmount === undefined) {
            throw new Error(localize('error.send.amountInvalidFormat'))
        }
        const amountAsFloat = parseCurrency(inputtedAmount)
        const isAmountZeroOrNull = !Number(amountAsFloat)
        // Zero value transactions can still contain metadata/tags
        error = ''

        if (allowZeroOrNull && isAmountZeroOrNull) {
            rawAmount = BigInt(0)
            return
        } else if (isAmountZeroOrNull) {
            error = localize('error.send.amountInvalidFormat')
        } else if (
            token?.metadata &&
            ((token.metadata.standard === TokenStandard.BaseToken && unit === token.metadata.subunit) ||
                (unit === getUnitFromTokenMetadata(token.metadata) && token.metadata.decimals === 0)) &&
            Number.parseInt(inputtedAmount, 10).toString() !== inputtedAmount
        ) {
            error = localize('error.send.amountNoFloat')
        } else if (rawAmount && rawAmount > availableBalance) {
            error = localize('error.send.amountTooHigh')
        } else if (rawAmount && rawAmount <= 0) {
            error = localize('error.send.amountZero')
        } else if (rawAmount && rawAmount % BigInt(1) !== BigInt(0)) {
            error = localize('error.send.amountSmallerThanSubunit')
        }

        if (error) {
            throw new Error(error)
        }
        rawAmount = convertToRawAmount(inputtedAmount, token?.metadata, unit)
    }

    function getInputLength(): number {
        const length = inputtedAmount?.length || 1
        const isDecimal = inputtedAmount?.includes('.') || inputtedAmount?.includes(',')

        return length - (isDecimal ? 0.5 : 0)
    }

    function getFontSizeForInputLength(): string {
        if (inputLength < 10) {
            return '64'
        } else if (inputLength < 14) {
            return '48'
        } else {
            return '32'
        }
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
            formatTokenAmountBestMatch(availableBalance, metadata).split(decimalSeparator)?.[0]?.length ?? 0

        return (
            allowedDecimalAmount +
            integerLengthOfBalance +
            (metadata.decimals ? 1 : 0) +
            (inputtedAmount?.includes(decimalSeparator) ? 1 : 0)
        )
    }
</script>

<InputContainer bind:this={inputElement} bind:inputElement={amountInputElement} col {isFocused} {error}>
    <div class="w-fit mx-auto">
        <TokenLabel bind:token />
    </div>
    <div class="flex flex-row w-full items-center space-x-0.5 relative">
        <AmountInput
            bind:inputElement={amountInputElement}
            bind:amount={inputtedAmount}
            bind:hasFocus={isFocused}
            maxDecimals={allowedDecimals}
            isInteger={allowedDecimals === 0}
            clearBackground
            clearPadding
            clearBorder
            {disabled}
            {fontSize}
        />
        {#if token?.metadata && getUnitFromTokenMetadata(token.metadata)}
            <UnitInput bind:unit bind:isFocused {disabled} tokenMetadata={token?.metadata} />
        {/if}
    </div>

    <div class="flex flex-col mt-5">
        <SliderInput bind:value={inputtedAmount} {max} decimals={allowedDecimals} {disabled} />
        <div class="flex flex-row justify-between">
            <Text textColor="secondary">{formatTokenAmountBestMatch(BigInt(0), token?.metadata, unit)} {unit}</Text>
            <Text textColor="secondary" type="sm"
                >{formatTokenAmountBestMatch(availableBalance, token?.metadata, unit)} {unit}</Text
            >
        </div>
    </div>
</InputContainer>
