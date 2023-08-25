<script lang="ts">
    import { ChainType, network } from '@core/network'
    import type { IDropdownItem } from '@core/utils'
    import { NetworkFilterUnit } from '@core/utils/interfaces/filter'
    import features from '@features/features'
    import { Dropdown } from '@ui'
    import { onMount } from 'svelte'

    export let filterUnit: NetworkFilterUnit

    let choices: IDropdownItem<string>[] = []
    $: value = choices?.find((choice) => choice.value === filterUnit.selected)?.value ?? ''

    onMount(buildOptions)

    function buildOptions(): void {
        if (!$network) {
            return
        }
        // L1 network, we consider layer 1 as "chain 0"
        const layer1Network = {
            label: $network.getMetadata().name,
            value: $network.getMetadata().id,
        }
        // L2 chains, ISCP only for now
        const iscpChains = features?.network?.layer2?.enabled
            ? $network.getChains().filter((chain) => chain.getConfiguration().type === ChainType.Iscp)
            : []
        const iscpChainsOptions = iscpChains.map((chain) => ({
            label: chain.getConfiguration().name,
            value: chain.getConfiguration().id,
        }))
        choices = [layer1Network, ...iscpChainsOptions]
    }

    function onSelect(item: IDropdownItem<string>): void {
        filterUnit.selected = item.value
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />
