<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NetworkId, getEvmNetworks, getStardustNetwork } from '@core/network'

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

    const networkOptions = getNetworkOptions(showLayer2)

    let selected = networkOptions[0]
    $: networkId = selected?.value as NetworkId

    function getNetworkOptions(showLayer2: boolean): IOption[] {
        const options: IOption[] = []
        if (showLayer1) {
            const l1Network = getStardustNetwork()
            options.push({ label: l1Network.name, value: l1Network.id })
        }

        if (showLayer2) {
            const layer2Networks: IOption[] = getEvmNetworks().map((evmNetwork) => ({
                label: evmNetwork.name,
                value: evmNetwork.id,
            }))
            options.push(...layer2Networks)
        }
        return options
    }
</script>

<SelectInput bind:error bind:selected hideValue options={networkOptions} label={localize('general.network')} />
