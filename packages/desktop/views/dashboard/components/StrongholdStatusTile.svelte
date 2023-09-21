<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile } from '@components'
    import { localize } from '@core/i18n'
    import { lockStronghold } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { checkOrUnlockStronghold } from '@core/stronghold'

    const { isStrongholdLocked } = $activeProfile

    const iconName = $isStrongholdLocked ? IconName.Locked : IconName.Unlocked
    const iconColor = $isStrongholdLocked ? 'green' : 'gray'

    function onStrongholdToggleClick(): void {
        if ($isStrongholdLocked) {
            checkOrUnlockStronghold()
        } else {
            lockStronghold()
        }
    }
</script>

<StatusTile
    {iconName}
    {iconColor}
    title={localize('general.stronghold')}
    subTitle={localize(`general.${$isStrongholdLocked ? 'locked' : 'unlocked'}`)}
    onClick={onStrongholdToggleClick}
    checked={$isStrongholdLocked}
/>
