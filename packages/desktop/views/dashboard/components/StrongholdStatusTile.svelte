<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile } from '@components'
    import { activeProfile } from '@core/profile/stores'

    const { isStrongholdLocked } = $activeProfile

    const iconName = isStrongholdLocked ? IconName.Locked : IconName.Unlocked
    const iconColor = isStrongholdLocked ? 'green' : 'gray'
</script>

<StatusTile {iconName} {iconColor} />
