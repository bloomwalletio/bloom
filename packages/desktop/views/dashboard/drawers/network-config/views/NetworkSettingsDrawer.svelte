<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '..'
    import { ConfigureNodeList, LocalProofOfWork } from '../components'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.chainInformation.title')} {drawerRouter}>
    <div class="flex flex-col w-full h-full space-y-4">
        <ConfigureNodeList />
        <LocalProofOfWork />
    </div>
</DrawerTemplate>
