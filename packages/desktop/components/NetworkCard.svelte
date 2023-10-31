<script lang="ts">
    import { Button, Copyable, IconButton, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccounts, pollLayer2BalanceForAccount } from '@core/layer-2/actions'
    import { LedgerAppName } from '@core/ledger'
    import {
        IChain,
        IIscpChainConfiguration,
        INetwork,
        NetworkHealth,
        NetworkId,
        chainStatuses,
        networkStatus,
        setSelectedChain,
    } from '@core/network'
    import { ProfileType } from '@core/profile'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { UiEventFunction, truncateString } from '@core/utils'
    import { NetworkAvatar, NetworkStatusPill } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@views/dashboard/drawers'
    import { onMount } from 'svelte'

    export let network: INetwork = undefined
    export let chain: IChain = undefined
    export let onCardClick: UiEventFunction
    export let onQrCodeIconClick: UiEventFunction

    let configuration: IIscpChainConfiguration = undefined
    let networkId: NetworkId | undefined
    let name = ''
    let address = ''
    let status: NetworkHealth

    $: $networkStatus, $chainStatuses, $selectedAccount, setNetworkCardData()

    function setNetworkCardData(): void {
        if (network) {
            networkId = network.getMetadata().id
            name = network.getMetadata().name
            address = $selectedAccount.depositAddress
            status = $networkStatus.health
        } else if (chain) {
            configuration = chain.getConfiguration() as IIscpChainConfiguration
            networkId = configuration.id
            name = configuration.name
            address = $selectedAccount.evmAddresses[configuration.coinType]
            status = chain.getStatus().health
        }
    }

    function onGenerateAddressClick(): void {
        setSelectedChain(chain)
        if (chain) {
            checkActiveProfileAuth(
                async () => {
                    await generateAndStoreEvmAddressForAccounts(
                        $activeProfile.type,
                        configuration.coinType,
                        $selectedAccount
                    )
                    pollLayer2BalanceForAccount($selectedAccount)
                    if ($activeProfile.type === ProfileType.Ledger) {
                        $networkConfigRouter.goTo(NetworkConfigRoute.ConfirmLedgerEvmAddress)
                    }
                },
                {},
                LedgerAppName.Ethereum
            )
        }
    }

    onMount(() => {
        setNetworkCardData()
    })
</script>

<Tile border onClick={onCardClick}>
    <div class="w-full flex flex-col gap-4">
        <div class="flex flex-row justify-between items-center gap-1">
            <div class="flex flex-row gap-3 items-center">
                {#if networkId}
                    <NetworkAvatar {networkId} shape="squircle" />
                {/if}
                <Text type="body1" truncate>{name}</Text>
            </div>
            {#key status}
                <NetworkStatusPill {status} />
            {/key}
        </div>
        <div class="flex flex-row justify-between items-end space-x-1">
            <div class="flex flex-col gap-1">
                <Text>{localize('general.myAddress')}</Text>
                {#if address}
                    <Copyable value={address}>
                        <Text type="pre-lg" textColor="secondary">
                            {truncateString(address, 10, 10)}
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
            {#if address}
                <IconButton icon={IconName.QrCode} on:click={onQrCodeIconClick} />
            {/if}
        </div>
    </div>
</Tile>
