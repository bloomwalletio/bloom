<script lang="ts">
    import { Button, CopyableButton, IconName } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { generateAndStoreEvmAddressForAccount } from '@core/layer-2'
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
    import { ClickableTile, FontWeight, NetworkAvatar, NetworkStatusPill, Text, TextType } from '@ui'
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
                    await generateAndStoreEvmAddressForAccount(
                        $activeProfile.type,
                        $selectedAccount,
                        configuration.coinType
                    )
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

<ClickableTile classes="bg-white border border-solid border-gray-200 dark:border-transparent" onClick={onCardClick}>
    <div class="w-full flex flex-col gap-5">
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row gap-2 items-center">
                {#if networkId}
                    <NetworkAvatar {networkId} />
                {/if}
                <Text type={TextType.h4} fontWeight={FontWeight.semibold}>
                    {name}
                </Text>
            </div>
            {#key status}
                <NetworkStatusPill {status} />
            {/key}
        </div>
        <div class="flex flex-row justify-between items-end">
            <div class="flex flex-col">
                <Text type={TextType.p} fontWeight={FontWeight.medium} color="gray-600">
                    {localize('general.myAddress')}
                </Text>
                {#if address}
                    <CopyableButton value={address}>
                        <Text type={TextType.pre} fontSize="16" fontWeight={FontWeight.medium}>
                            {truncateString(address, 8, 8)}
                        </Text>
                    </CopyableButton>
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
                <Button variant="text" icon={IconName.QrCode} on:click={onQrCodeIconClick} />
            {/if}
        </div>
    </div>
</ClickableTile>
