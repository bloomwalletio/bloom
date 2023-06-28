<script lang="ts">
    import { AssetList } from '@ui'
    import { selectedAccountAssets } from '@core/wallet'
</script>

<AssetList assets={$selectedAccountAssets} />
