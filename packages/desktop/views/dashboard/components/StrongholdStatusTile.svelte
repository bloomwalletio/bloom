<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile, type StatusTileProps } from '@components'
    import { localize } from '@core/i18n'
    import { lockStronghold } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { checkOrUnlockStronghold } from '@core/stronghold'

    const { isStrongholdLocked } = $activeProfile

    $: statusTileProps = setStatusTileProps($isStrongholdLocked)

    function onStrongholdToggleClick(): void {
        if ($isStrongholdLocked) {
            checkOrUnlockStronghold()
        } else {
            lockStronghold()
        }
    }

    function setStatusTileProps(isStrongholdLocked: boolean): StatusTileProps {
        if (isStrongholdLocked) {
            return {
                subtitle: localize('general.locked'),
                iconName: IconName.LockedFill,
                iconColor: '#B5B8C3',
                iconBackgroundColor: '#F1EEF9',
            }
        } else {
            return {
                subtitle: localize('general.unlocked'),
                iconName: IconName.UnlockedFill,
                iconColor: 'green',
            }
        }
    }
</script>

<StatusTile
    title={localize('general.stronghold')}
    onClick={onStrongholdToggleClick}
    checked={$isStrongholdLocked}
    {...statusTileProps}
/>
