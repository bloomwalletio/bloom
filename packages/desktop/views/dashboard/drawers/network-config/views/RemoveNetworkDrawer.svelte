<script lang="ts">
    import { localize } from '@core/i18n'
    import { DrawerTemplate } from '@components'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.removeChain.title')} {drawerRouter}>
    <remove-network-drawer class="flex flex-col justify-between mb-6 px-6"> Remove network </remove-network-drawer>
</DrawerTemplate>
