<script lang="ts">
    import { NetworkRecipientItem } from '@ui'
    import { INetworkRecipientSelectorOption } from '../interfaces'
    import { UiEventFunction } from '../../lib/core/utils'

    export let options: INetworkRecipientSelectorOption[]
    export let selectedIndex = -1
    export let onNetworkSelected: UiEventFunction
    export let error: boolean = false

    const reipientItems: Record<number, NetworkRecipientItem> = {}

    export function validate(): void {
        reipientItems[selectedIndex]?.validate()
    }

    function onItemClick(index: number) {
        selectedIndex = index
        onNetworkSelected && onNetworkSelected()
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if options?.length}
    <network-recipient-selector class="w-full flex flex-col space-y-4">
        {#each options as item, index}
            <NetworkRecipientItem
                error={selectedIndex === index && error}
                bind:this={reipientItems[index]}
                bind:item
                selected={index === selectedIndex}
                onChange={() => onItemClick(index)}
                onClick={() => onItemClick(index)}
            />
        {/each}
    </network-recipient-selector>
{/if}
