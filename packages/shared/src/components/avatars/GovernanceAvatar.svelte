<script lang="ts">
    import { Avatar, IconName } from '@bloomwalletio/ui'
    import { StardustGovernanceAction } from '@core/activity'
    import { darkMode } from '@core/app/stores'

    export let governanceAction: StardustGovernanceAction
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' = 'md'

    const ICONS_FOR_ACTION = {
        [StardustGovernanceAction.StartVoting]: IconName.Package,
        [StardustGovernanceAction.StopVoting]: IconName.Package,
        [StardustGovernanceAction.ChangedVote]: IconName.PackageCheck,
        [StardustGovernanceAction.Revote]: IconName.PackageCheck,
        [StardustGovernanceAction.IncreaseVotingPower]: IconName.PackagePlus,
        [StardustGovernanceAction.DecreaseVotingPower]: IconName.PackageMinus,
    }
</script>

<Avatar
    icon={ICONS_FOR_ACTION[governanceAction]}
    {size}
    textColor="primary"
    backgroundColor={$darkMode ? 'surface-2-dark' : 'surface-2'}
/>
