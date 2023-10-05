<script lang="ts">
    import { ITokenWithBalance, getUnitFromTokenMetadata } from '@core/token'
    import { truncateString } from '@core/utils'
    import { NftAvatar, TokenAvatar } from '@ui'
    import { Activity, ActivityType } from '@core/activity'
    import { selectedAccountTokens } from '@core/token/stores'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { selectedAccountIndex } from '@core/account/stores'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import AssetInfo from '../AssetInfo.svelte'
    import { IconName, Avatar } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { appSettings } from '@core/app/stores'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))
    $: nft =
        activity.type === ActivityType.Nft
            ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
            : undefined

    let title: string | undefined, subtitle: string | undefined
    $: setTitleAndSubtitle(activity)

    function setTitleAndSubtitle(_activity: Activity): void {
        if (_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) {
            title = token.metadata.name ? truncateString(token.metadata.name, 13, 0) : truncateString(token.id, 6, 7)
            subtitle = getUnitFromTokenMetadata(token.metadata)
        } else if (_activity.type === ActivityType.Nft) {
            title = nft.parsedMetadata?.name ? truncateString(nft.parsedMetadata?.name, 13, 0) : 'NFT'
            subtitle = truncateString(nft.id, 6, 7)
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
</script>

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
