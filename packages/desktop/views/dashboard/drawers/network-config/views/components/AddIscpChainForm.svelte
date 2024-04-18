<script lang="ts">
    import { AddressType } from '@iota/sdk/out/types'
    import { localize } from '@core/i18n'
    import {
        MAX_NETWORK_NAME_LENGTH,
        EvmNetworkType,
        IIscNetworkConfiguration,
        ETHEREUM_COIN_TYPE,
        EvmNetworkId,
        NetworkNamespace,
        ChainId,
    } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { getNetworkHrp } from '@core/profile/actions'
    import { isValidHexAddress, isValidHttpsUrl, validateBech32Address } from '@core/utils'
    import { Button } from '@bloomwalletio/ui'
    import { Input } from '@ui'

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    const isBusy = false
    let nameError = ''
    let aliasAddressError = ''
    let rpcEndpointError = ''
    let explorerUrlError = ''
    $: submitDisabled = !evmNetwork.name || !evmNetwork.aliasAddress || !evmNetwork.rpcEndpoint

    const evmNetwork: IIscNetworkConfiguration = {
        type: EvmNetworkType.Iscp,
        id: '' as EvmNetworkId,
        namespace: NetworkNamespace.Evm,
        chainId: '' as ChainId,
        name: '',
        aliasAddress: '',
        rpcEndpoint: '',
        apiEndpoint: '',
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

    function onSubmitClick(): void {
        resetErrors()
        validate()
        const hasError = !!nameError || !!aliasAddressError || !!rpcEndpointError || !!explorerUrlError
        if (!hasError) {
            // TODO: https://github.com/iotaledger/firefly/issues/6375
        }
    }
</script>

<add-iscp-network class="h-full flex flex-col justify-between">
    <form id="add-network-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <Input
            bind:value={evmNetwork.name}
            placeholder={localize('general.name')}
            disabled={isBusy}
            error={nameError}
        />
        <Input
            bind:value={evmNetwork.aliasAddress}
            placeholder={localize(`${localeKey}.aliasAddress`)}
            disabled={isBusy}
            error={aliasAddressError}
        />
        <Input
            bind:value={evmNetwork.rpcEndpoint}
            placeholder={localize(`${localeKey}.rpcEndpoint`)}
            disabled={isBusy}
            error={rpcEndpointError}
        />
        <Input
            bind:value={evmNetwork.explorerUrl}
            placeholder={localize(`${localeKey}.explorerEndpoint`)}
            disabled={isBusy}
            error={explorerUrlError}
        />
    </form>
    <Button
        type="submit"
        form="add-network-form"
        width="full"
        disabled={submitDisabled || isBusy}
        busy={isBusy}
        text={localize('actions.addChain')}
    />
</add-iscp-network>
