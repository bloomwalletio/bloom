<script lang="ts">
    import { Pill, Text } from '@bloomwalletio/ui'
    import { INode } from '@iota/sdk/out/types'
    import { localize } from '@core/i18n'
    import { getDefaultNodes } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { NodeActionsMenu } from './menus'

    export let nodesContainer: HTMLElement | undefined = undefined

    $: clientOptions = $activeProfile?.clientOptions
    $: nodes =
        clientOptions?.nodes?.length ?? 0 > 0 ? clientOptions?.nodes : getDefaultNodes($activeProfile?.network?.id)

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

<node-list-table class="max-h-80 flex flex-col overflow-auto" bind:this={nodesContainer}>
    {#if nodes}
        {#each nodes as node}
            <div class="flex flex-row items-center justify-between">
                <button
                    on:click={() => onViewNodeInfoClick(node)}
                    class="flex flex-row w-full items-center space-x-4 overflow-hidden"
                >
                    <Text truncate>
                        {node.url}
                    </Text>
                    {#if isPrimary(node)}
                        <Pill color="info">
                            {localize('general.primary').toLowerCase()}
                        </Pill>
                    {/if}
                    {#if node?.disabled}
                        <Pill color="danger">
                            {localize('general.excluded').toLowerCase()}
                        </Pill>
                    {/if}
                </button>
                <NodeActionsMenu {node} {clientOptions} currentNetwork={$activeProfile?.network} />
            </div>
        {/each}
    {/if}
</node-list-table>

<style lang="postcss">
    node-list-table {
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply rounded-xl;
        @apply p-2;
    }

    button {
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;
        @apply rounded-lg;
        @apply p-2;
    }
</style>
