<script lang="ts">
    import { Button, Copyable, IconButton, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollL2BalanceForAccount } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import {
        ExplorerEndpoint,
        IChain,
        INetwork,
        NetworkHealth,
        NetworkId,
        chainStatuses,
        getDefaultExplorerUrl,
        networkStatus,
        setSelectedChain,
    } from '@core/network'
    import { ProfileType } from '@core/profile'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { UiEventFunction, buildUrl, truncateString } from '@core/utils'
    import { NetworkAvatar, NetworkStatusPill } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@views/dashboard/drawers'
    import { onMount } from 'svelte'

    export let network: INetwork | undefined = undefined
    export let chain: IChain | undefined = undefined
    export let onCardClick: UiEventFunction
    export let onQrCodeIconClick: UiEventFunction

    let networkId: NetworkId | undefined
    let name: string | undefined
    let address: string | undefined
    let status: NetworkHealth

    $: $networkStatus, $chainStatuses, $selectedAccount, setNetworkCardData()
    $: explorer = networkId ? getDefaultExplorerUrl(networkId, ExplorerEndpoint.Address) : undefined

    function onExplorerClick(): void {
        if (!explorer || !address) {
            return
        }
        const url = buildUrl({ origin: explorer.baseUrl, pathname: `${explorer.endpoint}/${address}` })
        openUrlInBrowser(url?.href)
    }

    function setNetworkCardData(): void {
        const account = $selectedAccount as IAccountState
        if (network) {
            networkId = network.getMetadata().id
            name = network.getMetadata().name
            address = account.depositAddress
            status = $networkStatus.health
        } else if (chain) {
            networkId = chain.id
            name = chain.name
            address = account.evmAddresses[chain.coinType]
            status = chain.getStatus().health
        }
    }

    async function onGenerateAddressClick(): Promise<void> {
        if (!chain) {
            return
        }

        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return
        }

        try {
            setSelectedChain(chain)
            await generateAndStoreEvmAddressForAccounts(
                $activeProfile.type,
                chain.coinType,
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

    onMount(() => {
        setNetworkCardData()
    })
</script>

<Tile border onClick={onCardClick}>
    <div class="w-full flex flex-col justify-between gap-4 p-1">
        <network-header class="flex flex-row justify-between items-center gap-1">
            <div class="flex flex-row gap-2 items-center">
                {#if networkId}
                    <NetworkAvatar {networkId} />
                {/if}
                <Text type="body1" truncate>{name}</Text>
            </div>
            {#key status}
                <NetworkStatusPill {status} />
            {/key}
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
