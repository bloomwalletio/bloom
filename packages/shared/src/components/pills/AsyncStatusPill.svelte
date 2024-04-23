<script lang="ts">
    import { ActivityDirection } from '@core/activity'
    import { ExpiredPill, TimelockPill, UnclaimedPill } from '.'
    export let type: 'unclaimed' | 'expired' | 'timelock'
    export let direction: ActivityDirection
    export let timeDiff: string | undefined = undefined
</script>

{#if type === 'unclaimed' && timeDiff}
    <UnclaimedPill {timeDiff} {direction} />
{:else if type === 'expired'}
    <ExpiredPill />
{:else if type === 'timelock' && timeDiff}
    <TimelockPill {timeDiff} />
{/if}
