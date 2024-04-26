<script lang="ts">
    import { EventStatus } from '@iota/sdk/out/types'
    import { Text, Popover } from '@bloomwalletio/ui'

    import { formatDate, localize } from '@core/i18n'
    import { DATE_FORMAT, milestoneToDate } from '@core/utils'
    import { getL1Network } from '@core/network/stores'

    export let milestones: Record<EventStatus, number>
    export let status: EventStatus
    export let anchor: HTMLElement
    export let placement: 'top' | 'bottom' | 'left' | 'right' = 'right'

    const currentMilestone = getL1Network().currentMilestone

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

    function getLocaleTenseKey(index: number): 'past' | 'present' | 'future' {
        if (index < eventProgress) {
            return 'past'
        }

        if (index === eventProgress) {
            return 'present'
        }

        if (index > eventProgress) {
            return 'future'
        }
    }
</script>

<Popover {anchor} {placement} showArrow event="hover" class="p-4 rounded-xl shadow-elevation-4">
    <ul class="space-y-3 text-left">
        {#each Object.keys(EventStatus) as status, index}
            {@const hasProgressed = eventProgress >= index}
            {@const currentProgress = eventProgress === index}
            <li
                class="grid grid-rows-2 relative
                before:justify-self-center before:mr-4 before:row-span-2 before:self-center
                {hasProgressed
                    ? currentProgress
                        ? 'before:text-2xl before:text-brand before:dark:text-brand-dark'
                        : 'before:text-xl before:text-brand before:dark:text-brand-dark before:ml-[1px]'
                    : 'before:text-xl before:text-secondary before:ml-[1px]'}
                {currentProgress
                    ? 'text-primary dark:text-primary-dark'
                    : hasProgressed
                      ? 'text-secondary/75'
                      : 'text-secondary'}
                "
                class:has-progressed={hasProgressed}
            >
                <Text textColor="current" fontWeight="semibold">
                    {localize(`views.governance.statusTimeline.${EventStatus[status]}.${getLocaleTenseKey(index)}`)}
                </Text>
                <Text textColor="current" fontWeight="medium">
                    {formatDate(milestoneToDate($currentMilestone, milestones[EventStatus[status]]), {
                        ...DATE_FORMAT,
                        timeZoneName: undefined,
                    })}
                </Text>
            </li>
        {/each}
    </ul>
</Popover>

<style lang="postcss">
    li {
        grid-template-columns: min-content 1fr;

        &::before {
            content: '●';
        }

        &.has-progressed:not(:first-child)::after {
            @apply border-text-brand dark:border-text-brand-dark;
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
