<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NetworkId, network } from '@core/network'

    export let networkId: NetworkId | undefined
    export let error: string | undefined
    export let showLayer1: boolean = true
    export let showLayer2: boolean = true
    export let validationFunction: ((arg: string) => void) | undefined = undefined

    export function validate(): void {
        try {
            if (validationFunction && typeof validationFunction === 'function' && networkId) {
                validationFunction(networkId as string)
            }
        } catch (err) {
            error = err?.message ?? err
            throw err
        }
    }

    const layer1Metadata = $network?.getMetadata()
    const layer1Network: IOption | undefined = layer1Metadata
        ? { label: layer1Metadata.name, value: layer1Metadata.id }
        : undefined
    const networkOptions = getNetworkOptions(showLayer2)

    let selected: string | undefined = networkOptions[0]?.value
    $: networkId = selected as NetworkId

    function getNetworkOptions(showLayer2: boolean): IOption[] {
        if (!layer1Network) {
            return []
        }

        const options: IOption[] = []
        if (showLayer1) {
            options.push(layer1Network)
        }

        if (showLayer2) {
            const layer2Networks: IOption[] =
                $network?.getChains().map((chain) => {
                    const chainConfig = chain.getConfiguration()
                    return { label: chainConfig.name, value: chainConfig.id }
                }) ?? []
            options.push(...layer2Networks)
        }
        return options
    }
</script>

<SelectInput bind:error bind:value={selected} hideValue options={networkOptions} label={localize('general.network')} />
