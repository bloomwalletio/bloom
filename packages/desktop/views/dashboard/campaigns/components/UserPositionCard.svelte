<script lang="ts">
    import { Pill, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Nft } from '@core/nfts'
    import { ITideLeaderboardItem } from '@core/tide/interfaces'
    import { Pane } from '@ui'
    import { CampaignNft } from './'

    export let userPosition: ITideLeaderboardItem | undefined
    export let nft: Nft | undefined
    export let numberOfTasks: number | undefined

    const HEADERS_HEIGHT = 158
    let nftWidth: number
</script>

<div class="h-full overflow-hidden" style:max-height={`${nftWidth + HEADERS_HEIGHT}px`}>
    <Pane classes="flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark h-full overflow-hidden">
        <div class="flex flex-row justify-between items-center p-4 h-14">
            <Text>{localize('views.campaigns.details.myPosition')}</Text>
            {#if userPosition?.position}
                <Pill color="brand">{userPosition.position}</Pill>
            {:else}
                <Text textColor="secondary" fontWeight="medium">{userPosition?.position ?? '-'}</Text>
            {/if}
        </div>
        <div class="flex flex-row justify-between p-4">
            <Text>{localize('views.campaigns.details.points')}</Text>
            <Text textColor="secondary" fontWeight="medium">{userPosition?.totalXp ?? 0}xp</Text>
        </div>
        <div class="flex flex-row justify-between p-4">
            <Text>{localize('views.campaigns.details.tasksComplete')}</Text>
            <Text textColor="secondary" fontWeight="medium">
                {`${userPosition?.taskDone ?? '0'}/${numberOfTasks ?? '-'}`}
            </Text>
        </div>
        <div bind:clientWidth={nftWidth} class="flex w-full h-full overflow-hidden">
            <CampaignNft {nft} />
        </div>
    </Pane>
</div>
