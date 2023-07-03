<script lang="ts">
    import { Table } from '@bloom-labs/ui'
    import { IContactMetadata } from '@core/contacts'
    import { localize } from '@core/i18n'

    export let contactMetadata: IContactMetadata

    const KEYS_TO_DISPLAY = ['name', 'note']

    let items: { key: string; value: string }[]

    $: items, setContactMetadataValues()

    function setContactMetadataValues(): void {
        items = []
        for (const key in contactMetadata) {
            if (KEYS_TO_DISPLAY.includes(key) && contactMetadata[key]) {
                items.push({ key: localize(`general.${key}`), value: contactMetadata[key] })
            }
        }
    }
</script>

<Table orientation="vertical" {items} />
