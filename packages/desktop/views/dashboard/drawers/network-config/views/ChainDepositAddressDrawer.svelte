<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { AddressBox } from '@ui'
    import { NetworkConfigRoute } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    let depositAddress = ''
    $: {
        if ($selectedChain) {
            const coinType = $selectedChain.coinType
            depositAddress = $selectedAccount.evmAddresses[coinType]
        } else {
            depositAddress = $selectedAccount.depositAddress
        }
    }
</script>

<DrawerTemplate
    title={localize(
        `views.dashboard.drawers.networkConfig.chainDepositAddress.${$selectedChain ? 'title' : 'networkTitle'}`
    )}
    {drawerRouter}
>
    {#key depositAddress}
        <div class="w-full h-full flex items-center justify-center px-6">
            <AddressBox address={depositAddress} showQr title={localize('general.myAddress')} />
        </div>
    {/key}
</DrawerTemplate>
