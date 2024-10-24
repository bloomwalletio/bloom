<script lang="ts">
    import { notificationsManager } from '@auxiliary/wallet-connect/notifications'
    import { Button, Copyable, IconButton, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollEvmBalancesForAccount } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import { Network, NetworkNamespace, getExplorerUrl, setSelectedNetworkForNetworkDrawer } from '@core/network'
    import { ExplorerEndpoint } from '@auxiliary/explorer'
    import { ProfileType } from '@core/profile'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { truncateString } from '@core/utils'
    import { NetworkAvatar, NetworkStatusPill } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@views/dashboard/drawers'

    export let network: Network

    let address: string | undefined

    $: health = network.health
    $: address = getAddressFromAccountForNetwork($selectedAccount as IAccountState, network.id)

    function onExplorerClick(): void {
        if (!address) {
            return
        }
        const url = getExplorerUrl(network.id, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
    }

    function onCardClick(): void {
        setSelectedNetworkForNetworkDrawer(network)
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainInformation)
    }

    function onQrCodeIconClick(): void {
        if (network.namespace === NetworkNamespace.Stardust) {
            $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
        } else {
            setSelectedNetworkForNetworkDrawer(network)
            $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
        }
    }

    async function onGenerateAddressClick(): Promise<void> {
        if (!network || network.namespace !== NetworkNamespace.Evm || !$selectedAccount) {
            return
        }

        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return
        }

        try {
            setSelectedNetworkForNetworkDrawer(network)
            await generateAndStoreEvmAddressForAccounts($activeProfile.type, network.coinType, $selectedAccount)
            if ($selectedAccount.index === 0 && $activeProfile.type === ProfileType.Software) {
                try {
                    await notificationsManager.registerAccount($selectedAccount, network.id, network.coinType)
                } catch (error) {
                    console.error(error)
                }
            }
            pollEvmBalancesForAccount($activeProfile.id, $selectedAccount)
            if ($activeProfile.type === ProfileType.Ledger) {
                $networkConfigRouter.goTo(NetworkConfigRoute.ConfirmLedgerEvmAddress)
            }
        } catch (error) {
            handleError(error)
        }
    }
</script>

<Tile border onClick={onCardClick}>
    <div class="w-full flex flex-col justify-between gap-4 p-1">
        <network-header class="flex flex-row justify-between items-center gap-1">
            <div class="flex flex-row gap-2 items-center">
                <NetworkAvatar networkId={network.id} />
                <Text type="body1" truncate>{network.name}</Text>
            </div>
            <NetworkStatusPill status={$health} />
        </network-header>
        <network-address class="flex flex-row justify-between items-end gap-4">
            <div class="flex flex-col">
                <Text>{localize('general.myAddress')}</Text>
                {#if address}
                    <Copyable value={address}>
                        <Text type="pre-md" textColor="secondary" fontWeight="medium">
                            {truncateString(address, 9, 9)}
                        </Text>
                    </Copyable>
                {:else}
                    <Button
                        variant="text"
                        size="sm"
                        text={localize('actions.generateAddress')}
                        on:click={onGenerateAddressClick}
                    />
                {/if}
            </div>
            <div class="flex flex-row space-x-1">
                {#if network.explorer && address}
                    <IconButton
                        size="sm"
                        icon={IconName.Globe}
                        tooltip={localize('general.viewOnExplorer')}
                        on:click={onExplorerClick}
                    />
                {/if}
                {#if address}
                    <IconButton
                        size="sm"
                        icon={IconName.QrCode}
                        tooltip={localize('general.viewQrCode')}
                        on:click={onQrCodeIconClick}
                    />
                {/if}
            </div>
        </network-address>
    </div>
</Tile>
