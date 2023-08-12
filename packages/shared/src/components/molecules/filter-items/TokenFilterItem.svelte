<script lang="ts">
    import { activeProfile } from '@core/profile/stores'
    import type { IDropdownItem } from '@core/utils'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { TokenFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: TokenFilterUnit
    const { baseCoin, nativeTokens } = $visibleSelectedAccountTokens[$activeProfile?.network?.id]

    const choices: IDropdownItem<string>[] = [baseCoin, ...nativeTokens].map((choice) => ({
        label: choice.metadata?.name ?? '',
        value: choice.metadata?.name ?? '',
    }))

    if (!filterUnit.selected) {
        filterUnit.selected = baseCoin.id
    }

    let value: string | undefined
    $: {
        const tokenId = filterUnit.selected
        if (tokenId === baseCoin?.id) {
            value = baseCoin?.metadata.name
        } else {
            value = nativeTokens.find((_nativeToken) => _nativeToken.id === tokenId)?.metadata?.name
        }
    }

    function onSelect(item: IDropdownItem<string>): void {
        let token = undefined
        if (item.value === baseCoin.metadata.name) {
            token = baseCoin
        } else {
            token = nativeTokens.find((_nativeToken) => _nativeToken.metadata?.name === item.value)
        }
        filterUnit.selected = token?.id || ''
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />
