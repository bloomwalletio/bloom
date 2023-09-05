<script lang="ts">
    import { localize, parseCurrency } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import {
        ITokenWithBalance,
        TokenStandard,
        convertToRawAmount,
        formatTokenAmountDefault,
        getUnitFromTokenMetadata,
    } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import { AmountInput, InputContainer, SliderInput, Text, TokenLabel, UnitInput } from '@ui'
    import Big from 'big.js'

    export let inputElement: HTMLInputElement | undefined = undefined
    export let disabled = false
    export let isFocused = false
    export let votingPower: number = 0
    export let token: ITokenWithBalance | undefined =
        $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin
    export let rawAmount: string | undefined = undefined
    export let unit: string | undefined = undefined
    export let amount: string | undefined =
        rawAmount && token?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), token?.metadata, unit, false)
            : undefined

    let amountInputElement: HTMLInputElement
    let error: string

    $: isFocused && (error = '')
    $: allowedDecimals = getMaxDecimalsFromTokenMetadata(token?.metadata, unit)
    $: availableBalance = token?.balance?.available + votingPower
    $: bigAmount = convertToRawAmount(amount, token?.metadata, unit)
    $: max = parseCurrency(formatTokenAmountDefault(availableBalance, token?.metadata, unit, false))
    $: rawAmount = bigAmount?.toString()

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
</script>

<InputContainer bind:this={inputElement} bind:inputElement={amountInputElement} col {isFocused} {error}>
    <div class="flex flex-row w-full items-center space-x-0.5 relative">
        <TokenLabel bind:token />
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
        />
        {#if getUnitFromTokenMetadata(token?.metadata)}
            <UnitInput bind:unit bind:isFocused {disabled} tokenMetadata={token?.metadata} />
        {/if}
    </div>
    <div class="flex flex-col mt-5">
        <SliderInput bind:value={amount} {max} decimals={allowedDecimals} {disabled} />
        <div class="flex flex-row justify-between">
            <Text color="gray-800" darkColor="gray-500" fontSize="xs"
                >{formatTokenAmountDefault(0, token?.metadata, unit)} {unit}</Text
            >
            <Text color="gray-800" darkColor="gray-500" fontSize="xs"
                >{formatTokenAmountDefault(availableBalance, token?.metadata, unit)} {unit}</Text
            >
        </div>
    </div>
</InputContainer>
