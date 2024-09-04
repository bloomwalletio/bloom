<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { AddEvmChainForm } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.addChain.title')} {drawerRouter}>
    <AddEvmChainForm {drawerRouter} />
</DrawerTemplate>
