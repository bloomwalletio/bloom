<script lang="ts">
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { localize } from '@core/i18n'
    import { addOfficialNodesToClientOptions as onAddOfficialNodesClick, NetworkName } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { NetworkSettingsRoute } from '@core/router'
    import { Button, ButtonSize, NodeListTable } from '@ui'
    import SettingsSection from '../SettingsSection.svelte'

    let nodesContainer: HTMLElement

    const networkId = $activeProfile?.network?.id

    function onAddNodeClick(): void {
        openPopup({
            id: PopupId.AddNode,
            props: {
                onSuccess: () => {
                    closePopup()
                    setTimeout(() => {
                        /**
                         * NOTE: This automatically scrolls the user to the bottom of the
                         * nodes container to see the newly added node.
                         */
                        nodesContainer.scrollTop = nodesContainer.scrollHeight
                    }, 100)
                },
            },
        })
    }
</script>

<SettingsSection setting={NetworkSettingsRoute.ConfigureNodeList}>
    <NodeListTable bind:nodesContainer />
    <div class="flex flex-row justify-between space-x-3 w-full mt-4">
        {#if networkId !== NetworkName.Custom}
            <Button
                outline
                size={ButtonSize.Medium}
                inlineStyle="min-width: 156px;"
                classes="w-1/2"
                onClick={onAddOfficialNodesClick}
            >
                {localize('actions.addOfficialNodes')}
            </Button>
        {/if}
        <Button
            inlineStyle="min-width: 156px;"
            size={ButtonSize.Medium}
            classes={networkId === NetworkName.Custom ? '' : 'w-1/2'}
            onClick={onAddNodeClick}
        >
            {localize('actions.addNode')}
        </Button>
    </div>
</SettingsSection>
