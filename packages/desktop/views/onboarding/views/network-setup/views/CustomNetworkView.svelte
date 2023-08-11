<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { OnboardingLayout } from '@components'
    import {
        cleanupOnboardingProfileManager,
        initialiseProfileManagerFromOnboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { IS_MOBILE } from '@core/app'
    import { localize } from '@core/i18n'
    import { INode, NetworkName, buildPersistedNetworkFromNodeInfoResponse } from '@core/network'
    import { getNodeInfo } from '@core/profile-manager'
    import features from '@features/features'
    import { Animation, Button, HTMLButtonType, NodeConfigurationForm, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { networkSetupRouter } from '../network-setup-router'

    let nodeConfigurationForm: NodeConfigurationForm
    let networkName: NetworkName = features?.onboarding?.iota?.enabled
        ? NetworkName.Iota
        : features?.onboarding?.shimmer?.enabled
        ? NetworkName.Shimmer
        : features?.onboarding?.testnet?.enabled
        ? NetworkName.Testnet
        : NetworkName.Custom
    let coinType: string
    let node: INode
    let isBusy = false
    let formError = ''

    function onBackClick(): void {
        $networkSetupRouter.previous()
    }

    async function onContinueClick(): Promise<void> {
        isBusy = true
        try {
            await nodeConfigurationForm.validate({
                uniqueCheck: false,
                checkSameNetwork: false,
                checkNodeInfo: false,
                validateClientOptions: false,
            })
            updateOnboardingProfile({ clientOptions: { nodes: [node], primaryNode: node } })
            await initialiseProfileManagerFromOnboardingProfile(true)

            // The API request to check if a node is reachable requires an existing account manager.
            const nodeInfoResponse = await getNodeInfo(node.url)
            // Check network of node matches selected id
            if (
                networkName !== NetworkName.Custom &&
                networkName !== nodeInfoResponse?.nodeInfo?.protocol?.networkName
            ) {
                throw new Error('error.node.differentNetwork')
            }
            const customCoinType = networkName === NetworkName.Custom ? Number(coinType) : undefined
            const network = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse, customCoinType)
            updateOnboardingProfile({ network })
            await cleanupOnboardingProfileManager()
            $networkSetupRouter.next()
        } catch (err) {
            console.error(err)

            updateOnboardingProfile({ clientOptions: undefined, network: undefined })
            await cleanupOnboardingProfileManager()

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
            isBusy = false
        }
    }

    onMount(() => {
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ network: undefined, clientOptions: undefined })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.onboarding.networkSetup.setupCustomNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <NodeConfigurationForm
            onSubmit={onContinueClick}
            bind:this={nodeConfigurationForm}
            bind:networkId={networkName}
            bind:coinType
            bind:node
            bind:formError
            {isBusy}
            isDeveloperProfile
            showNetworkFields
        />
    </div>
    <div slot="leftpane__action">
        <Button
            disabled={!node?.url || isBusy}
            type={HTMLButtonType.Submit}
            form="node-configuration-form"
            classes="w-full"
            {isBusy}
            busyMessage={localize('actions.addingNode')}
        >
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!IS_MOBILE && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-custom-network-desktop" />
    </div>
</OnboardingLayout>
