<script lang="ts">
    import { Pane } from '@ui'
    import { Avatar, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { truncateString } from '@core/utils'
    import { darkMode } from '@core/app/stores'
    import { ITideLeaderboardItem } from '@core/tide/interfaces'
    import { getSubjectFromAddress } from '@core/wallet'
    import { NetworkId } from '@core/network'

    export let leaderboardItems: ITideLeaderboardItem[]
    export let userAddress: string = ''
    export let networkId: NetworkId

    const top3Colors = {
        0: '#CA9A04',
        1: '#6F778A',
        2: '#9E440E',
    }
</script>

<Pane classes="flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark">
    {#each leaderboardItems as leaderboardItem, index}
        {@const user = getSubjectFromAddress(leaderboardItem.address, networkId)}
        <div
            class="w-full flex justify-between items-center gap-16 py-3 px-5 {userAddress?.toLowerCase() ===
            leaderboardItem.address?.toLowerCase()
                ? 'bg-surface-2 dark:bg-surface-2-dark'
                : ''}"
        >
            <div class="flex flex-row items-center justify-start gap-2">
                {#if index <= 2}
                    <Avatar icon={IconName.Award} customTextColor={top3Colors[index]} backgroundColor="surface/00" />
                {:else}
                    <Avatar text={String(index + 1)} backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'} />
                {/if}
                <Text type="sm" fontWeight="bold">{truncateString(leaderboardItem.address, 8, 8)}</Text>
            </div>
            <div class="flex flex-row gap-2">
                <Pill color="neutral" compact>Badges: {leaderboardItem.rewardClaimed}</Pill>
                <Pill color="neutral" compact>Tasks: {leaderboardItem.taskDone}</Pill>
            </div>
            {#if user?.type === 'account'}
                <Pill color="success" compact>{user.account.name}</Pill>
            {/if}
            <Text type="body1" align="right">{leaderboardItem.totalXp} xp</Text>
        </div>
    {/each}
</Pane>
