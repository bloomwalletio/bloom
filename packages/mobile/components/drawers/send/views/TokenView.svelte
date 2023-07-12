<script lang="ts">
    import { IAsset, newTransactionData, selectedAccountAssets, updateNewTransactionData } from '@core/wallet'

    import { AssetList } from '@components'
    import { sendRouter } from '@/routers'

    function onAssetClick(asset: IAsset) {
        updateNewTransactionData({ type: $newTransactionData.type, asset })
        $sendRouter.next()
    }
</script>

<div class="w-full overflow-y-auto flex flex-auto h-1">
    <AssetList onTokenAmountTileClick={onAssetClick} assets={$selectedAccountAssets} />
</div>
