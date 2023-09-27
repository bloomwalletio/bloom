<script lang="ts">
    import { TextInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { debounce } from '@core/utils'

    export let value: string

    let searchValue = ''

    $: debounce(() => {
        value = searchValue
    })()
</script>

<TextInput bind:value={searchValue} label={localize('general.search')} />
