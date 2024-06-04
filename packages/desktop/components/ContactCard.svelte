<script lang="ts">
    import { Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { ContactAvatar } from '@ui'
    import { UiEventFunction } from '@core/utils'
    import { IContact } from '@core/contact'

    export let contact: IContact | undefined = undefined
    export let error = false
    export let onCardClick: UiEventFunction | undefined = undefined

    let showBreadcrumb = false

    function toggleShowBreadcrumb(): void {
        showBreadcrumb = !showBreadcrumb
    }
</script>

<!-- TODO: simplify use of tile and surfaces? and support hover events for group -->
<div on:mouseenter={toggleShowBreadcrumb} on:mouseleave={toggleShowBreadcrumb} role="button" tabindex="0">
    <Tile border {error} onClick={onCardClick}>
        <div class="flex w-full justify-between gap-2 items-center p-1">
            <ContactAvatar {contact} />
            <div class="flex w-full text-left overflow-hidden">
                <Text type="base" truncate>
                    {contact?.name}
                </Text>
            </div>
            {#if showBreadcrumb}
                <Icon name={IconName.ChevronRight} textColor="secondary" />
            {/if}
        </div>
    </Tile>
</div>
