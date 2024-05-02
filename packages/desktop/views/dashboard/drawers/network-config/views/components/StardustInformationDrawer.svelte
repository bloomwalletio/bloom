<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import ConfigureNodeList from './ConfigureNodeList.svelte'
    import LocalProofOfWork from './LocalProofOfWork.svelte'
    import { IStardustNetwork } from '@core/network'
    import { NetworkConfigRoute } from '../../network-config-route.enum'

    export let drawerRouter: Router<NetworkConfigRoute>
    export let network: IStardustNetwork

    let nodesContainer: HTMLElement

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

<DrawerTemplate title={network.name} {drawerRouter}>
    <div class="flex flex-col w-full space-y-4 px-6">
        <ConfigureNodeList bind:nodesContainer />
        <LocalProofOfWork />
    </div>
    <Button
        slot="footer"
        variant="text"
        icon={IconName.Plus}
        width="full"
        text={localize('actions.addNode')}
        on:click={onAddNodeClick}
    />
</DrawerTemplate>
