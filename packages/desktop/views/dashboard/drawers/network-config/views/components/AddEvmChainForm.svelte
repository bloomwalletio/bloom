<script lang="ts">
    import { BlockscoutApi } from '@auxiliary/blockscout/api'
    import { Button, Text, NumberInput, TextInput } from '@bloomwalletio/ui'
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
    import { TokenStandard } from '@core/token'
    import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants'
    import { tick } from 'svelte'

    export let drawerRouter: Router<NetworkConfigRoute>

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    // Chain config
    let chainId = ''
    let name = ''
    let explorerUrl = ''
    let rpcEndpoint = ''

    let nameError = ''
    let rpcEndpointError = ''
    let chainIdError = ''
    let explorerUrlError = ''

    // Token config
    let showTokenConfig = false
    let tokenName = ''
    let unit = ''
    let decimals = 0

    let tokenNameError = ''
    let unitError = ''
    let decimalsError = ''

    $: isChainConfigValid = !!name && !!rpcEndpoint && !!explorerUrl && !!chainId
    $: isTokenConfigValid = !!tokenName && !!unit && decimals !== undefined

    $: isChainConfigValid && !showTokenConfig && void setInitialTokenConfig()
    async function setInitialTokenConfig(): Promise<void> {
        showTokenConfig = true
        const defaultToken =
            DEFAULT_BASE_TOKEN[`${NetworkNamespace.Evm}:${chainId}`] ?? DEFAULT_BASE_TOKEN[SupportedNetworkId.Ethereum]

        await tick()
        tokenName = defaultToken.name
        unit = defaultToken.unit
        decimals = defaultToken.decimals
    }

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

    function validateTokenName(): void {
        if (tokenName.length > MAX_NETWORK_NAME_LENGTH) {
            tokenNameError = localize(`${localeKey}.errors.nameTooLong`)
        }
    }

    function validateUnit(): void {
        const MAX_UNIT_NAME = 6
        if (unit.length > MAX_UNIT_NAME) {
            unitError = localize(`${localeKey}.errors.unitTooLong`)
        }
    }

    function validateDecimals(): void {
        if (decimals > MAX_SUPPORTED_DECIMALS) {
            unitError = localize(`${localeKey}.errors.decimalsTooHigh`)
        } else if (decimals < 0) {
            decimalsError = localize(`${localeKey}.errors.invalidDecimals`)
        }
    }

    async function validate(): Promise<void> {
        validateName()
        validateRpcEndpoint()
        validateChainId()
        validateExplorerUrl()
        validateTokenName()
        validateUnit()
        validateDecimals()
        await verifyRpcAndChainId()
        await verifyExplorer()
    }

    function trimInputs(): void {
        name = name.trim()
        explorerUrl = explorerUrl.trim()
        rpcEndpoint = rpcEndpoint.trim()
        chainId = chainId.trim()
        tokenName = tokenName.trim()
        unit = unit.trim()
    }

    function resetErrors(): void {
        nameError = ''
        chainIdError = ''
        rpcEndpointError = ''
        explorerUrlError = ''
        tokenNameError = ''
        unitError = ''
        decimalsError = ''
    }

    async function onSubmitClick(): Promise<void> {
        trimInputs()
        resetErrors()
        await validate()
        const hasError =
            !!nameError ||
            !!rpcEndpointError ||
            !!explorerUrlError ||
            !!chainIdError ||
            !!tokenNameError ||
            !!unitError ||
            !!decimalsError
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
            baseToken: {
                standard: TokenStandard.BaseToken,
                name: tokenName,
                unit,
                decimals,
                tickerSymbol: unit,
            },
        }

        void addNewEvmNetwork(evmNetworkConfiguration)
        drawerRouter.previous()
    }
</script>

<add-evm-network class="h-full flex flex-col justify-between p-4">
    <form id="add-network-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <Text type="body1">{localize(`${localeKey}.chainConfig`)}</Text>
        <TextInput bind:value={name} label={localize('general.name')} error={nameError} />
        <TextInput bind:value={chainId} label={localize(`${localeKey}.chainId`)} error={chainIdError} />
        <TextInput bind:value={rpcEndpoint} label={localize(`${localeKey}.rpcEndpoint`)} error={rpcEndpointError} />
        <TextInput bind:value={explorerUrl} label={localize(`${localeKey}.explorerUrl`)} error={explorerUrlError} />
        <hr />
        <Text type="body1">{localize(`${localeKey}.tokenConfig`)}</Text>
        {#if showTokenConfig}
            <TextInput bind:value={tokenName} label={localize(`${localeKey}.tokenName`)} error={tokenNameError} />
            <TextInput bind:value={unit} label={localize(`${localeKey}.unit`)} error={unitError} />
            <NumberInput bind:value={decimals} label={localize(`${localeKey}.decimals`)} error={decimalsError} />
        {:else}
            <Text type="sm" textColor="secondary" align="center" class="p-4"
                >{localize(`${localeKey}.pleaseEnterChain`)}</Text
            >
        {/if}
    </form>
    <Button
        type="submit"
        form="add-network-form"
        width="full"
        disabled={!isChainConfigValid || !isTokenConfigValid}
        text={localize('actions.addChain')}
    />
</add-evm-network>
