<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '@components'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.removeChain.title')} {drawerRouter}>
    <remove-chain-drawer class="flex flex-col justify-between mb-6"> Remove chain </remove-chain-drawer>
</DrawerTemplate>
