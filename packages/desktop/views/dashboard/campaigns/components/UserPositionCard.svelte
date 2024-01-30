<script lang="ts">
    import { Avatar, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Nft } from '@core/nfts'
    import { ITideLeaderboardItem } from '@core/tide/interfaces'
    import { Pane } from '@ui'
    import { CampaignNft } from './'

    export let userPosition: ITideLeaderboardItem | undefined
    export let nft: Nft | undefined
</script>

<Pane classes="flex flex-col divide-y divide-solid divide-stroke dark:divide-stroke-dark">
    <div class="flex flex-row justify-between p-4">
        <Text>{localize('views.campaigns.details.myPosition')}</Text>
        {#if userPosition?.position}
            <Avatar text={String(userPosition?.position)} />
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
        <Text textColor="secondary" fontWeight="medium">{userPosition?.taskDone ?? '-'}</Text>
    </div>
    <div class="flex w-full h-full">
        <CampaignNft {nft} />
    </div>
</Pane>
