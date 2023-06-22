<script lang="ts">
    import { AssetList } from '@components'

    import { IAsset, selectedAccountAssets } from '@core/wallet'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'

    function onTokenAmountTileClick(asset: IAsset): void {
        openDrawer(DrawerId.SelectedToken, {
            asset,
        })
    }
</script>

<AssetList assets={$selectedAccountAssets} {onTokenAmountTileClick} />
