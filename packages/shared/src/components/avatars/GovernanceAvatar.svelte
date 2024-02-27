<script lang="ts">
    import { Avatar, IconName } from '@bloomwalletio/ui'
    import { GovernanceAction } from '@core/activity'
    import { darkMode } from '@core/app/stores'

    export let governanceAction: GovernanceAction
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' = 'md'

    const ICONS_FOR_ACTION = {
        [GovernanceAction.StartVoting]: IconName.Package,
        [GovernanceAction.StopVoting]: IconName.Package,
        [GovernanceAction.ChangedVote]: IconName.PackageCheck,
        [GovernanceAction.Revote]: IconName.PackageCheck,
        [GovernanceAction.IncreaseVotingPower]: IconName.PackagePlus,
        [GovernanceAction.DecreaseVotingPower]: IconName.PackageMinus,
    }
</script>

<Avatar
    icon={ICONS_FOR_ACTION[governanceAction]}
    {size}
    textColor="brand"
    backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
/>
