<script lang="ts">
    import { TextInput, Icon, FontWeight } from '@ui'
    import { localize } from '@core/i18n'
    import { debounce } from '@core/utils'

    export let value: string

    let searchValue = ''

    $: debounce(() => {
        value = searchValue
    })()
</script>

<TextInput
    bind:value={searchValue}
    placeholder={localize('general.search')}
    fontSize="15"
    clearPadding
    containerClasses="py-2 px-3"
    fontWeight={FontWeight.medium}
    color="gray-500"
>
    <Icon slot="left" icon="search" classes="mr-2 text-gray-500 dark:text-white" />
</TextInput>
