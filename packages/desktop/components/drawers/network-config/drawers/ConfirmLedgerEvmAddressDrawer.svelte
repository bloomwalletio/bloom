<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { IIscpChainConfiguration } from '@core/network/interfaces'
    import { selectedChain } from '@core/network/stores'
    import { Router } from '@core/router'
    import { DrawerRoute, NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import { Animation, Button, CopyableBox, FontWeight, Pane, Text, TextType } from '@ui'

    export let drawerRouter: Router<DrawerRoute>

    $: configuration = $selectedChain.getConfiguration() as IIscpChainConfiguration
    $: address = $selectedAccount?.evmAddresses?.[configuration.coinType]

    function onContinueClick(): void {
        $networkConfigRouter.reset()
        $networkConfigRouter.goTo(NetworkConfigRoute.ConnectedChains)
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.confirmLedgerEvmAddress.title')} {drawerRouter}>
    <confirm-ledger-evm-address-drawer class="flex flex-col justify-between w-full h-full">
        <div class="flex flex-col self-center">
            <Animation animation="ledger-prompt-confirmed-desktop" />
            {#if address}
                <Text type={TextType.h4}>
                    {localize('views.dashboard.drawers.networkConfig.confirmLedgerEvmAddress.header')}
                </Text>
                <Pane classes="mt-6">
                    <CopyableBox value={address} classes="bg-transparent w-full">
                        <div class="w-full text-left">
                            <Text fontWeight={FontWeight.medium} fontSize="13" color="gray-600">
                                {localize('general.evmAddress')}
                            </Text>
                            <Text type={TextType.pre} fontWeight={FontWeight.medium} fontSize="15" classes="break-words"
                                >{address}
                            </Text>
                        </div>
                    </CopyableBox>
                </Pane>
            {/if}
        </div>
        <Button outline disabled={!address} isBusy={!address} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </confirm-ledger-evm-address-drawer>
</DrawerTemplate>
