<script lang="ts">
    import { getDecimalSeparator, localize, parseCurrency } from '@core/i18n'
    import {
        ITokenWithBalance,
        TokenStandard,
        convertToRawAmount,
        formatTokenAmountDefault,
        getUnitFromTokenMetadata,
    } from '@core/token'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import { AmountInput, InputContainer, SliderInput, TokenLabel, UnitInput } from '@ui'
    import { Text } from '@bloomwalletio/ui'
    import Big from 'big.js'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let disabled = false
    export let isFocused = false
    export let votingPower: number = 0
    export let token: ITokenWithBalance
    export let rawAmount: string | undefined = undefined
    export let unit: string | undefined = undefined
    export let amount: string | undefined =
        rawAmount && token?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), token?.metadata, unit, false)
            : undefined

    let amountInputElement: HTMLInputElement
    let error: string
    let inputLength = 0
    let fontSize = '64'
    let maxLength = 0

    $: isFocused && (error = '')
    $: allowedDecimals = getMaxDecimalsFromTokenMetadata(token.metadata, unit)
    $: availableBalance = (token.balance.available ?? 0) + votingPower
    $: bigAmount = convertToRawAmount(amount, token?.metadata, unit)
    $: max = parseCurrency(formatTokenAmountDefault(availableBalance, token?.metadata, unit, false))
    $: rawAmount = bigAmount?.toString()
    $: amount,
        (error = ''),
        (inputLength = getInputLength()),
        (fontSize = getFontSizeForInputLength()),
        (maxLength = getMaxAmountOfDigits())

    export function validate(allowZeroOrNull = false): Promise<void> {
        const amountAsFloat = parseCurrency(amount)
        const isAmountZeroOrNull = !Number(amountAsFloat)
        // Zero value transactions can still contain metadata/tags
        error = ''
        if (allowZeroOrNull && isAmountZeroOrNull) {
            rawAmount = Big(0).toString()
            return
        } else if (isAmountZeroOrNull) {
            error = localize('error.send.amountInvalidFormat')
        } else if (
            ((token?.metadata?.standard === TokenStandard.BaseToken && unit === token?.metadata?.subunit) ||
                (unit === getUnitFromTokenMetadata(token?.metadata) && token?.metadata?.decimals === 0)) &&
            Number.parseInt(amount, 10).toString() !== amount
        ) {
            error = localize('error.send.amountNoFloat')
        } else if (bigAmount.gt(Big(availableBalance))) {
            error = localize('error.send.amountTooHigh')
        } else if (bigAmount.lte(Big(0))) {
            error = localize('error.send.amountZero')
        } else if (!bigAmount.mod(1).eq(Big(0))) {
            error = localize('error.send.amountSmallerThanSubunit')
        }

        if (error) {
            return Promise.reject(error)
        }
        rawAmount = bigAmount.toString()
    }

    function getInputLength(): number {
        const length = rawAmount?.length || 1
        const isDecimal = rawAmount?.includes('.') || rawAmount?.includes(',')

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

        const decimalPlacesAmount = rawAmount?.includes(decimalSeparator)
            ? rawAmount.split(decimalSeparator)[1].length || 1
            : 0
        const allowedDecimalAmount = Math.min(decimalPlacesAmount, metadata.decimals)

        const integerLengthOfBalance =
            formatTokenAmountDefault(availableBalance, metadata).split(decimalSeparator)?.[0]?.length ?? 0

        return (
            allowedDecimalAmount +
            integerLengthOfBalance +
            (metadata.decimals ? 1 : 0) +
            (rawAmount?.includes(decimalSeparator) ? 1 : 0)
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
            bind:amount
            bind:hasFocus={isFocused}
            maxDecimals={allowedDecimals}
            isInteger={allowedDecimals === 0}
            clearBackground
            clearPadding
            clearBorder
            {disabled}
            {fontSize}
        />
        {#if getUnitFromTokenMetadata(token?.metadata)}
            <UnitInput bind:unit bind:isFocused {disabled} tokenMetadata={token?.metadata} />
        {/if}
    </div>

    <div class="flex flex-col mt-5">
        <SliderInput bind:value={amount} {max} decimals={allowedDecimals} {disabled} />
        <div class="flex flex-row justify-between">
            <Text textColor="secondary">{formatTokenAmountDefault(0, token?.metadata, unit)} {unit}</Text>
            <Text textColor="secondary" type="sm"
                >{formatTokenAmountDefault(availableBalance, token?.metadata, unit)} {unit}</Text
            >
        </div>
    </div>
</InputContainer>
