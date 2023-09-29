<script lang="ts">
    import { Input, IconName } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { debounce } from '@core/utils'

    export let value: string

    const searchValue = ''

    $: debounce(() => {
        value = searchValue
    })()
</script>

<Input bind:value icon={IconName.Search} placeholder={localize('general.search')} />
