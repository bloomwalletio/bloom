<script lang="ts">
    import { Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { ContactAvatar } from '@ui'
    import { UiEventFunction } from '@core/utils'
    import { IContact } from '@core/contact'

    export let contact: IContact | undefined = undefined
    export let showRightArrow = true
    export let error = false
    export let onCardClick: UiEventFunction | undefined = undefined
</script>

<Tile border {error} onClick={onCardClick}>
    <div class="flex w-full justify-between gap-2 items-center">
        <ContactAvatar {contact} />
        <div class="flex w-full text-left overflow-hidden">
            <Text type="base" truncate>
                {contact.name}
            </Text>
        </div>
        {#if showRightArrow}
            <Icon name={IconName.ChevronRight} textColor="secondary" />
        {/if}
    </div>
</Tile>
