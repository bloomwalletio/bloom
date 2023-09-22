<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { ActivityDirection } from '@core/activity/enums'
    import { NftActivity } from '@core/activity/types'
    import { getActivityTileTitle, getSubjectLocaleFromActivity } from '@core/activity/utils'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { ActivityTileContent, NftImageOrIconBox } from '@ui'

    export let activity: NftActivity

    $: isIncoming =
        activity.direction === ActivityDirection.Incoming || activity.direction === ActivityDirection.SelfTransaction
    $: action = localize(getActivityTileTitle(activity))
    $: subject = localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
        values: { account: subjectLocale },
    })
    $: formattedAsset = {
        text: nft?.name ?? '',
        color: isIncoming ? 'blue-700' : '',
        classes: 'truncate',
    }
    $: subjectLocale = getSubjectLocaleFromActivity(activity)

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <NftImageOrIconBox slot="icon" {nft} size="md" />
</ActivityTileContent>
