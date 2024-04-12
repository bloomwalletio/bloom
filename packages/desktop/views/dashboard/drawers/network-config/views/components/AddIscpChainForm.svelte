<script lang="ts">
    import { AddressType } from '@iota/sdk/out/types'
    import { localize } from '@core/i18n'
    import {
        MAX_NETWORK_NAME_LENGTH,
        EvmNetworkType,
        IIscpEvmNetworkConfiguration,
        ETHEREUM_COIN_TYPE,
        EvmNetworkId,
        NetworkNamespace,
        getNetwork,
        ChainId,
        getActiveNetworkId,
        StardustNetwork,
    } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { getNetworkHrp } from '@core/profile/actions'
    import { isValidHexAddress, isValidHttpsUrl, validateBech32Address } from '@core/utils'
    import { TextInput } from '@bloomwalletio/ui'

    export let disabled: boolean = false

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    let nameError = ''
    let aliasAddressError = ''
    let rpcEndpointError = ''
    let explorerUrlError = ''
    const chainIdError = ''

    $: disabled = !evmNetwork.name || !evmNetwork.id || !evmNetwork.aliasAddress || !evmNetwork.rpcEndpoint

    const evmNetwork: IIscpEvmNetworkConfiguration = {
        type: EvmNetworkType.Iscp,
        id: '' as EvmNetworkId,
        namespace: NetworkNamespace.Evm,
        chainId: '' as ChainId,
        name: '',
        aliasAddress: '',
        rpcEndpoint: '',
        apiEndpoint: '',
        explorerUrl: '',
        coinType: ETHEREUM_COIN_TYPE,
    }

    function validateName(): void {
        if (!evmNetwork.name) {
            nameError = localize(`${localeKey}.errors.cannotBeEmpty`)
        } else if (evmNetwork.name.length > MAX_NETWORK_NAME_LENGTH) {
            nameError = localize(`${localeKey}.errors.nameTooLong`)
        }
    }

    function validateAliasAddress(): void {
        const chains = $activeProfile.network.chainConfigurations
        let isValidBechAddress = false
        try {
            validateBech32Address(getNetworkHrp(), evmNetwork.aliasAddress, AddressType.Alias)
            isValidBechAddress = true
        } catch (error) {
            isValidBechAddress = false
        }

        if (!isValidHexAddress(evmNetwork.aliasAddress) && !isValidBechAddress) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressWrongFormat`)
        } else if (
            chains.some(
                (_chain) => _chain.type === EvmNetworkType.Iscp && _chain.aliasAddress === evmNetwork.aliasAddress
            )
        ) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressAlreadyInUse`)
        }
    }

    function validateRpcEndpoint(): void {
        if (!isValidHttpsUrl(evmNetwork.rpcEndpoint)) {
            rpcEndpointError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validateExplorerUrl(): void {
        if (evmNetwork.explorerUrl && !isValidHttpsUrl(evmNetwork.explorerUrl)) {
            explorerUrlError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validate(): void {
        validateName()
        validateAliasAddress()
        validateRpcEndpoint()
        validateExplorerUrl()
    }

    function resetErrors(): void {
        nameError = ''
        aliasAddressError = ''
        rpcEndpointError = ''
        explorerUrlError = ''
    }

    export function onSubmitClick(): void {
        resetErrors()
        validate()
        const hasError =
            !!nameError || !!aliasAddressError || !!rpcEndpointError || !!chainIdError || !!explorerUrlError
        if (hasError) {
            return
        }
        // TODO: decouple addChain() function from StardustNetwork
        const stardustNetwork = getNetwork(getActiveNetworkId()) as StardustNetwork
        stardustNetwork?.addChain(evmNetwork)
    }
</script>

<add-iscp-network class="h-full flex flex-col justify-between">
    <form id="add-network-form" class="flex flex-col gap-4 px-6" on:submit|preventDefault={onSubmitClick}>
        <TextInput bind:value={evmNetwork.name} label={localize('general.name')} error={nameError} />
        <TextInput bind:value={evmNetwork.id} label={localize(`${localeKey}.chainId`)} error={chainIdError} />
        <TextInput
            bind:value={evmNetwork.aliasAddress}
            label={localize(`${localeKey}.aliasAddress`)}
            error={aliasAddressError}
        />
        <TextInput
            bind:value={evmNetwork.rpcEndpoint}
            label={localize(`${localeKey}.rpcEndpoint`)}
            error={rpcEndpointError}
        />
        <TextInput
            bind:value={evmNetwork.explorerUrl}
            label={localize(`${localeKey}.explorerUrl`)}
            error={explorerUrlError}
        />
    </form>
</add-iscp-network>
