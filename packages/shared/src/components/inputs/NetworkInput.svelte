<script lang="ts">
    import { IOption, SelectInput } from '@bloom-labs/ui'
    import { activeProfile } from '@core/profile'
    import { isIscpChain } from '@core/network'
    import type { ChainConfiguration } from '@core/network'

    export let iscpChainAddress: string | undefined = undefined
    export let showLayer2: boolean = false

    const layer1Network: IOption = {
        label: $activeProfile?.network.name,
        value: '',
    }

    $: networkOptions = getNetworkOptions(showLayer2)
    $: selected = networkOptions?.find((option) => option.value === iscpChainAddress) ?? layer1Network

    function getNetworkOptions(showLayer2: boolean): IOption[] {
        let layer2Networks: IOption[] = []
        if (showLayer2) {
            layer2Networks =
                $activeProfile.network?.chainConfigurations?.map((chain) => ({
                    value: getNetworkValue(chain),
                    label: chain.name,
                })) ?? []
        }
        return [layer1Network, ...layer2Networks]
    }

    function getNetworkValue(chainConfiguration: ChainConfiguration): string | undefined {
        return isIscpChain(chainConfiguration) ? chainConfiguration?.aliasAddress : undefined
    }
</script>

<SelectInput {selected} options={networkOptions} />
