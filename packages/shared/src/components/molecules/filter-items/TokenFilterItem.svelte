<script lang="ts">
    import { activeProfile } from '@core/profile/stores'
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { TokenFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: TokenFilterUnit
    const { baseCoin, nativeTokens } = $visibleSelectedAccountTokens[$activeProfile?.network?.id]

    const options: IOption[] = [baseCoin, ...nativeTokens].map((choice) => ({
        label: choice.metadata?.name,
        value: choice.id,
    }))
    let selected = options.find((option) => option.value === filterUnit.selected)

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        filterUnit.selected = item.value
    }
</script>

<SelectInput bind:selected {options} hideValue />
