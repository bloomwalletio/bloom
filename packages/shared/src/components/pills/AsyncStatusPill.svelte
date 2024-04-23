<script lang="ts">
    import { ExpiredPill, TimelockPill, UnclaimedPill } from '.'

    export let type: 'unclaimed' | 'expired' | 'timelock'
    export let timeDiff: string | undefined = undefined
</script>

{#if type === 'unclaimed'}
    <UnclaimedPill {timeDiff} />
{:else if type === 'expired'}
    <ExpiredPill />
{:else if type === 'timelock' && timeDiff}
    <TimelockPill {timeDiff} />
{/if}
