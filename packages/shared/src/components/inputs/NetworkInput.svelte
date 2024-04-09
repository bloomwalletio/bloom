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

    const layer1Network: IOption | undefined = $network ? { label: $network.name, value: $network.id } : undefined
    const networkOptions = getNetworkOptions(showLayer2)

    let selected = networkOptions[0]
    $: networkId = selected?.value as NetworkId

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
                    return { label: chain.name, value: chain.id }
                }) ?? []
            options.push(...layer2Networks)
        }
        return options
    }
</script>

<SelectInput bind:error bind:selected hideValue options={networkOptions} label={localize('general.network')} />
