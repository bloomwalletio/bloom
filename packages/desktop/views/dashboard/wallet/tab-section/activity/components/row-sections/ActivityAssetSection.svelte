<script lang="ts">
    import { Avatar, IconName, Text } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import {
        Activity,
        StardustActivityType,
        getActivityActionPill,
        getActivityActionTextColor,
        getActivityTileAction,
        getActivityTileAsset,
        isEvmTokenActivity,
    } from '@core/activity'
    import { EvmActivityType } from '@core/activity/enums/evm'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { darkMode, time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { NetworkNamespace } from '@core/network'
    import { NftStandard } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { Nft } from '@core/nfts/interfaces'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { ITokenWithBalance } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { GovernanceAvatar, NftAvatar, TokenAvatar } from '@ui'
    import AsyncStatusPill from '@ui/pills/AsyncStatusPill.svelte'
    import AssetPillsForActivity from '../AssetPillsForActivity.svelte'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    let nft: Nft | undefined
    $: $selectedAccountNfts, (nft = getNftFromActivity())
    $: showNft =
        activity.type === StardustActivityType.Nft ||
        (isEvmTokenActivity(activity) &&
            (activity.tokenTransfer.standard === NftStandard.Erc721 ||
                activity.tokenTransfer.standard === NftStandard.Irc27))

    $: color = getActivityActionTextColor(activity)
    $: pill = getActivityActionPill(activity, $time)

    function getNftFromActivity(): Nft | undefined {
        if (activity.namespace === NetworkNamespace.Evm && isEvmTokenActivity(activity)) {
            if (
                activity.tokenTransfer.standard === NftStandard.Erc721 ||
                activity.tokenTransfer.standard === NftStandard.Irc27
            ) {
                return getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.tokenTransfer.tokenId)
            }
        } else if (activity.namespace === NetworkNamespace.Stardust && activity.type === StardustActivityType.Nft) {
            return getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
        }
    }
</script>

<div class="flex flex-row gap-4 items-center overflow-hidden">
    {#if activity.type === StardustActivityType.Governance}
        <GovernanceAvatar governanceAction={activity.governanceAction} size="lg" />
    {:else if token}
        <TokenAvatar {token} hideNetworkBadge size="lg" />
    {:else if showNft}
        <NftAvatar {nft} size="lg" shape="square" />
    {:else if activity.type === EvmActivityType.ContractCall}
        <Avatar
            icon={IconName.FileCode}
            size="lg"
            textColor="primary"
            backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
        />
    {:else if activity.type === StardustActivityType.Alias}
        <Avatar
            icon={IconName.Alias}
            size="lg"
            textColor="primary"
            backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
        />
    {:else}
        <Avatar
            icon={IconName.UnknownMediaType}
            size="lg"
            textColor="primary"
            backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
        />
    {/if}
    <div class="flex flex-col items-start justify-between overflow-hidden">
        <div class="w-full flex flex-row gap-1 overflow-hidden">
            <Text textColor={color} class="shrink-0">{localize(getActivityTileAction(activity))}</Text>
            <Text truncate>{getActivityTileAsset(activity, $selectedAccountIndex)}</Text>
        </div>
        <div class="flex gap-2">
            <AssetPillsForActivity {activity} />
            {#if pill}
                <AsyncStatusPill {...pill} direction={activity.direction} />
            {/if}
        </div>
    </div>
</div>
