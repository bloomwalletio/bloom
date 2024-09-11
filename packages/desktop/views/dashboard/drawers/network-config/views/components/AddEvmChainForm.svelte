<script lang="ts">
    import { BlockscoutApi } from '@auxiliary/blockscout/api'
    import { Button, TextInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import {
        addNewEvmNetwork,
        ChainId,
        DEFAULT_BASE_TOKEN,
        ETHEREUM_COIN_TYPE,
        IPureEvmNetworkConfiguration,
        MAX_NETWORK_NAME_LENGTH,
        NetworkNamespace,
        NetworkType,
        SupportedNetworkId,
    } from '@core/network'
    import { networks } from '@core/network/stores/networks.store'
    import { Router } from '@core/router/classes'
    import { isValidHttpsUrl } from '@core/utils'
    import { Web3 } from 'web3'
    import { NetworkConfigRoute } from '../../network-config-route.enum'

    export let drawerRouter: Router<NetworkConfigRoute>

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    let chainId = ''
    let name = ''
    let explorerUrl = ''
    let rpcEndpoint = ''

    let nameError = ''
    let rpcEndpointError = ''
    let chainIdError = ''
    let explorerUrlError = ''

    $: submitDisabled = !name || !chainId || !rpcEndpoint

    function validateName(): void {
        if (name.length > MAX_NETWORK_NAME_LENGTH) {
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
        if (!isValidHttpsUrl(explorerUrl)) {
            explorerUrlError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    async function verifyRpcAndChainId(): Promise<void> {
        try {
            const _rpcEndpoint = new URL(rpcEndpoint).href
            const provider = new Web3(_rpcEndpoint)
            const actualChainId = await provider.eth.net.getId()

            if (String(actualChainId) !== chainId) {
                chainIdError = localize(`${localeKey}.errors.notMatchingChainId`)
            }
        } catch (err) {
            // TODO: Add more specific error handling for different cases
            rpcEndpointError = localize(`${localeKey}.errors.invalidRpcEndpoint`)
        }
    }

    async function verifyExplorer(): Promise<void> {
        try {
            const blockscoutApi = new BlockscoutApi(explorerUrl)
            const backendVersion = await blockscoutApi.getBackendVersion()
            if (!backendVersion) {
                explorerUrlError = localize(`${localeKey}.errors.invalidExplorerUrl`)
            }
        } catch (err) {
            // TODO: Add more specific error handling for different cases
            explorerUrlError = localize(`${localeKey}.errors.invalidExplorerUrl`)
        }
    }

    async function validate(): Promise<void> {
        validateName()
        validateRpcEndpoint()
        validateChainId()
        validateExplorerUrl()
        await verifyRpcAndChainId()
        await verifyExplorer()
    }

    function trimInputs(): void {
        name = name.trim()
        explorerUrl = explorerUrl.trim()
        rpcEndpoint = rpcEndpoint.trim()
        chainId = chainId.trim()
    }

    function resetErrors(): void {
        nameError = ''
        chainIdError = ''
        rpcEndpointError = ''
        explorerUrlError = ''
    }

    async function onSubmitClick(): Promise<void> {
        trimInputs()
        resetErrors()
        await validate()
        const hasError = !!nameError || !!rpcEndpointError || !!explorerUrlError || !!chainIdError
        if (hasError) {
            return
        }

        const evmNetworkConfiguration: IPureEvmNetworkConfiguration = {
            type: NetworkType.Evm,
            id: `${NetworkNamespace.Evm}:${chainId}`,
            namespace: NetworkNamespace.Evm,
            chainId: chainId as ChainId,
            name,
            rpcEndpoint,
            explorerUrl,
            coinType: ETHEREUM_COIN_TYPE,
            baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Ethereum],
        }

        void addNewEvmNetwork(evmNetworkConfiguration)
        drawerRouter.previous()
    }
</script>

<add-evm-network class="h-full flex flex-col justify-between p-4">
    <form id="add-network-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <TextInput bind:value={name} label={localize('general.name')} error={nameError} />
        <TextInput bind:value={chainId} label={localize(`${localeKey}.chainId`)} error={chainIdError} />
        <TextInput bind:value={rpcEndpoint} label={localize(`${localeKey}.rpcEndpoint`)} error={rpcEndpointError} />
        <TextInput bind:value={explorerUrl} label={localize(`${localeKey}.explorer`)} error={explorerUrlError} />
    </form>
    <Button
        type="submit"
        form="add-network-form"
        width="full"
        disabled={submitDisabled}
        text={localize('actions.addChain')}
    />
</add-evm-network>
