<script lang="ts">
    import { EventStatus } from '@iota/sdk/out/types'
    import { Text, Popover } from '@bloomwalletio/ui'

    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network'
    import { DATE_FORMAT, milestoneToDate } from '@core/utils'

    export let milestones: Record<EventStatus, number>
    export let status: EventStatus
    export let anchor: HTMLElement
    export let placement: 'top' | 'bottom' | 'left' | 'right' = 'right'

    let eventProgress: number
    switch (status) {
        case EventStatus.Upcoming:
            eventProgress = 0
            break
        case EventStatus.Commencing:
            eventProgress = 1
            break
        case EventStatus.Holding:
            eventProgress = 2
            break
        case EventStatus.Ended:
            eventProgress = 3
            break
        default:
            break
    }
</script>

<Popover {anchor} {placement} showArrow event="hover" class="p-4 rounded-xl shadow-elevation-4">
    <ul class="space-y-3 text-left">
        {#each Object.keys(EventStatus) as status, index}
            {@const hasProgressed = eventProgress >= index}
            <li
                class="grid grid-rows-2 relative
                before:justify-self-end before:mr-4 before:row-span-2 before:self-center
                {hasProgressed
                    ? 'before:text-2xl before:text-brand before:dark:text-brand-dark'
                    : 'before:text-xl before:text-secondary before:ml-[1px]'}
                "
            >
                <Text textColor={!hasProgressed ? 'secondary' : 'primary'} fontWeight="medium">
                    {formatDate(
                        milestoneToDate($networkStatus.currentMilestone, milestones[EventStatus[status]]),
                        DATE_FORMAT
                    )}
                </Text>
                <Text textColor={!hasProgressed ? 'secondary' : 'primary'} fontWeight="medium">
                    {localize(`views.governance.statusTimeline.${EventStatus[status]}`)}
                </Text>
            </li>
        {/each}
    </ul>
</Popover>

<style lang="scss">
    li {
        grid-template-columns: min-content 1fr;

        &::before {
            content: '●';
        }

        &:not(:first-child)::after {
            @apply absolute block border-r border-text-secondary dark:border-text-secondary-dark border-solid bottom-4;
            content: '';
            height: 130%;
            left: 0.415em;
            z-index: -1;
        }
    }
</style>
