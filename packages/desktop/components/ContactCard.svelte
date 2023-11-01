<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { ClickableTile, ContactAvatar } from '@ui'
    import { UiEventFunction } from '@core/utils'
    import { IContact } from '@core/contact'

    export let contact: IContact | undefined = undefined
    export let onCardClick: UiEventFunction
</script>

<ClickableTile
    classes="flex justify-between gap-2 items-center bg-white border border-solid border-gray-200 dark:border-transparent"
    onClick={onCardClick}
>
    <ContactAvatar {contact} />
    <div class="flex w-full text-left overflow-hidden">
        <Text type="base" truncate>
            {contact.name}
        </Text>
    </div>

    <Icon name={IconName.ChevronRight} textColor="secondary" />
</ClickableTile>
