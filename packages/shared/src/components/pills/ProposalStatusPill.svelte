<script lang="ts">
    import { EventStatus } from '@iota/sdk/out/types'
    import { Icon, Pill } from '@ui'
    import { Icon as _Icon } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { IProposal } from '@contexts/governance/interfaces'

    export let proposal: IProposal

    $: status = proposal?.status
    $: error = proposal?.error

    const STATUS_COLORS: Record<EventStatus, string> = {
        [EventStatus.Upcoming]: 'purple-200',
        [EventStatus.Commencing]: 'blue-200',
        [EventStatus.Holding]: 'green-300',
        [EventStatus.Ended]: 'gray-200',
    }
</script>

<Pill
    data={localize(`pills.governance.proposalStatus.${error ? error : status}`)}
    textColor={error ? 'red-700' : 'grey-800'}
    darkTextColor={error ? 'red-700' : 'grey-800'}
    backgroundColor={error ? 'red-200' : STATUS_COLORS[status]}
    darkBackgroundColor={error ? 'red-200' : STATUS_COLORS[status]}
    classes="rounded-full px-2 py-1 flex items-center {status ? '' : 'invisible'}"
>
    {#if error}
        <Icon icon={error ? _Icon.StatusError : undefined} classes="text-red-700" />
    {/if}
</Pill>
