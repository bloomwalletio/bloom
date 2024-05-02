<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import ConfigureNodeList from './ConfigureNodeList.svelte'
    import LocalProofOfWork from './LocalProofOfWork.svelte'

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

<div class="flex flex-col w-full space-y-4">
    <ConfigureNodeList bind:nodesContainer />
    <LocalProofOfWork />
</div>
<Button variant="text" icon={IconName.Plus} width="full" text={localize('actions.addNode')} on:click={onAddNodeClick} />
