<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { OnboardingNetworkType, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import {
        INode,
        NetworkNamespace,
        buildPersistedNetworkFromNodeInfoResponse,
        getNetworkIdFromOnboardingNetworkType,
        getNodeInfoWhileLoggedOut,
    } from '@core/network'
    import features from '@features/features'
    import { NodeConfigurationForm } from '@ui'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { networkSetupRouter } from '../network-setup-router'

    let nodeConfigurationForm: NodeConfigurationForm
    let coinType: string
    let node: INode
    let busy = false
    let formError = ''
    let networkType: OnboardingNetworkType = getInitialSelectedNetworkType()

    function getInitialSelectedNetworkType(): OnboardingNetworkType {
        return features?.onboarding?.shimmer?.enabled
            ? OnboardingNetworkType.Shimmer
            : features?.onboarding?.testnet?.enabled
            ? OnboardingNetworkType.Testnet
            : OnboardingNetworkType.Custom
    }

    function onBackClick(): void {
        $networkSetupRouter.previous()
    }

    async function onContinueClick(): Promise<void> {
        busy = true
        try {
            await nodeConfigurationForm.validate({
                uniqueCheck: false,
                checkSameNetwork: false,
                checkNodeInfo: false,
                validateClientOptions: false,
            })
            updateOnboardingProfile({ clientOptions: { nodes: [node], primaryNode: node } })

            // The API request to check if a node is reachable requires an existing account manager.
            const nodeInfoResponse = await getNodeInfoWhileLoggedOut(node.url)
            if (
                networkType !== OnboardingNetworkType.Custom &&
                getNetworkIdFromOnboardingNetworkType(networkType) !==
                    `${NetworkNamespace.Stardust}:${nodeInfoResponse?.nodeInfo?.protocol?.networkName}`
            ) {
                throw new Error('error.node.differentNetwork')
            }
            const customCoinType = networkType === OnboardingNetworkType.Custom ? Number(coinType) : undefined
            const network = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse, customCoinType)
            updateOnboardingProfile({ network })
            $networkSetupRouter.next()
        } catch (err) {
            console.error(err)
            updateOnboardingProfile({ clientOptions: undefined, network: undefined })
            if (err?.error?.includes('error sending request for url')) {
                formError = localize('error.node.unabledToConnect')
            } else if (err?.message === 'error.node.differentNetwork') {
                formError = localize('error.node.differentNetwork')
            } else if (err?.type !== 'validationError') {
                showNotification({
                    variant: 'error',
                    text: localize(err?.error ?? 'error.global.generic'),
                })
            }
        } finally {
            busy = false
        }
    }

    onMount(() => {
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ network: undefined, clientOptions: undefined })
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.networkSetup.setupCustomNetwork.title')}
    continueButton={{
        onClick: onContinueClick,
    }}
    backButton={{
        onClick: onBackClick,
    }}
    {busy}
>
    <div slot="content">
        <NodeConfigurationForm
            onSubmit={onContinueClick}
            bind:this={nodeConfigurationForm}
            bind:networkType
            bind:coinType
            bind:node
            bind:formError
            isBusy={busy}
            isDeveloperProfile
            networkEditable
        />
    </div>
</OnboardingLayout>
