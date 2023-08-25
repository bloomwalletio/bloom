<script lang="ts">
    import { Avatar, IconName } from '@bloomwalletio/ui'
    import { NetworkId, SupportedNetworkId } from '@core/network'

    export let networkId: NetworkId
    export let size: 'xxs' | 'xs' | 'sm' = 'sm'

    const AVATAR_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Shimmer]: '#17E1D5',
        [SupportedNetworkId.Testnet]: 'gray-400',
    }
</script>

<!-- Todo: replace with icon colour and correct icon name when added bloom-ui -->
<Avatar {size} color={AVATAR_COLOR[networkId] ?? 'gray-400'} icon={IconName.Cpu} />
