<script lang="ts">
    import { localize, parseCurrency } from '@core/i18n'
    import { ITokenWithBalance, convertToRawAmount, formatTokenAmountBestMatch } from '@core/token'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import { AmountInput, SliderInput, TokenLabel } from '@ui'
    import { Error as ErrorComponent, Text } from '@bloomwalletio/ui'

    export let disabled = false
    export let votingPower: bigint = BigInt(0)
    export let token: ITokenWithBalance
    export let rawAmount: bigint = BigInt(0)
    export let inputtedAmount: string | undefined = '0'

    let inputElement: HTMLInputElement
    let error: string

    $: allowedDecimals = token?.metadata ? getMaxDecimalsFromTokenMetadata(token.metadata) : 0
    $: availableBalance = (token.balance.available ?? BigInt(0)) + votingPower
    $: inputtedAmount, (error = '')
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
            rawAmount = token?.metadata ? convertToRawAmount(inputtedAmount, token?.metadata) ?? BigInt(0) : BigInt(0)
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
</script>

<div class="w-full flex flex-col space-y-1">
    <div class="cursor-text w-full flex flex-col rounded-lg">
        <div class="flex flex-row w-full items-center space-x-2 relative">
            <TokenLabel {token} />
            <AmountInput
                bind:inputElement
                bind:value={inputtedAmount}
                maxDecimals={allowedDecimals}
                {disabled}
                on:focus={() => (error = '')}
            />
        </div>
        <div class="flex flex-col mt-5">
            <SliderInput bind:value={rawAmount} max={availableBalance} {disabled} />
            <div class="flex flex-row justify-between">
                <Text textColor="secondary">{formatTokenAmountBestMatch(BigInt(0), token?.metadata)}</Text>
                <Text textColor="secondary" type="sm">
                    {formatTokenAmountBestMatch(availableBalance, token?.metadata)}
                </Text>
            </div>
        </div>
    </div>
    {#if error}
        <ErrorComponent {error} />
    {/if}
</div>
