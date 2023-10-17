<script lang="ts">
    import { INode } from '@iota/sdk/out/types'
    import { showNotification } from '@auxiliary/notification'
    import { registerProposalsForAccounts } from '@contexts/governance'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { EMPTY_NODE, addNodeToClientOptions, editNodeInClientOptions } from '@core/network'
    import { activeAccounts, activeProfile } from '@core/profile/stores'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { HTMLButtonType, NodeConfigurationForm } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

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

<PopupTemplate
    title={localize(`popups.node.title${isEditingNode ? 'Update' : 'Add'}`)}
    busy={isBusy}
    backButton={{
        text: localize('actions.cancel'),
        onClick: closePopup,
    }}
    continueButton={{
        type: HTMLButtonType.Submit,
        form: 'node-configuration-form',
        text: localize(`actions.${isEditingNode ? 'updateNode' : 'addNode'}`),
        disabled: !node.url,
    }}
>
    <NodeConfigurationForm
        bind:this={nodeConfigurationForm}
        bind:node
        {onSubmit}
        {isBusy}
        isDeveloperProfile={$activeProfile.isDeveloperProfile}
    />
</PopupTemplate>
