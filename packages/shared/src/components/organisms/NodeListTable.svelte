<script lang="ts">
    import { localize } from '@core/i18n'
    import { INode, getDefaultNodes, isSupportedNetworkId } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { NodeActionsButton, Text } from '@ui'
    import { Pill } from '@bloomwalletio/ui'
    import { PopupId, openPopup } from '../../../../desktop/lib/auxiliary/popup'

    export let nodesContainer: HTMLElement | undefined = undefined

    $: clientOptions = $activeProfile?.clientOptions

    function isPrimary(node: INode): boolean {
        return node.url === clientOptions?.primaryNode?.url
    }

    function onViewNodeInfoClick(node: INode): void {
        openPopup({
            id: PopupId.NodeInfo,
            props: {
                node,
            },
        })
    }
</script>

<div
    class="max-h-80 flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
    bind:this={nodesContainer}
>
    {#if clientOptions?.nodes && clientOptions.nodes.length < 1 && !isSupportedNetworkId($activeProfile?.network?.id)}
        <Text classes="p-3">
            {localize('views.settings.configureNodeList.noNodes')}
        </Text>
    {:else}
        {@const nodes =
            clientOptions?.nodes && clientOptions?.nodes?.length > 0
                ? clientOptions?.nodes
                : getDefaultNodes($activeProfile?.network?.id)}
        {#each nodes as node}
            <button
                class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                on:click={() => onViewNodeInfoClick(node)}
            >
                <div class="flex flex-row items-center space-x-4 overflow-hidden">
                    <Text classes={'self-start overflow-hidden whitespace-nowrap text-ellipsis'}>
                        {node.url}
                    </Text>
                    {#if isPrimary(node)}
                        <Pill color="blue">
                            {localize('views.settings.configureNodeList.primaryNode').toLowerCase()}
                        </Pill>
                    {/if}
                    {#if node?.disabled}
                        <Pill color="red">
                            {localize('general.excluded').toLowerCase()}
                        </Pill>
                    {/if}
                </div>
                <NodeActionsButton {node} {clientOptions} />
            </button>
        {/each}
    {/if}
</div>
