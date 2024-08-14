<script lang="ts">
    import { Tile, Text } from '@bloomwalletio/ui'
    import { TransakCryptoCurrency } from '@auxiliary/transak/stores'
    import { FiatCurrency } from '@core/market'
    import { formatCurrency } from '@core/i18n'

    export let isLoading: boolean = false
    export let cryptoCurrency: TransakCryptoCurrency | undefined = undefined
    export let fiatAmount: number | undefined = undefined
    export let fiatSymbol: keyof typeof FiatCurrency | string | undefined = undefined
    export let cryptoAmount: number | undefined = undefined
    export let onClick: () => void = () => {}
    export let selected: boolean = false
</script>

<Tile surface={1} width="full" class={isLoading ? 'animate-pulse' : ''} {onClick} {selected}>
    <div class="w-full flex justify-between items-center gap-2">
        {#if isLoading}
            <div class="w-7 h-7 rounded-full bg-surface-2 dark:bg-surface-2-dark animate-pulse"></div>
            <div class="flex flex-col items-end gap-1">
                <div class="w-16 h-4 bg-surface-2 dark:bg-surface-2-dark animate-pulse"></div>
                <div class="w-12 h-4 bg-surface-2 dark:bg-surface-2-dark animate-pulse"></div>
            </div>
        {:else}
            <img
                data-label="transak-logo"
                width="90"
                height="28"
                src="assets/logos/transak.svg"
                alt="Transak"
                class:opacity-0={isLoading}
            />
            <div class="flex flex-col">
                <Text align="right">
                    {fiatAmount && fiatSymbol ? formatCurrency(String(fiatAmount), fiatSymbol) : '​'}
                </Text>
                <Text align="right" fontWeight="medium" textColor="secondary">
                    {cryptoAmount ? `≈ ${formatCurrency(String(cryptoAmount), cryptoCurrency?.symbol)}` : '​'}
                </Text>
            </div>
        {/if}
    </div>
</Tile>
