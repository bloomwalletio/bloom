<script lang="ts">
    import { AddressType } from '@iota/sdk/out/types'
    import { localize } from '@core/i18n'
    import {
        addNewNetwork,
        ChainId,
        DEFAULT_BASE_TOKEN,
        ETHEREUM_COIN_TYPE,
        EvmNetworkId,
        IBaseEvmNetworkConfiguration,
        IIscChainConfiguration,
        IPureEvmNetworkConfiguration,
        MAX_NETWORK_NAME_LENGTH,
        NetworkNamespace,
        NetworkType,
        SupportedNetworkId,
    } from '@core/network'
    import { networks } from '@core/network/stores/networks.store'
    import { isValidHexAddress, isValidHttpsUrl, validateBech32Address } from '@core/utils'
    import { Button, Tabs, TextInput } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile/stores'
    import { NetworkConfigRoute } from '../../network-config-route.enum'
    import { Router } from '@core/router/classes'
    import { getNetworkHrp } from '@core/profile/actions'

    export let drawerRouter: Router<NetworkConfigRoute>
    const localeKey = 'views.dashboard.drawers.networkConfig.chain'
    const TABS = [
        { key: NetworkType.Evm, value: localize(`general.${NetworkType.Evm}`) },
        { key: NetworkType.Isc, value: localize(`general.${NetworkType.Isc}`) },
    ]
    let selectedTab = TABS[0]

    let chainId = '' as ChainId
    let name = ''
    let explorerUrl = ''
    let aliasAddress = ''
    let apiEndpoint = ''
    let rpcEndpoint = ''
    $: type = selectedTab.key

    $: submitDisabled = !name || !rpcEndpoint || !chainId

    let nameError = ''
    let rpcEndpointError = ''
    let chainIdError = ''
    let explorerUrlError = ''
    const apiEndpointError = ''
    let aliasAddressError = ''

    function validateName(): void {
        if (!name) {
            nameError = localize(`${localeKey}.errors.cannotBeEmpty`)
        } else if (name.length > MAX_NETWORK_NAME_LENGTH) {
            nameError = localize(`${localeKey}.errors.nameTooLong`)
        }
    }
    function validateChainId(): void {
        const networkId = `${NetworkNamespace.Evm}:${chainId}`
        if ($networks.some((network) => network.id === networkId)) {
            chainIdError = localize(`${localeKey}.errors.chainIdExists`)
        }
    }

    function validateRpcEndpoint(): void {
        if (!isValidHttpsUrl(rpcEndpoint)) {
            rpcEndpointError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validateExplorerUrl(): void {
        if (explorerUrl && !isValidHttpsUrl(explorerUrl)) {
            explorerUrlError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validateAliasAddress(): void {
        const chains = $activeProfile.network.chainConfigurations
        let isValidBechAddress = false
        try {
            validateBech32Address(getNetworkHrp(), aliasAddress, AddressType.Alias)
            isValidBechAddress = true
        } catch (error) {
            isValidBechAddress = false
        }

        if (!isValidHexAddress(aliasAddress) && !isValidBechAddress) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressWrongFormat`)
        } else if (chains.some(({ aliasAddress }) => aliasAddress === aliasAddress)) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressAlreadyInUse`)
        }
    }

    function validate(): void {
        validateName()
        validateRpcEndpoint()
        validateChainId()
        validateExplorerUrl()
        if (selectedTab.key === NetworkType.Isc) {
            validateAliasAddress()
        }
    }

    function trimInputs(): void {
        name = name.trim()
        explorerUrl = explorerUrl.trim()
        rpcEndpoint = rpcEndpoint.trim()
        chainId = chainId.trim() as ChainId
    }

    function resetErrors(): void {
        nameError = ''
        rpcEndpointError = ''
        aliasAddressError = ''
        explorerUrlError = ''
    }

    function onSubmitClick(): void {
        trimInputs()
        resetErrors()
        validate()
        const hasError = !!nameError || !!rpcEndpointError || !!explorerUrlError || !!chainIdError
        if (hasError) {
            return
        }

        const baseNetworkConfig: IBaseEvmNetworkConfiguration = {
            id: `${NetworkNamespace.Evm}:${chainId}` as EvmNetworkId,
            type,
            namespace: NetworkNamespace.Evm,
            chainId: chainId,
            name,
            rpcEndpoint,
            explorerUrl,
            coinType: ETHEREUM_COIN_TYPE,
            baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Ethereum], // TODO
        }

        if ($networks.some((_network) => _network.id === baseNetworkConfig.id)) {
            rpcEndpointError = localize(`${localeKey}.errors.chainIdExists`)
            return
        }
        if (type === NetworkType.Evm) {
            const evmNetworkConfig: IPureEvmNetworkConfiguration = {
                ...baseNetworkConfig,
                type: NetworkType.Evm,
            }
            addNewNetwork(evmNetworkConfig)
        } else {
            const iscNetworkConfig: IIscChainConfiguration = {
                ...baseNetworkConfig,
                type: NetworkType.Isc,
                aliasAddress,
                apiEndpoint,
            }
            addNewNetwork(iscNetworkConfig)
        }
        drawerRouter.previous()
    }
</script>

<add-evm-network class="h-full flex flex-col justify-between p-4">
    <form id="add-network-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <Tabs bind:selectedTab tabs={TABS} />
        <TextInput bind:value={name} label={localize('general.name')} error={nameError} />
        <TextInput bind:value={rpcEndpoint} label={localize(`${localeKey}.rpcEndpoint`)} error={rpcEndpointError} />
        <TextInput bind:value={chainId} label={localize(`${localeKey}.chainId`)} error={nameError} />
        <TextInput bind:value={explorerUrl} label={localize(`${localeKey}.explorerUrl`)} error={explorerUrlError} />

        {#if selectedTab.key === NetworkType.Isc}
            <TextInput
                bind:value={aliasAddress}
                label={localize(`${localeKey}.aliasAddress`)}
                error={aliasAddressError}
            />
            <TextInput bind:value={apiEndpoint} label={localize(`${localeKey}.apiEndpoint`)} error={apiEndpointError} />
        {/if}
    </form>
    <Button
        type="submit"
        form="add-network-form"
        width="full"
        disabled={submitDisabled}
        text={localize('actions.addChain')}
    />
</add-evm-network>
