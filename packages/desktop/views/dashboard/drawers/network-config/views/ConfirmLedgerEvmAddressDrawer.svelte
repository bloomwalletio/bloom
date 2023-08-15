<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { IIscpChainConfiguration } from '@core/network/interfaces'
    import { selectedChain } from '@core/network/stores'
    import { Router } from '@core/router'
    import { Animation, CopyableBox, FontWeight, Pane, Text, TextType } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

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
    </confirm-ledger-evm-address-drawer>
    <svelte:fragment slot="footer">
        <Button
            variant="outline"
            text={localize('actions.continue')}
            disabled={!address}
            busy={!address}
            width="full"
            on:click={onContinueClick}
        />
    </svelte:fragment>
</DrawerTemplate>
