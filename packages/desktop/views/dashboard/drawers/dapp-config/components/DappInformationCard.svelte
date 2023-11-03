<script lang="ts">
    import { Link, Text } from '@bloomwalletio/ui'
    import { Tile } from '@ui'
    import { CoreTypes } from '@walletconnect/types'

    export let metadata: CoreTypes.Metadata
</script>

<Tile variant="contained">
    <div class="flex flex-row gap-4 items-center">
        <img class="dapp-image" src={metadata?.icons?.[0]} alt={metadata?.name} />
        <div class="flex flex-col">
            <Text type="body1" fontWeight="bold">
                {metadata?.name}
            </Text>
            <Link text={metadata?.url} />
        </div>
    </div>
</Tile>

<style lang="scss">
    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>
