<script lang="ts">
    import { AddressType } from '@iota/sdk/out/types'
    import { localize } from '@core/i18n'
    import {
        MAX_CHAIN_NAME_LENGTH,
        ChainType,
        IIscpChainConfiguration,
        ETHEREUM_COIN_TYPE,
        NetworkId,
        EvmChainId,
        NetworkNamespace,
        getNetwork,
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

    $: disabled = !chain.name || !chain.id || !chain.aliasAddress || !chain.rpcEndpoint

    const chain: IIscpChainConfiguration = {
        type: ChainType.Iscp,
        id: '' as NetworkId,
        namespace: NetworkNamespace.Evm,
        chainId: '' as EvmChainId,
        name: '',
        aliasAddress: '',
        rpcEndpoint: '',
        apiEndpoint: '',
        explorerUrl: '',
        coinType: ETHEREUM_COIN_TYPE,
    }

    function validateName(): void {
        if (!chain.name) {
            nameError = localize(`${localeKey}.errors.cannotBeEmpty`)
        } else if (chain.name.length > MAX_CHAIN_NAME_LENGTH) {
            nameError = localize(`${localeKey}.errors.nameTooLong`)
        }
    }

    function validateAliasAddress(): void {
        const chains = $activeProfile.network.chainConfigurations
        let isValidBechAddress = false
        try {
            validateBech32Address(getNetworkHrp(), chain.aliasAddress, AddressType.Alias)
            isValidBechAddress = true
        } catch (error) {
            isValidBechAddress = false
        }

        if (!isValidHexAddress(chain.aliasAddress) && !isValidBechAddress) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressWrongFormat`)
        } else if (
            chains.some((_chain) => _chain.type === ChainType.Iscp && _chain.aliasAddress === chain.aliasAddress)
        ) {
            aliasAddressError = localize(`${localeKey}.errors.aliasAddressAlreadyInUse`)
        }
    }

    function validateRpcEndpoint(): void {
        if (!isValidHttpsUrl(chain.rpcEndpoint)) {
            rpcEndpointError = localize(`${localeKey}.errors.invalidUrl`)
        }
    }

    function validateExplorerUrl(): void {
        if (chain.explorerUrl && !isValidHttpsUrl(chain.explorerUrl)) {
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
        getNetwork()?.addChain(chain)
    }
</script>

<add-iscp-chain class="h-full flex flex-col justify-between">
    <form id="add-chain-form" class="flex flex-col gap-4 px-6" on:submit|preventDefault={onSubmitClick}>
        <TextInput bind:value={chain.name} label={localize('general.name')} error={nameError} />
        <TextInput bind:value={chain.id} label={localize(`${localeKey}.chainId`)} error={chainIdError} />
        <TextInput
            bind:value={chain.aliasAddress}
            label={localize(`${localeKey}.aliasAddress`)}
            error={aliasAddressError}
        />
        <TextInput
            bind:value={chain.rpcEndpoint}
            label={localize(`${localeKey}.rpcEndpoint`)}
            error={rpcEndpointError}
        />
        <TextInput
            bind:value={chain.explorerUrl}
            label={localize(`${localeKey}.explorerUrl`)}
            error={explorerUrlError}
        />
    </form>
</add-iscp-chain>
