<script lang="ts">
    import { getDecimalSeparator, localize, parseCurrency } from '@core/i18n'
    import { ITokenWithBalance, convertToRawAmount, formatTokenAmountBestMatch } from '@core/token'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import { AmountInput, InputContainer, SliderInput, TokenLabel } from '@ui'
    import { Text } from '@bloomwalletio/ui'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let disabled = false
    export let isFocused = false
    export let votingPower: bigint = BigInt(0)
    export let token: ITokenWithBalance
    export let rawAmount: bigint = BigInt(0)

    export let inputtedAmount: string | undefined = '0'

    let amountInputElement: HTMLInputElement
    let error: string
    let inputLength = 0
    let maxLength = 0

    $: isFocused && (error = '')
    $: allowedDecimals = getMaxDecimalsFromTokenMetadata(token?.metadata)
    $: availableBalance = (token.balance.available ?? BigInt(0)) + votingPower
    $: inputtedAmount, (error = ''), (inputLength = getInputLength()), (maxLength = getMaxAmountOfDigits())
    $: inputtedAmount = getTokenAmount(rawAmount)
    $: setRawAmountIfInputMismatch(inputtedAmount)

    function getTokenAmount(rawAmount: bigint): string | undefined {
        return token?.metadata
            ? formatTokenAmountBestMatch(rawAmount, token?.metadata, { withUnit: false, round: false })
            : undefined
    }

    function setRawAmountIfInputMismatch(inputtedAmount: string | undefined): void {
        const formattedAmount = getTokenAmount(rawAmount)
        if (inputtedAmount && inputtedAmount !== formattedAmount) {
            rawAmount = convertToRawAmount(inputtedAmount, token?.metadata) ?? BigInt(0)
        }
    }

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
    }

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
    <div class="flex flex-row w-full items-center space-x-2 relative">
        <TokenLabel {token} />
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
            fontSize="text-32"
        />
    </div>

    <div class="flex flex-col mt-5">
        <SliderInput bind:value={rawAmount} max={availableBalance} {disabled} />
        <div class="flex flex-row justify-between">
            <Text textColor="secondary">{formatTokenAmountBestMatch(BigInt(0), token?.metadata)}</Text>
            <Text textColor="secondary" type="sm">{formatTokenAmountBestMatch(availableBalance, token?.metadata)}</Text>
        </div>
    </div>
</InputContainer>
