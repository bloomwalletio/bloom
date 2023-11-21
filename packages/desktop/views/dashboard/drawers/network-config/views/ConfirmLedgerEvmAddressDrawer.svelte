<script lang="ts">
    import { Button, Table, Text } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { network, selectedChain } from '@core/network/stores'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, networkConfigRouter } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    $: chain = $selectedChain ?? $network.getChains()[0]
    $: address = $selectedAccount?.evmAddresses?.[chain.getConfiguration()?.coinType]

    function onContinueClick(): void {
        $networkConfigRouter.reset()
        $networkConfigRouter.goTo(NetworkConfigRoute.ConnectedChains)
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.confirmLedgerEvmAddress.title')} {drawerRouter}>
    <confirm-ledger-evm-address-drawer class="flex flex-col justify-between w-full h-full px-6">
        <div class="flex flex-col gap-4">
            {#if address}
                <Text type="body2" textColor="secondary">
                    {localize('views.dashboard.drawers.networkConfig.confirmLedgerEvmAddress.header')}
                </Text>
                <Table
                    orientation="vertical"
                    items={[
                        {
                            key: localize('general.evmAddress'),
                            value: address,
                            copyable: true,
                        },
                    ]}
                />
            {/if}
        </div>
    </confirm-ledger-evm-address-drawer>
    <svelte:fragment slot="footer">
        <Button
            text={localize('actions.continue')}
            disabled={!address}
            busy={!address}
            width="full"
            on:click={onContinueClick}
        />
    </svelte:fragment>
</DrawerTemplate>
