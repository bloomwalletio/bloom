<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        MAX_NETWORK_NAME_LENGTH,
        NetworkType,
        ETHEREUM_COIN_TYPE,
        EvmNetworkId,
        NetworkNamespace,
        ChainId,
        IPureEvmNetworkConfiguration,
        SupportedNetworkId,
        DEFAULT_BASE_TOKEN,
        networks,
        EvmNetwork,
    } from '@core/network'
    import { isValidHttpsUrl } from '@core/utils'
    import { Button, TextInput } from '@bloomwalletio/ui'
    import { addPersistedEvmNetworkToActiveProfile } from '@core/profile/stores'
    import { NetworkConfigRoute } from '../../network-config-route.enum'
    import { Router } from '@core/router/classes'

    export let drawerRouter: Router<NetworkConfigRoute>

    const localeKey = 'views.dashboard.drawers.networkConfig.chain'

    const isBusy = false
    let nameError = ''
    let rpcEndpointError = ''
    let explorerUrlError = ''
    $: submitDisabled = !evmNetwork.name || !evmNetwork.rpcEndpoint

    const evmNetwork: IPureEvmNetworkConfiguration = {
        type: NetworkType.Evm,
        id: '' as EvmNetworkId,
        namespace: NetworkNamespace.Evm,
        chainId: '' as ChainId,
        name: '',
        rpcEndpoint: '',
        coinType: ETHEREUM_COIN_TYPE,
        baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Ethereum],
    }

    function validateName(): void {
        if (!evmNetwork.name) {
            nameError = localize(`${localeKey}.errors.cannotBeEmpty`)
        } else if (evmNetwork.name.length > MAX_NETWORK_NAME_LENGTH) {
            nameError = localize(`${localeKey}.errors.nameTooLong`)
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
        validateRpcEndpoint()
        validateExplorerUrl()
    }

    function resetErrors(): void {
        nameError = ''
        rpcEndpointError = ''
        explorerUrlError = ''
    }

    function onSubmitClick(): void {
        resetErrors()
        validate()
        const hasError = !!nameError || !!rpcEndpointError || !!explorerUrlError
        if (!hasError) {
            evmNetwork.id = `${NetworkNamespace.Evm}:${evmNetwork.chainId}`
            if ($networks.some((network) => network.id === evmNetwork.id)) {
                rpcEndpointError = localize(`${localeKey}.errors.chainIdExists`)
                return
            }
            addPersistedEvmNetworkToActiveProfile(evmNetwork)
            $networks = [...$networks, new EvmNetwork(evmNetwork)]
            drawerRouter.previous()
        }
    }
</script>

<add-evm-network class="h-full flex flex-col justify-between p-4">
    <form id="add-network-form" class="flex flex-col gap-3" on:submit|preventDefault={onSubmitClick}>
        <TextInput
            bind:value={evmNetwork.chainId}
            label={localize(`${localeKey}.chainId`)}
            disabled={isBusy}
            error={nameError}
        />
        <TextInput bind:value={evmNetwork.name} label={localize('general.name')} disabled={isBusy} error={nameError} />
        <TextInput
            bind:value={evmNetwork.rpcEndpoint}
            label={localize(`${localeKey}.rpcEndpoint`)}
            disabled={isBusy}
            error={rpcEndpointError}
        />
        <TextInput
            bind:value={evmNetwork.explorerUrl}
            label={localize(`${localeKey}.explorerUrl`)}
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
</add-evm-network>
