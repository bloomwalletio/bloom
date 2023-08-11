<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { registerProposalsForAccounts } from '@contexts/governance'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { EMPTY_NODE, INode, addNodeToClientOptions, editNodeInClientOptions } from '@core/network'
    import { activeAccounts, activeProfile } from '@core/profile/stores'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Button, HTMLButtonType, NodeConfigurationForm, Text, TextType } from '@ui'

    export let node: INode = structuredClone(EMPTY_NODE)
    export let isEditingNode: boolean = false
    export let onSuccess: (..._: any[]) => void

    const currentNode = structuredClone(node)

    let nodeConfigurationForm: NodeConfigurationForm
    let isBusy = false

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            await nodeConfigurationForm.validate({
                checkSameNetwork: true,
                uniqueCheck: !isEditingNode,
                checkNodeInfo: true,
                validateClientOptions: true,
            })
            if (isEditingNode) {
                await editNodeInClientOptions(currentNode, node)
            } else {
                await addNodeToClientOptions(node)
            }

            if (Platform.isFeatureFlagEnabled('governance')) {
                await registerProposalsForAccounts({ node }, $activeAccounts)
            }

            onSuccess()
        } catch (err) {
            if (err.type !== 'validationError') {
                showNotification({
                    variant: 'error',
                    text: localize(err?.error ?? 'error.global.generic'),
                })
            }
        } finally {
            isBusy = false
        }
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h4}>{localize(`popups.node.title${isEditingNode ? 'Update' : 'Add'}`)}</Text>
    <NodeConfigurationForm
        bind:this={nodeConfigurationForm}
        bind:node
        {onSubmit}
        {isBusy}
        isDeveloperProfile={$activeProfile.isDeveloperProfile}
    />
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button outline classes="w-1/2" onClick={closePopup} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!node.url || isBusy}
            type={HTMLButtonType.Submit}
            form="node-configuration-form"
            classes="w-1/2"
            {isBusy}
            busyMessage={localize(`popups.node.${isEditingNode ? 'updatingNode' : 'addingNode'}`)}
        >
            {localize(`actions.${isEditingNode ? 'updateNode' : 'addNode'}`)}
        </Button>
    </div>
</div>
