<script lang="ts">
    import { ClickableTile, FontWeight, Text, TextType } from '@ui'
    import { UiEventFunction } from '@core/utils'
    import { IContact } from '@core/contacts'

    export let contact: IContact = undefined
    export let onCardClick: UiEventFunction
</script>

<ClickableTile classes="bg-white border border-solid border-gray-200 dark:border-transparent" onClick={onCardClick}>
    <div class="w-full flex flex-col gap-5">
        <Text type={TextType.h4} fontWeight={FontWeight.semibold}>
            {contact.name}
        </Text>
    </div>
</ClickableTile>
