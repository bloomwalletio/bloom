<script lang="ts">
    import { Text, TextType } from '@bloomwalletio/ui'
    import { getDecimalSeparator } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { pxToRem } from '@core/utils'
    import { tick } from 'svelte'

    export let balanceText: string = ''
    export let textType: TextType = 'h1'
    export let autoAdjustFontSize: boolean = false

    $: ({ integer, separator, decimals, unit } = getSplitBalanceText(balanceText))

    function getSplitBalanceText(balance: string): {
        integer: string
        separator: string
        decimals: string
        unit: string
    } {
        const separator = getDecimalSeparator($activeProfile?.settings?.marketCurrency)
        const [integer, decimals] = balance.split(separator)
        if (decimals) {
            const [_decimals, unit] = decimals.split(/\s/g)
            return { integer, separator, decimals: _decimals, unit }
        } else {
            const [_integer, unit] = integer.split(/\s/g)
            return { integer: _integer, separator, decimals: '00', unit }
        }
    }

    let textContainerRef: HTMLElement
    let wrapperRef: HTMLElement

    $: if (autoAdjustFontSize && textContainerRef && wrapperRef) {
        void adjustFontSize()
    }

    async function adjustFontSize(): Promise<void> {
        const MIN_FONT_SIZE = 0.75 // rem
        const containerRightEdge = wrapperRef.getBoundingClientRect().right

        // Gets current font size to start from
        let fontSize = getComputedFontSizeInRem()

        // Force an update to the DOM.
        await tick()

        // Reduce font size until the content fits or until reaching the smallest size.
        while (fontSize > MIN_FONT_SIZE) {
            const lastElementOfWrapper = wrapperRef?.lastElementChild
            const lastElementOfTextContainer = textContainerRef?.lastElementChild

            if (!lastElementOfWrapper || !lastElementOfTextContainer) {
                return
            }

            // Determine the relevant right edge based on whether a unit exists.
            const lastChildRightEdge = unit
                ? lastElementOfWrapper.getBoundingClientRect().right
                : lastElementOfTextContainer.getBoundingClientRect().right

            if (lastChildRightEdge <= containerRightEdge) {
                break
            }

            // Adjust to next font size.
            fontSize -= 0.1
            setFontSizeForTexts(fontSize)

            // Force another update to the DOM.
            await tick()
        }
    }

    function setFontSizeForTexts(fontSizeInRem: number): void {
        const fontSizeValue = fontSizeInRem + 'rem'
        if (unit) {
            const unitTextElement = wrapperRef.lastElementChild as HTMLElement
            unitTextElement.style.fontSize = fontSizeValue
        }
        for (const child of Array.from(textContainerRef.children)) {
            const childElement = child as HTMLElement
            childElement.style.fontSize = fontSizeValue
        }
    }

    function getComputedFontSizeInRem(): number {
        const fontSize = window.getComputedStyle(textContainerRef.firstElementChild).fontSize
        return pxToRem(parseFloat(fontSize))
    }
</script>

<formatted-balance bind:this={wrapperRef} class="flex flex-row w-full items-center space-x-2">
    <div bind:this={textContainerRef} class="flex flex-row items-center">
        <Text type={textType}>{integer}</Text>
        <Text type={textType} textColor="secondary">{separator}</Text>
        <Text type={textType} textColor="secondary" truncate>{decimals}</Text>
    </div>
    {#if unit}
        <Text type={textType}>{unit}</Text>
    {/if}
</formatted-balance>
