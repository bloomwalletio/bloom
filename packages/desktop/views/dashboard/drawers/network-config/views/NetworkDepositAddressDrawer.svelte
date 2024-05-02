<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { NetworkId, selectedNetworkForNetworkDrawer } from '@core/network'
    import { Router } from '@core/router'
    import { AddressBox } from '@ui'
    import { NetworkConfigRoute } from '../'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'

    export let drawerRouter: Router<NetworkConfigRoute>

    $: depositAddress = getAddressFromAccountForNetwork(
        $selectedAccount as IAccountState,
        $selectedNetworkForNetworkDrawer?.id as NetworkId
    )
</script>

<DrawerTemplate
    title={localize(
        `views.dashboard.drawers.networkConfig.chainDepositAddress.${$selectedNetworkForNetworkDrawer ? 'title' : 'networkTitle'}`
    )}
    {drawerRouter}
>
    {#key depositAddress}
        <div class="w-full h-full flex items-center justify-center px-6">
            <AddressBox address={depositAddress} showQr title={localize('general.myAddress')} />
        </div>
    {/key}
</DrawerTemplate>
