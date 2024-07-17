<script lang="ts">
    import { Tile, Text } from '@bloomwalletio/ui'
    import { TransakCryptoCurrency } from '@auxiliary/transak/stores'
    import { FiatCurrency } from '@core/market'
    import { formatCurrency } from '@core/i18n'

    export let cryptoCurrency: TransakCryptoCurrency | undefined
    export let fiatAmount: number | undefined
    export let fiatSymbol: keyof typeof FiatCurrency | undefined
    export let cryptoAmount: number | undefined
</script>

<Tile surface={1} width="full" class={cryptoCurrency ? '' : 'animate-pulse'}>
    <div class="w-full flex justify-between items-center gap-2">
        <img data-label="transak-logo" width="90" height="28" src="assets/logos/transak.svg" alt="Transak" />
        <div class="flex flex-col">
            <Text align="right">{cryptoAmount ? `≈ ${formatCurrency(String(cryptoAmount), cryptoCurrency?.symbol)}` : '​'}</Text>
            <Text align="right">{fiatAmount && fiatSymbol ? formatCurrency(String(fiatAmount), fiatSymbol) : '​'}</Text>
        </div>
    </div>
</Tile>
