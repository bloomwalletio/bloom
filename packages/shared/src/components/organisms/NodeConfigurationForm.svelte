<script lang="ts">
    import { OnboardingNetworkType } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { INode } from '@iota/sdk/out/types'
    import { DEFAULT_NETWORK_METADATA, EMPTY_NODE } from '@core/network/constants'
    import { IClientOptions, INodeInfoResponse } from '@core/network/interfaces'
    import { nodeInfo } from '@core/network/stores'
    import {
        checkIfOnSameNetwork,
        checkNodeUrlValidity,
        getOnboardingNetworkTypeFromNetworkId,
    } from '@core/network/utils'
    import { getNodeInfo } from '@core/profile-manager'
    import { activeProfile } from '@core/profile/stores'
    import { cleanUrl } from '@core/utils'
    import features from '@features/features'
    import { NodeAuthTab } from '@ui'
    import { Alert, Error, IOption, NumberInput, SelectInput, TextInput } from '@bloomwalletio/ui'

    interface INodeValidationOptions {
        checkNodeInfo: boolean
        checkSameNetwork: boolean
        uniqueCheck: boolean
        validateClientOptions: boolean
    }

    export let node: INode = structuredClone(EMPTY_NODE)
    export let networkType: OnboardingNetworkType | undefined = undefined
    export let coinType: string = ''
    export let isBusy = false
    export let formError = ''
    export let requiresAuth = false
    export let currentClientOptions: IClientOptions | undefined = undefined
    export let onSubmit: () => void = () => {}
    export let networkEditable: boolean = false

    const networkOptions: IOption[] = getNetworkTypeOptions()

    let auth = node?.auth

    $: networkType, (coinType = '')
    $: networkType, coinType, node.url, (formError = '')
    $: auth,
        (node = {
            url: node.url,
            auth,
        })

    function getNetworkTypeOptions(): IOption[] {
        const options = Object.values(DEFAULT_NETWORK_METADATA).map((network) => ({
            label: network?.name,
            value: getOnboardingNetworkTypeFromNetworkId(network?.id),
        }))
        options.push({
            label: localize('general.custom'),
            value: OnboardingNetworkType.Custom,
        })

        return options.filter((item) => features.onboarding?.[item.value]?.enabled)
    }

    function cleanNodeUrl(): void {
        node.url = cleanUrl(node?.url)
    }

    export async function validate(options: INodeValidationOptions): Promise<void> {
        if (networkType === OnboardingNetworkType.Custom && !coinType) {
            formError = localize('error.node.noCoinType')
            return Promise.reject({ type: 'validationError', error: formError })
        }

        const errorUrlValidity = checkNodeUrlValidity(currentClientOptions?.nodes, node.url, false)
        if (errorUrlValidity) {
            formError = localize(errorUrlValidity) ?? ''
            return Promise.reject({ type: 'validationError', error: formError })
        }

        let nodeInfoResponse: INodeInfoResponse | undefined

        if (options.checkNodeInfo) {
            try {
                nodeInfoResponse = await getNodeInfo(node.url)
                if (!nodeInfoResponse?.nodeInfo) {
                    formError = localize('error.node.invalidNode')
                    return Promise.reject({ type: 'validationError', error: formError })
                }
            } catch (err) {
                formError = localize('error.node.unabledToConnect')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }
        const networkName = nodeInfoResponse?.nodeInfo?.protocol.networkName

        if (options.checkSameNetwork) {
            const isInSameNetwork = !!$nodeInfo && $nodeInfo.protocol.networkName === networkName
            if (!isInSameNetwork) {
                formError = localize('error.node.differentNetwork')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (options.uniqueCheck) {
            if ($activeProfile?.clientOptions?.nodes?.some((_node) => _node.url === node.url)) {
                formError = localize('error.node.duplicateNodes')
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }

        if (options.validateClientOptions && currentClientOptions) {
            const errorNetworkName = checkIfOnSameNetwork(networkName, currentClientOptions.network)
            if (errorNetworkName) {
                formError = localize(errorNetworkName?.locale, errorNetworkName?.values) ?? ''
                return Promise.reject({ type: 'validationError', error: formError })
            }
        }
    }
</script>

<form id="node-configuration-form" class="w-full h-full flex-col space-y-3" on:submit|preventDefault={onSubmit}>
    {#if networkEditable}
        <SelectInput
            bind:value={networkType}
            selected={networkOptions[0]}
            label={localize('general.network')}
            options={networkOptions}
            disabled={isBusy}
            hideValue
        />
        {#if networkType === OnboardingNetworkType.Custom}
            <NumberInput bind:value={coinType} label={localize('general.coinType')} disabled={isBusy} isInteger />
        {/if}
    {/if}

    <TextInput
        bind:value={node.url}
        label={localize('popups.node.nodeAddress')}
        disabled={isBusy}
        on:change={cleanNodeUrl}
    />
    {#if requiresAuth}
        <NodeAuthTab bind:auth />
        <Alert variant="warning" text={localize('popups.node.requiresAuthentication')} />
    {/if}
    {#if formError}<Error error={formError} />{/if}
</form>
