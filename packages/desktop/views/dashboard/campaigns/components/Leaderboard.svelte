<script lang="ts">
    import { Pane } from '@ui'
    import { Avatar, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { truncateString } from '@core/utils'
    import { darkMode } from '@core/app/stores'
    import { ITideLeaderboardItem } from '@core/tide/interfaces'
    import { getSubjectFromAddress } from '@core/wallet'
    import { NetworkId } from '@core/network'
    import { EmptyListPlaceholder } from '@components'
    import { Spinner } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let leaderboardItems: ITideLeaderboardItem[]
    export let userAddress: string = ''
    export let networkId: NetworkId

    export let loading: boolean = false
    export let error: boolean = false

    const top3Colors = {
        0: '#CA9A04',
        1: '#6F778A',
        2: '#9E440E',
    }
</script>

{#if leaderboardItems?.length}
    <Pane>
        <table class="w-full h-full flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark">
            <thead class="py-3 px-5">
                <caption class="text-primary dark:text-primary-dark whitespace-nowrap"
                    >{localize('views.campaigns.details.top10')}</caption
                >
            </thead>
            <tbody class="p-0">
                {#each leaderboardItems as leaderboardItem, index}
                    {@const user = getSubjectFromAddress(leaderboardItem.address, networkId)}
                    <tr class="w-full grid items-center gap-16 py-3 px-5">
                        <td class="flex flex-row items-center justify-start gap-2">
                            {#if index <= 2}
                                <Avatar
                                    icon={IconName.Award}
                                    customTextColor={top3Colors[index]}
                                    backgroundColor="surface/00"
                                />
                            {:else if user?.type === 'account'}
                                <Avatar text={String(index + 1)} />
                            {:else}
                                <Avatar
                                    text={String(index + 1)}
                                    backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
                                />
                            {/if}
                            {#if user?.type === 'account'}
                                <Text type="sm" fontWeight="bold" textColor="brand">
                                    {truncateString(user.account.name, 14)}
                                </Text>
                            {:else}
                                <div class="flex overflow-hidden">
                                    <Text type="pre-sm" fontWeight="bold" truncate
                                        >{leaderboardItem.address.substring(
                                            0,
                                            leaderboardItem.address.length - 7
                                        )}</Text
                                    >
                                    <Text type="pre-sm" fontWeight="bold"
                                        >{leaderboardItem.address.substring(
                                            leaderboardItem.address.length - 7,
                                            leaderboardItem.address.length - 1
                                        )}</Text
                                    >
                                </div>
                            {/if}
                        </td>
                        <td>
                            <Text type="body1" align="right" class="whitespace-nowrap"
                                >{leaderboardItem.totalXp} xp</Text
                            >
                        </td>
                        <td class="flex flex-row gap-2">
                            <Pill color="neutral" compact>Badges: {leaderboardItem.rewardClaimed}</Pill>
                            <Pill color="neutral" compact>Tasks: {leaderboardItem.taskDone}</Pill>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </Pane>
{:else}
    <Pane classes="h-full flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark overflow-scroll">
        <div class="py-3 px-5">
            <Text type="body2">{localize('views.campaigns.details.top10')}</Text>
        </div>
        {#if error}
            <div class="h-full w-full flex justify-center items-center p-8">
                <EmptyListPlaceholder title="An error occurred loading the leaderboard" icon={IconName.Data} />
            </div>
        {:else if loading}
            <div class="h-full w-full flex justify-center items-center p-8">
                <Spinner textColor="primary" />
            </div>
        {:else}
            <div class="h-full w-full flex justify-center items-center p-8">
                <EmptyListPlaceholder title="No leaderboard found" icon={IconName.Data} />
            </div>
        {/if}
    </Pane>
{/if}

<style lang="postcss">
    tr {
        grid-template-columns: minmax(100px, 1fr) minmax(80px, auto) auto;
    }
</style>
