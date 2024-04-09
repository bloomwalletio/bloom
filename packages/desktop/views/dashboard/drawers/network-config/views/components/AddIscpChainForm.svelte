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
    import { Button } from '@bloomwalletio/ui'
    import { Input } from '@ui'

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    const isBusy = false
    let nameError = ''
    let aliasAddressError = ''
    let rpcEndpointError = ''
    let explorerUrlError = ''
    const chainIdError = ''
    $: submitDisabled = !chain.name || !chain.id || !chain.aliasAddress || !chain.rpcEndpoint

    const chain: IIscpChainConfiguration = {
        type: ChainType.Iscp,
        id: '' as NetworkId,
        namespace: NetworkNamespace.Evm,
        chainId: '' as EvmChainId,
        name: '',
        aliasAddress: '',
        rpcEndpoint: '',
        apiEndpoint: '',
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

    function onSubmitClick(): void {
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
    <form id="add-chain-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <Input bind:value={chain.name} placeholder={localize('general.name')} disabled={isBusy} error={nameError} />
        <Input
            bind:value={chain.id}
            placeholder={localize(`${localeKey}.chainId`)}
            disabled={isBusy}
            error={chainIdError}
        />
        <Input
            bind:value={chain.aliasAddress}
            placeholder={localize(`${localeKey}.aliasAddress`)}
            disabled={isBusy}
            error={aliasAddressError}
        />
        <Input
            bind:value={chain.rpcEndpoint}
            placeholder={localize(`${localeKey}.rpcEndpoint`)}
            disabled={isBusy}
            error={rpcEndpointError}
        />
        <Input
            bind:value={chain.explorerUrl}
            placeholder={localize(`${localeKey}.explorerUrl`)}
            disabled={isBusy}
            error={explorerUrlError}
        />
    </form>
    <Button
        type="submit"
        form="add-chain-form"
        width="full"
        disabled={submitDisabled || isBusy}
        busy={isBusy}
        text={localize('actions.addChain')}
    />
</add-iscp-chain>
