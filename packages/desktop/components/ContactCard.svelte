<script lang="ts">
    import { Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { ContactAvatar } from '@ui'
    import { UiEventFunction } from '@core/utils'
    import { IContact } from '@core/contact'

    export let contact: IContact | undefined = undefined
    export let onCardClick: UiEventFunction
</script>

<Tile border onClick={onCardClick}>
    <div class="flex w-full justify-between gap-2 items-center">
        <ContactAvatar {contact} />
        <div class="flex w-full text-left overflow-hidden">
            <Text type="base" truncate>
                {contact.name}
            </Text>
        </div>
        <Icon name={IconName.ChevronRight} textColor="secondary" />
    </div>
</Tile>
