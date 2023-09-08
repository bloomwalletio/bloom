<script lang="ts">
    import { EventStatus } from '@iota/sdk/out/types'
    import { Icon } from '@ui'
    import { Pill } from '@bloomwalletio/ui'
    import { Icon as _Icon } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { IProposal } from '@contexts/governance/interfaces'
    import { DefaultColors } from 'tailwindcss/types/generated/colors'

    export let proposal: IProposal

    $: status = proposal?.status
    $: error = proposal?.error

    const STATUS_COLORS: Record<EventStatus, keyof DefaultColors> = {
        [EventStatus.Upcoming]: 'purple',
        [EventStatus.Commencing]: 'pink',
        [EventStatus.Holding]: 'green',
        [EventStatus.Ended]: 'blue',
    }
</script>

{#if status}
    <Pill color={STATUS_COLORS[status]}>
        <div class="flex flex-row space-x-1 items-center">
            {#if error}
                <Icon icon={error ? _Icon.StatusError : undefined} classes="text-red-700" />
            {/if}
            <div>
                {localize(`pills.governance.proposalStatus.${error ? error : status}`)}
            </div>
        </div>
    </Pill>
{/if}
