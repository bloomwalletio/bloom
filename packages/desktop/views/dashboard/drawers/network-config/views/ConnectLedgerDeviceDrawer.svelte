<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { Animation, FontWeight, Icon, Pane, Text, TextType } from '@ui'
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import {
        LedgerAppName,
        LedgerConnectionState,
        determineLedgerConnectionState,
        ledgerDeviceState,
    } from '@core/ledger'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, networkConfigRouter } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    const LOCALE_BASE_PATH = 'views.dashboard.drawers.networkConfig.connectLedgerDevice'

    $: ledgerConnectionState = determineLedgerConnectionState($ledgerDeviceState, LedgerAppName.Ethereum)
    $: isConnectedAndUnlocked =
        ledgerConnectionState !== LedgerConnectionState.NotConnected &&
        ledgerConnectionState !== LedgerConnectionState.Locked
    $: isAppOpen = ledgerConnectionState === LedgerConnectionState.CorrectAppOpen

    $: requirements = [
        [isConnectedAndUnlocked, 'connect'],
        [isAppOpen, 'openApp'],
    ]

    $: if (isAppOpen) {
        setTimeout(() => {
            $networkConfigRouter.goTo(NetworkConfigRoute.ConfirmLedgerEvmAddress)
        }, 1000)
    }

    function onCancelClick(): void {
        $networkConfigRouter.previous()
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.connectLedgerDevice.title')} {drawerRouter}>
    <connect-ledger-device-drawer class="flex flex-col justify-between w-full h-full">
        <div class="mx-2 flex flex-col self-center">
            <Animation animation="ledger-disconnected-desktop" />
            <Text type={TextType.h4}>{localize(`${LOCALE_BASE_PATH}.header`)}</Text>
            <Text secondary type={TextType.p} classes="my-6">{localize(`${LOCALE_BASE_PATH}.body`)}</Text>
            <Pane>
                {#each requirements as [bool, locale], idx}
                    <div class="flex flex-row items-center space-x-2 p-4">
                        <Icon
                            icon={`status-${bool ? 'success' : 'error'}`}
                            classes={`text-white bg-${bool ? 'green' : 'red'}-600 rounded-full`}
                        />
                        <Text type="p" fontWeight={FontWeight.semibold}
                            >{localize(`${LOCALE_BASE_PATH}.requirements.${locale}`)}</Text
                        >
                    </div>
                    {#if idx < requirements.length - 1}
                        <hr />
                    {/if}
                {/each}
            </Pane>
        </div>
    </connect-ledger-device-drawer>
    <svelte:fragment slot="footer">
        <Button variant="outline" text={localize('actions.cancel')} width="full" on:click={onCancelClick} />
    </svelte:fragment>
</DrawerTemplate>
