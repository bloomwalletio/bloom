<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        GovernanceActivity,
        getActivityTileTitle,
        GovernanceAction,
        getFormattedVotingPowerFromGovernanceActivity,
    } from '@core/activity'
    import { ActivityTileContent } from '@ui'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: GovernanceActivity

    $: isVotingPowerActivity =
        activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
        activity.governanceAction === GovernanceAction.IncreaseVotingPower
    $: icon = isVotingPowerActivity ? Icon.Governance : Icon.Voted
    $: amount = isVotingPowerActivity ? getFormattedVotingPowerFromGovernanceActivity(activity) : ''
    $: action = localize(getActivityTileTitle(activity))

    $: formattedAsset = {
        text: amount,
        color: activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '' : 'blue-700',
        classes: 'shrink-0',
    }
</script>

<ActivityTileContent {icon} {action} subject={localize('general.internalTransaction')} {formattedAsset} />
