<script lang="ts">
    import { ITokenWithBalance, getUnitFromTokenMetadata } from '@core/token'
    import { truncateString } from '@core/utils'
    import { ExpiredActivityPill, TimelockActivityPill, NftAvatar, TokenAvatar, UnclaimedActivityPill } from '@ui'
    import { ActivityType } from '@core/activity'
    import { selectedAccountTokens } from '@core/token/stores'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { selectedAccountIndex } from '@core/account/stores'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import AssetInfo from '../AssetInfo.svelte'
    import { IconName, Avatar } from '@bloomwalletio/ui'
    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { Activity, ActivityAsyncStatus, ActivityDirection } from '@core/activity'
    import { getTimeDifference } from '@core/utils/time'
    import { time } from '@core/app/stores'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { INft } from '@core/nfts/interfaces'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    let nft: INft | undefined
    $: $selectedAccountNfts,
        (nft =
            activity.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined)

    let title: string | undefined, subtitle: string | undefined
    $: setTitleAndSubtitle(activity)

    function setTitleAndSubtitle(_activity: Activity): void {
        if (_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) {
            title = token.metadata.name ? truncateString(token.metadata.name, 13, 0) : truncateString(token.id, 6, 7)
            subtitle = getUnitFromTokenMetadata(token.metadata)
        } else if (_activity.type === ActivityType.Nft) {
            title = nft?.parsedMetadata?.name ? truncateString(nft.parsedMetadata.name, 13, 0) : 'NFT'
            subtitle = nft ? truncateString(nft.id, 6, 7) : ''
        } else if (_activity.type === ActivityType.Alias) {
            title = 'Alias'
            subtitle = truncateString(_activity.aliasId, 6, 7)
        } else if (_activity.type === ActivityType.Consolidation) {
            title = 'Consolidation'
            subtitle = localize('views.dashboard.activity.consolidatedOutputs', {
                amount: _activity.amountConsolidatedInputs,
            })
        } else if (_activity.type === ActivityType.Governance) {
            title = 'Governance'
            subtitle = truncateString(_activity.participation?.eventId ?? '', 6, 7)
        }
    }

    $: $time, activity, setPill()

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

<div class="flex flex-row justify-between">
    <AssetInfo {title} {subtitle}>
        {#if token}
            <TokenAvatar {token} hideNetworkBadge size="lg" />
        {:else if activity.type === ActivityType.Nft}
            <NftAvatar {nft} size="lg" shape="square" />
        {:else if activity.type === ActivityType.Alias}
            <Avatar
                icon={IconName.Alias}
                size="lg"
                textColor="brand"
                backgroundColor={$appSettings.darkMode ? 'surface-2-dark' : 'surface-2'}
            />
        {/if}
    </AssetInfo>

    {#if pill}
        <div class="flex flex-col w-1/2 items-center justify-center">
            {#if pill === 'unclaimed'}
                <UnclaimedActivityPill {timeDiff} direction={activity.direction} />
            {:else if pill === 'expired'}
                <ExpiredActivityPill />
            {:else if pill === 'timelock'}
                <TimelockActivityPill {timeDiff} />
            {/if}
        </div>
    {/if}
</div>
