<script lang="ts">
    import { TransakCryptoCurrency } from '@auxiliary/transak/stores'
    import { Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { NetworkNamePill } from '@ui/pills'
    import TransakCryptoCurrencyAvatar from './TransakCryptoCurrencyAvatar.svelte'

    export let cryptoCurrency: TransakCryptoCurrency | undefined
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let variant: 'selector' | 'item' = 'item'
</script>

<Tile {onClick} {selected} surface={1} width="full" class={cryptoCurrency ? '' : 'animate-pulse'}>
    <div class="w-full flex items-center gap-2">
        <TransakCryptoCurrencyAvatar {cryptoCurrency} hideNetworkBadge />
        {#if variant === 'item'}
            <div class="flex w-full justify-between items-center">
                <div class="flex flex-col">
                    <Text>{cryptoCurrency?.symbol ?? '​'}</Text>
                    <Text fontWeight="medium">{cryptoCurrency?.name ?? '​'}</Text>
                </div>
                <NetworkNamePill
                    networkId={cryptoCurrency?.network.id}
                    networkName={cryptoCurrency?.network.name}
                    compact
                />
            </div>
        {:else}
            <div class="flex w-full justify-between items-center">
                <div class="flex flex-col">
                    <Text>{cryptoCurrency?.symbol ?? '​'}</Text>
                    <NetworkNamePill
                        networkId={cryptoCurrency?.network.id}
                        networkName={cryptoCurrency?.network.name}
                        compact
                    />
                </div>
                <Icon name={IconName.ChevronDown} size="sm" />
            </div>
        {/if}
    </div>
</Tile>
