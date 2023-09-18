<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.editChain.title')} {drawerRouter}>
    <edit-chain-drawer class="flex flex-col justify-between mb-6"> Edit chain </edit-chain-drawer>
</DrawerTemplate>
