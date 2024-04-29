<script lang="ts">
    import { time } from '@core/app/stores'
    import { isIrc27Nft, isNftLocked } from '@core/nfts'
    import { Nft } from '@core/nfts/interfaces'
    import { getTimeDifference } from '@core/utils'
    import { TimelockPill, UnclaimedPill } from '@ui/pills'

    export let nft: Nft
</script>

{#if isIrc27Nft(nft)}
    {#if nft.timelockTime && isNftLocked(nft)}
        {@const timeLockDiff = getTimeDifference(new Date(nft.timelockTime ?? 0), $time)}
        <TimelockPill timeDiff={timeLockDiff} />
    {/if}
    {#if nft.expirationTime}
        {@const expirationTimeDiff = getTimeDifference(new Date(nft.expirationTime), $time)}
        <UnclaimedPill timeDiff={expirationTimeDiff} />
    {/if}
{/if}
