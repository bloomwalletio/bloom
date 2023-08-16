<script lang="ts">
    import { ClickableTile, FontWeight, Icon, Avatar, Text, TextType } from '@ui'
    import { UiEventFunction } from '@core/utils'
    import { IContact } from '@core/contact'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let contact: IContact | undefined = undefined
    export let onCardClick: UiEventFunction
</script>

<ClickableTile
    classes="flex justify-between items-center bg-white border border-solid border-gray-200 dark:border-transparent"
    onClick={onCardClick}
>
    <div class="w-full flex flex-row items-center gap-2">
        <Avatar {contact} size="tiny" backgroundColor={contact.color} />
        <Text type={TextType.h4} fontWeight={FontWeight.semibold} classes="truncate">
            {contact.name}
        </Text>
    </div>
    <Icon icon={IconEnum.ChevronRight} classes="text-gray-400 dark:text-gray-500" />
</ClickableTile>
