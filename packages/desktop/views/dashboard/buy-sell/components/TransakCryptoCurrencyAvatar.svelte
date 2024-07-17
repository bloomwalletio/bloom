<script lang="ts">
    import { TransakCryptoCurrency } from '@auxiliary/transak'
    import { Avatar } from '@bloomwalletio/ui'
    import { CoinGeckoCoinImage } from '@core/market/interfaces'
    import { NetworkBadge } from '@ui/badges'

    export let cryptoCurrency: TransakCryptoCurrency | undefined
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' = 'md'
    export let hideNetworkBadge: boolean = false

    const IMAGE_SIZES: Record<typeof size, keyof CoinGeckoCoinImage> = {
        xxs: 'thumb',
        xs: 'thumb',
        sm: 'thumb',
        base: 'small',
        md: 'small',
        lg: 'small',
    }

    let imageLoadError = false

    $: image = cryptoCurrency?.image[IMAGE_SIZES[size]]
</script>

<div class:animate-pulse={!cryptoCurrency}>
    <Avatar {size} backgroundColor="brand/10">
        {#if image && !imageLoadError}
            <img
                src={image}
                alt={cryptoCurrency?.name ?? ''}
                class="w-full h-full object-cover"
                on:error={() => (imageLoadError = true)}
            />
        {/if}
    </Avatar>
    {#if (size === 'base' || size === 'md' || size === 'lg') && !hideNetworkBadge}
        <span class="relative flex justify-center items-center bottom-0 right-0">
            <NetworkBadge size="xs" networkId={cryptoCurrency?.network.id ?? ''} />
        </span>
    {/if}
</div>
