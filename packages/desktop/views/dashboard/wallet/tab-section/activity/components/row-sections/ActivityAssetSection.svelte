<script lang="ts">
    import { ITokenWithBalance } from '@core/token'
    import {
        ExpiredActivityPill,
        TimelockActivityPill,
        NftAvatar,
        TokenAvatar,
        UnclaimedActivityPill,
        GovernanceAvatar,
    } from '@ui'
    import {
        ActivityType,
        getActivityActionTextColor,
        getActivityActionPill,
        getActivityTileAction,
        getActivityTileAsset,
    } from '@core/activity'
    import { selectedAccountTokens } from '@core/token/stores'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { selectedAccountIndex } from '@core/account/stores'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { IconName, Avatar, Text } from '@bloomwalletio/ui'
    import { darkMode } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { Activity } from '@core/activity'
    import { time } from '@core/app/stores'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { Nft } from '@core/nfts/interfaces'
    import AssetPills from '../AssetPills.svelte'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    let nft: Nft | undefined
    $: $selectedAccountNfts,
        (nft =
            activity.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined)

    $: color = getActivityActionTextColor(activity)
    $: pill = getActivityActionPill(activity, $time)
</script>

<div class="flex flex-row gap-4 items-center overflow-hidden">
    <div class="py-1">
        {#if activity.type === ActivityType.Governance}
            <GovernanceAvatar governanceAction={activity.governanceAction} size="lg" />
        {:else if token}
            <TokenAvatar {token} hideNetworkBadge size="lg" />
        {:else if activity.type === ActivityType.Nft}
            <NftAvatar {nft} size="lg" shape="square" />
        {:else if activity.type === ActivityType.SmartContract}
            <Avatar
                icon={IconName.FileCode}
                size="lg"
                textColor="primary"
                backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
            />
        {:else if activity.type === ActivityType.Alias}
            <Avatar
                icon={IconName.Alias}
                size="lg"
                textColor="primary"
                backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
            />
        {/if}
    </div>
    <div class="flex flex-col items-start justify-between overflow-hidden">
        <div class="w-full flex flex-row gap-1 overflow-hidden">
            <Text textColor={color} class="shrink-0">{localize(getActivityTileAction(activity))}</Text>
            <Text truncate>{getActivityTileAsset(activity, $selectedAccountIndex)}</Text>
        </div>
        <div class="flex gap-2">
            <AssetPills {activity} />
            {#if pill}
                {#if pill.type === 'unclaimed'}
                    <UnclaimedActivityPill timeDiff={pill.timeDiff} direction={activity.direction} />
                {:else if pill.type === 'expired'}
                    <ExpiredActivityPill />
                {:else if pill.type === 'timelock'}
                    <TimelockActivityPill timeDiff={pill.timeDiff} />
                {/if}
            {/if}
        </div>
    </div>
</div>
