<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { TokenFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: TokenFilterUnit

    const options: IOption[] = getTokenOptions()
    function getTokenOptions(): IOption[] {
        const tokens: { [key: string]: string } = {}
        for (const networkTokens of Object.values($visibleSelectedAccountTokens)) {
            if (networkTokens?.baseCoin?.metadata) {
                tokens[networkTokens.baseCoin.id] = networkTokens.baseCoin.metadata?.name
            }
            networkTokens?.nativeTokens.forEach((token) => {
                if (token.metadata) {
                    tokens[token.id] = token.metadata.name
                }
            })
        }
        return Object.entries(tokens).map(([id, name]) => ({ label: name, value: id }))
    }

    let selected = options.find((option) => option.value === filterUnit.selected)

    $: selected && onSelect(selected)
    function onSelect(item: IOption): void {
        filterUnit.selected = item.value
    }
</script>

<SelectInput bind:selected {options} hideValue />
