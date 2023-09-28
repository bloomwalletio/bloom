<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { IIscpChainConfiguration, selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { AddressBox } from '@ui'
    import { NetworkConfigRoute } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    const isL2Chain = !!$selectedChain
    let depositAddress = ''
    $: {
        if (isL2Chain) {
            const configuration = $selectedChain.getConfiguration() as IIscpChainConfiguration
            depositAddress = $selectedAccount.evmAddresses[configuration.coinType]
        } else {
            depositAddress = $selectedAccount.depositAddress
        }
    }
</script>

<DrawerTemplate
    title={localize(
        `views.dashboard.drawers.networkConfig.chainDepositAddress.${isL2Chain ? 'title' : 'networkTitle'}`
    )}
    {drawerRouter}
>
    {#key depositAddress}
        <div class="w-full h-full flex items-center justify-center">
            <AddressBox address={depositAddress} showQr title={localize('general.myAddress')} />
        </div>
    {/key}
</DrawerTemplate>

<style lang="scss">
    address-container {
        &:hover {
            @apply bg-blue-50;
            @apply border-gray-500;
        }
        &:active,
        &:focus {
            @apply bg-blue-100;
            @apply border-blue-400;
        }
        &.darkmode {
            @apply border-gray-700;
            &:hover,
            &:focus,
            &:active {
                @apply bg-gray-700;
                @apply bg-opacity-20;
                @apply border-opacity-50;
            }
            &:disabled {
                @apply bg-gray-700;
                @apply bg-opacity-10;
                @apply border-gray-700;
                @apply border-opacity-10;
            }
        }
    }
</style>
