<script lang="ts">
    import { NodeListTable } from '@components'
    import { Button } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { addDefaultNodesToClientOptions, isSupportedNetworkId } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { NetworkSettingsRoute } from '@core/router'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
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
        {#if isSupportedNetworkId(networkId)}
            <Button
                variant="outline"
                width="half"
                on:click={addDefaultNodesToClientOptions}
                text={localize('actions.addOfficialNodes')}
            />
        {/if}
        <Button
            width={!isSupportedNetworkId(networkId) ? 'auto' : 'half'}
            on:click={onAddNodeClick}
            text={localize('actions.addNode')}
        />
    </div>
</SettingsSection>
