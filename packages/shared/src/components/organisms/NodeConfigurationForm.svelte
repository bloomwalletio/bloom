<script lang="ts">
    import { OnboardingNetworkType } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { IAuth, INode } from '@iota/sdk/out/types'
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
    import { Error, IOption, NumberInput, PasswordInput, SelectInput, TextInput } from '@bloomwalletio/ui'

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
    export let currentClientOptions: IClientOptions | undefined = undefined
    export let isDeveloperProfile: boolean = false
    export let onSubmit: () => void = () => {}
    export let networkEditable: boolean = false

    const networkOptions: IOption[] = getNetworkTypeOptions()

    let [username, password] = node.auth?.basicAuthNamePwd ?? ['', '']
    let jwt = node.auth?.jwt ?? ''

    $: networkType, (coinType = '')
    $: networkType, coinType, node.url, (formError = '')
    $: jwt,
        username,
        password,
        (node = {
            url: node.url,
            auth: getAuth(),
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

    function getAuth(): IAuth {
        const auth: IAuth = {}
        if ([username, password].every((value) => value !== '')) {
            auth.basicAuthNamePwd = [username, password]
        }
        if (jwt !== '') {
            auth.jwt = jwt
        }
        return auth
    }

    function cleanNodeUrl(): void {
        node.url = cleanUrl(node?.url)
    }

    export async function validate(options: INodeValidationOptions): Promise<void> {
        if (networkType === OnboardingNetworkType.Custom && !coinType) {
            formError = localize('error.node.noCoinType')
            return Promise.reject({ type: 'validationError', error: formError })
        }

        const errorUrlValidity = checkNodeUrlValidity(currentClientOptions?.nodes, node.url, isDeveloperProfile)
        if (errorUrlValidity) {
            formError = localize(errorUrlValidity) ?? ''
            return Promise.reject({ type: 'validationError', error: formError })
        }

        let nodeInfoResponse: INodeInfoResponse | null = null

        if (options.checkNodeInfo) {
            try {
                nodeInfoResponse = await getNodeInfo(node.url)
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
            const errorNetworkName = checkIfOnSameNetwork(networkName, currentClientOptions.network, isDeveloperProfile)
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
            label={localize('general.network')}
            options={networkOptions}
            disabled={isBusy}
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
    <TextInput bind:value={username} label={localize('popups.node.optionalUsername')} disabled={isBusy} />
    <PasswordInput
        bind:value={password}
        label={localize('popups.node.optionalPassword')}
        required={!!username}
        disabled={isBusy}
    />
    <PasswordInput bind:value={jwt} label={localize('popups.node.optionalJwt')} required={false} disabled={isBusy} />
    {#if formError}<Error error={formError} />{/if}
</form>
