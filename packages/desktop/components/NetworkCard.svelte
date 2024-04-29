<script lang="ts">
    import { Button, Copyable, IconButton, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollL2BalanceForAccount } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import { ExplorerEndpoint, Network, NetworkNamespace, getDefaultExplorerUrl, setSelectedChain } from '@core/network'
    import { ProfileType } from '@core/profile'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { buildUrl, truncateString } from '@core/utils'
    import { NetworkAvatar, NetworkStatusPill } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@views/dashboard/drawers'

    export let network: Network

    let address: string | undefined
    const explorer = getDefaultExplorerUrl(network.id, ExplorerEndpoint.Address)

    $: health = network.health
    $: address = getAddressFromAccountForNetwork($selectedAccount as IAccountState, network.id)

    function onExplorerClick(): void {
        if (!explorer || !address) {
            return
        }
        const url = buildUrl({ origin: explorer.baseUrl, pathname: `${explorer.endpoint}/${address}` })
        openUrlInBrowser(url?.href)
    }

    function onCardClick(): void {
        if (network.namespace === NetworkNamespace.Stardust) {
            $networkConfigRouter.goTo(NetworkConfigRoute.NetworkSettings)
        } else {
            setSelectedChain(network)
            $networkConfigRouter.goTo(NetworkConfigRoute.ChainInformation)
        }
    }

    function onQrCodeIconClick(): void {
        if (network.namespace === NetworkNamespace.Stardust) {
            $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
        } else {
            setSelectedChain(network)
            $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
        }
    }

    async function onGenerateAddressClick(): Promise<void> {
        if (!network || network.namespace !== NetworkNamespace.Evm) {
            return
        }

        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return
        }

        try {
            setSelectedChain(network)
            await generateAndStoreEvmAddressForAccounts(
                $activeProfile.type,
                network.coinType,
                $selectedAccount as IAccountState
            )
            pollL2BalanceForAccount($activeProfile.id, $selectedAccount as IAccountState)
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
                {#if explorer?.baseUrl && address}
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
