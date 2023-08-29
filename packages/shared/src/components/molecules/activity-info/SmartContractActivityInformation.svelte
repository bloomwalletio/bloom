<script lang="ts">
    import { type IItem, Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { TransactionActivity } from '@core/activity'
    import { Layer2Metadata } from '@core/layer-2'

    export let activity: TransactionActivity

    let items: IItem[] = []

    $: setItems(activity?.parsedLayer2Metadata ?? ({} as Layer2Metadata))

    function setItems(metadata: Layer2Metadata): void {
        items = []
        if (metadata.targetContract) {
            items.push({
                key: localize('general.targetContract'),
                value: metadata.targetContract,
                copyable: true,
            })
        }
        if (metadata.contractFunction) {
            items.push({
                key: localize('general.contractFunction'),
                value: metadata.contractFunction,
                copyable: true,
            })
        }
    }
</script>

<Table {items} />
