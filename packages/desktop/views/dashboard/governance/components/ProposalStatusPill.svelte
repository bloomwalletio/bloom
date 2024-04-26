<script lang="ts">
    import { EventStatus } from '@iota/sdk/out/types'
    import { COLOR_PALETTE, Icon, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { IProposalWithStatus } from '@contexts/governance/interfaces'

    export let proposal: IProposalWithStatus

    $: status = proposal?.status
    $: error = proposal?.error

    const STATUS_COLORS: Record<EventStatus, keyof typeof COLOR_PALETTE> = {
        [EventStatus.Upcoming]: 'yellow',
        [EventStatus.Commencing]: 'blue',
        [EventStatus.Holding]: 'teal',
        [EventStatus.Ended]: 'neutral',
    }
</script>

{#if status}
    <Pill color={error ? 'danger' : STATUS_COLORS[status]}>
        <div class="flex flex-row space-x-1 items-center">
            {#if error}
                <Icon name={IconName.CrossClose} textColor="danger" size="xs" />
            {/if}
            <Text textColor="current">{localize(`pills.governance.proposalStatus.${error ? error : status}`)}</Text>
        </div>
    </Pill>
{/if}
