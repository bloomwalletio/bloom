<script lang="ts">
    import { IconButton, IconName } from '@bloomwalletio/ui'
    import { formatCurrency, getDecimalSeparator } from '@core/i18n'
    import { getFiatAmountFromTokenValue } from '@core/market/actions'
    import { getTokenAmountFromFiatValue } from '@core/market/actions/getTokenAmountFromFiatValue'
    import { activeProfile } from '@core/profile/stores'
    import {
        ITokenWithBalance,
        convertToRawAmount,
        formatTokenAmountDefault,
        getMaxDecimalsFromTokenMetadata,
        validateTokenAmount,
    } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { AmountInput, FontWeight, InputContainer, Text } from '@ui'

    export let token: ITokenWithBalance | undefined =
        $visibleSelectedAccountTokens?.[$activeProfile?.network?.id]?.baseCoin
    export let rawAmount: string | undefined = undefined
    export let unit: string | undefined = undefined
    
    let amountInputElement: HTMLInputElement | undefined
    let error: string | undefined
    let inputLength = 0
    let fontSize = '64'
    let maxLength = 0
    let inputFiatAmount = false

    let primaryAmount = getPrimaryAmount()

    $: allowedDecimals = token?.metadata && unit ? getMaxDecimalsFromTokenMetadata(token.metadata, unit) : 0
    $: rawAmount = getBigAmount(primaryAmount).toString()

    $: primaryAmount,
        (error = ''),
        (inputLength = getInputLength()),
        (fontSize = getFontSizeForInputLength()),
        (maxLength = getMaxAmountOfDigits())
    $: secondaryAmount = getSecondaryAmount(primaryAmount ?? '0')
    $: actualUnit = inputFiatAmount ? '$' : unit
    $: showUnitOnLeft = (actualUnit?.length ?? 0) < 3

    export async function validate(allowZeroOrNull = false): Promise<void> {
        if (primaryAmount === undefined || token === undefined || unit === undefined) {
            return Promise.reject()
        }
        try {
            rawAmount = await validateTokenAmount(rawAmount ?? '0', token, unit, allowZeroOrNull)
            return Promise.resolve()
        } catch (err) {
            error = err as string
            console.error(error)
            return Promise.reject()
        }
    }

    export function setTo(tokenAmount: string): void {
        if (inputFiatAmount && token) {
            const rawAmount = token.metadata ? convertToRawAmount(tokenAmount, token.metadata) : tokenAmount
            primaryAmount = getFiatAmountFromTokenValue(Number(rawAmount), token)?.toFixed(2)
        } else {
            primaryAmount = tokenAmount
        }
    }

    function getBigAmount(inputtedAmount: string | undefined): number {
        if (!inputtedAmount || !token?.metadata) {
            return 0
        }

        let tokenAmount = inputtedAmount
        if (inputFiatAmount) {
            tokenAmount = getTokenAmountFromFiatValue(inputtedAmount, token)?.toString() ?? '0'
        }
        const rawAmount = convertToRawAmount(tokenAmount, token.metadata)?.toString()
        return Number(rawAmount)
    }

    function getPrimaryAmount() {
        return rawAmount && token?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), token.metadata, unit, false)
            : undefined
    }

    function getSecondaryAmount(primaryAmount: string): string {
        if (!token?.metadata) {
            return ''
        }

        if (inputFiatAmount) {
            const rawAmount = getTokenAmountFromFiatValue(primaryAmount ?? '0', token)
            const tokenAmount = formatTokenAmountDefault(Number(rawAmount), token.metadata)
            return `${tokenAmount} ${unit}`
        } else {
            const tokenAmountBig = getBigAmount(primaryAmount ?? '0')
            const fiatAmount = getFiatAmountFromTokenValue(tokenAmountBig, token)?.toFixed(2)
            return formatCurrency(Number(fiatAmount)) || '--'
        }
    }

    function onSwitchClick(): void {
        if (!token || !token.metadata) {
            return
        }
        
        if (inputFiatAmount) {
            const rawAmount = getTokenAmountFromFiatValue(primaryAmount ?? '0', token)
            primaryAmount = formatTokenAmountDefault(Number(rawAmount), token.metadata, unit, false)
            console.log(0, rawAmount, primaryAmount)
        } else {
            primaryAmount = getFiatAmountFromTokenValue(Number(rawAmount ?? '0'), token)?.toFixed(2)
            console.log(1, rawAmount, primaryAmount)
        }
        inputFiatAmount = !inputFiatAmount
    }

    function getInputLength(): number {
        const length = primaryAmount?.length || 1
        const isDecimal = primaryAmount?.includes('.') || primaryAmount?.includes(',')

        return length - (isDecimal ? 0.5 : 0)
    }

    function getMaxAmountOfDigits(): number {
        const metadata = token?.metadata
        if (!metadata) {
            return 32
        }

        const decimalSeparator = getDecimalSeparator()

        const decimalPlacesAmount = primaryAmount?.includes(decimalSeparator)
            ? primaryAmount.split(decimalSeparator)[1].length || 1
            : 0
        const allowedDecimalAmount = Math.min(decimalPlacesAmount, metadata.decimals)

        const availableBalance = token?.balance?.available ?? 0
        const integerLengthOfBalance =
            formatTokenAmountDefault(availableBalance, metadata).split(decimalSeparator)?.[0]?.length ?? 0

        return (
            allowedDecimalAmount +
            integerLengthOfBalance +
            (metadata.decimals ? 1 : 0) +
            (primaryAmount?.includes(decimalSeparator) ? 1 : 0)
        )
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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex flex-col items-center w-full" on:click={() => amountInputElement?.focus()}>
    <InputContainer {error} clearBackground clearPadding clearBorder classes="w-full flex flex-col items-center">
        <div
            class="flex flex-row space-x-0.5 {showUnitOnLeft ? 'items-start' : 'items-end'}"
            class:flex-reverse={showUnitOnLeft}
        >
            <div class="flex flex-row w-full items-center">
                {#if inputFiatAmount}
                    <amount-wrapper style:--max-width={`${(inputLength * Number(fontSize) * 2) / 3}px`}>
                        <AmountInput
                            bind:inputElement={amountInputElement}
                            bind:amount={primaryAmount}
                            maxDecimals={2}
                            isInteger={allowedDecimals === 0}
                            {fontSize}
                            clearBackground
                            clearPadding
                            clearBorder
                            autofocus
                        />
                    </amount-wrapper>
                {:else}
                    <amount-wrapper style:--max-width={`${(inputLength * Number(fontSize) * 2) / 3}px`}>
                        <AmountInput
                            bind:inputElement={amountInputElement}
                            bind:amount={primaryAmount}
                            maxDecimals={allowedDecimals}
                            isInteger={allowedDecimals === 0}
                            {fontSize}
                            clearBackground
                            clearPadding
                            clearBorder
                            autofocus
                        />
                    </amount-wrapper>
                {/if}
            </div>
            <Text fontWeight={FontWeight.semibold} classes={inputLength < 14 ? 'py-4' : 'py-2'}>
                {actualUnit}
            </Text>
        </div>
    </InputContainer>
    <div class="flex flex-row items-center">
        <Text fontWeight={FontWeight.semibold} color="gray-600" darkColor="gray-600">
            <!-- TODO:  -->
            {secondaryAmount}
        </Text>
        {#if secondaryAmount}
            <IconButton icon={IconName.ArrowUpDown} textColor="secondary" size="xs" on:click={onSwitchClick} />
        {/if}
    </div>
</div>

<style lang="postcss">
    amount-wrapper {
        max-width: var(--max-width);
        @apply flex;
    }
</style>
