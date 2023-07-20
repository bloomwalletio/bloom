<script lang="ts">
    import { SelectInput } from '@bloomwalletio/ui'
    import { activeProfile } from '@core/profile'

    export let networkSelection: { networkId: string; address?: string } | undefined
    export let error: string
    export let showLayer2: boolean = false
    export let validationFunction: ((arg: string) => void) | undefined = undefined

    export function validate(): void {
        try {
            if (validationFunction && typeof validationFunction === 'function') {
                /* eslint-disable @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                validationFunction(selectedString)
            }
        } catch (err) {
            error = err?.message ?? err 
            throw err 
        }
    }

    const layer1Network = $activeProfile?.network.name
    const networkOptions = getNetworkOptions(showLayer2)

    let selectedString = layer1Network
    $: networkSelection = { networkId: selectedString }

    function getNetworkOptions(showLayer2: boolean): string[] {
        const layer2Networks: string[] = []
        if (showLayer2) {
            layer2Networks.push(...($activeProfile.network?.chainConfigurations?.map((config) => config.name) ?? []))
        }
        return [layer1Network, ...layer2Networks]
    }
</script>

<SelectInput
    bind:error
    bind:value={selectedString}
    options={networkOptions}
/>
