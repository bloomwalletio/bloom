<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { IContactMetadata } from '@core/contact'
    import { localize } from '@core/i18n'

    export let contactMetadata: IContactMetadata

    const KEYS_TO_DISPLAY = ['name', 'note']

    let items: { key: string; value: string }[]
    $: items = Object.keys(contactMetadata).map((key) => ({
        key: localize(`general.${key}`),
        value: KEYS_TO_DISPLAY.includes(key) && contactMetadata[key] ? contactMetadata[key] : undefined,
    }))
</script>

<Table orientation="vertical" {items} />
