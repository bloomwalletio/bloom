<script lang="ts">
    import { Text, TextType, textType as textTypeArray } from '@bloomwalletio/ui'
    import { getDecimalSeparator } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { tick } from 'svelte'

    export let balanceText: string = ''
    export let textType: TextType = 'h1'

    let usedTextType = textType

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

    $: if (textContainerRef && wrapperRef) {
        void adjustTextType()
    }

    async function adjustTextType(): Promise<void> {
        const containerRightEdge = wrapperRef.getBoundingClientRect().right

        // Start with the largest possible font size.
        let currentIndex = 0
        usedTextType = textTypeArray[currentIndex]

        // Force an update to the DOM.
        await tick()

        // Reduce font size until the content fits or until reaching the smallest size.
        while (currentIndex < textTypeArray.length - 1) {
            const lastElementOfWrapper = wrapperRef.lastElementChild
            const lastElementOfTextContainer = textContainerRef.lastElementChild

            if (!lastElementOfWrapper || !lastElementOfTextContainer) return

            // Determine the relevant right edge based on whether a unit exists.
            const lastChildRightEdge = unit
                ? lastElementOfWrapper.getBoundingClientRect().right
                : lastElementOfTextContainer.getBoundingClientRect().right

            if (lastChildRightEdge <= containerRightEdge) {
                break
            }

            // Adjust to next font size.
            currentIndex++
            usedTextType = textTypeArray[currentIndex]

            // Force another update to the DOM.
            await tick()
        }
    }
</script>

<formatted-balance bind:this={wrapperRef} class="flex flex-row w-full items-center space-x-2 {usedTextType}">
    <div bind:this={textContainerRef} class="flex flex-row items-center">
        <Text type={usedTextType}>{integer}</Text>
        <Text type={usedTextType} textColor="secondary">{separator}</Text>
        <Text type={usedTextType} textColor="secondary" truncate>{decimals}</Text>
    </div>
    {#if unit}
        <Text type={usedTextType}>{unit}</Text>
    {/if}
</formatted-balance>
