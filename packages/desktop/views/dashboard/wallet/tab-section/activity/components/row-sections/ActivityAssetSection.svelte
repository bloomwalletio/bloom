<script lang="ts">
    import { ITokenWithBalance } from '@core/token'
    import { ExpiredActivityPill, TimelockActivityPill, NftAvatar, TokenAvatar, UnclaimedActivityPill } from '@ui'
    import { ActivityType, getActivityTileAction, getActivityTileAsset } from '@core/activity'
    import { selectedAccountTokens } from '@core/token/stores'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { selectedAccountIndex } from '@core/account/stores'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { IconName, Avatar, Text } from '@bloomwalletio/ui'
    import { darkMode } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { Activity, ActivityAsyncStatus, ActivityDirection } from '@core/activity'
    import { getTimeDifference } from '@core/utils/time'
    import { time } from '@core/app/stores'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { Nft } from '@core/nfts/interfaces'
    import { getActivityActionColor } from './getActivityActionColor'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    let nft: Nft | undefined
    $: $selectedAccountNfts,
        (nft =
            activity.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined)

    $: $time, activity, setPill()
    $: color = getActivityActionColor(activity, $darkMode)

    let pill: 'timelock' | 'unclaimed' | 'expired' | undefined = undefined
    let timeDiff: string | undefined

    function setPill(): void {
        if (!activity?.asyncData?.asyncStatus) {
            pill = undefined
            return
        }

        const { asyncStatus, expirationDate, timelockDate } = activity.asyncData

        switch (asyncStatus) {
            case ActivityAsyncStatus.Claimed: {
                pill = undefined
                break
            }
            case ActivityAsyncStatus.Timelocked: {
                if (activity.direction === ActivityDirection.Outgoing) {
                    if (expirationDate) {
                        timeDiff = getTimeDifference(expirationDate, $time)
                        pill = 'unclaimed'
                    } else {
                        pill = undefined
                    }
                } else {
                    timeDiff = getTimeDifference(timelockDate, $time)
                    pill = 'timelock'
                }
                break
            }
            case ActivityAsyncStatus.Unclaimed: {
                timeDiff = expirationDate ? getTimeDifference(expirationDate, $time) : undefined
                pill = 'unclaimed'
                break
            }
            case ActivityAsyncStatus.Expired: {
                pill = 'expired'
                break
            }
            default: {
                pill = undefined
            }
        }
    }
</script>

<div class="w-full flex flex-row justify-between">
    <div class="w-full flex flex-row gap-4 items-center">
        <div class="py-1">
            {#if token}
                <TokenAvatar {token} hideNetworkBadge size="lg" />
            {:else if activity.type === ActivityType.Nft}
                <NftAvatar {nft} size="lg" shape="square" />
            {:else if activity.type === ActivityType.SmartContract}
                <Avatar
                    icon={IconName.FileLock}
                    size="lg"
                    textColor="brand"
                    backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
                />
            {:else if activity.type === ActivityType.Alias}
                <Avatar
                    icon={IconName.Alias}
                    size="lg"
                    textColor="brand"
                    backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
                />
            {/if}
        </div>
        <div class="flex-grow flex flex-col items-start justify-between shrink-0">
            <div class="flex flex-row gap-1">
                <Text customColor={color}>{localize(getActivityTileAction(activity))}</Text>
                <Text>{getActivityTileAsset(activity, $selectedAccountIndex)}</Text>
            </div>
            <div class="flex">
                {#if pill === 'unclaimed'}
                    <UnclaimedActivityPill {timeDiff} direction={activity.direction} />
                {:else if pill === 'expired'}
                    <ExpiredActivityPill />
                {:else if pill === 'timelock'}
                    <TimelockActivityPill {timeDiff} />
                {/if}
            </div>
        </div>
    </div>
</div>
