<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { ITideUserPosition } from '@core/tide/interfaces'
    import { Tile } from '@ui'

    export let userPosition: ITideUserPosition
</script>

<Tile classes="bg-surface-0 dark:bg-surface-0-dark border border-solid border-stroke dark:border-stroke-dark">
    <div class="w-full flex flex-row justify-between items-center p-2 gap-3 w-32">
        <div class="flex flex-row gap-3 items-center overflow-hidden">
            <div class="flex flex-col overflow-hidden">
                <Text type="body2" truncate>My Position</Text>
                <Text type="sm" textColor="secondary" truncate>
                    Ranking: {userPosition.position}
                </Text>
                <Text type="sm" textColor="secondary" truncate>
                    Points: {userPosition.xpEarned} xp
                </Text>
                <Text type="sm" textColor="secondary" truncate>
                    Tasks Complete: {userPosition.tasksDone}
                </Text>
                <Text type="sm" textColor="secondary" truncate>
                    Rewards Claimed: {userPosition.rewardClaimed}
                </Text>
            </div>
        </div>
    </div>
</Tile>
