<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile, type StatusTileProps } from '@components'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { lockStronghold } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { checkOrUnlockStronghold } from '@core/stronghold'

    const title = localize('general.stronghold')
    const { isStrongholdLocked } = $activeProfile

    $: statusTileProps = setStatusTileProps($isStrongholdLocked)

    async function onStrongholdToggleClick(): Promise<void> {
        try {
            if ($isStrongholdLocked) {
                await checkOrUnlockStronghold()
            } else {
                lockStronghold()
            }
        } catch (err) {
            handleError(err)
        }
    }

    function setStatusTileProps(isStrongholdLocked: boolean): StatusTileProps {
        let subtitle: string
        let iconName: IconName
        let iconColor: string

        if (isStrongholdLocked) {
            subtitle = localize('general.locked')
            iconName = IconName.LockedFill
            iconColor = 'success'
        } else {
            subtitle = localize('general.unlocked')
            iconName = IconName.UnlockedFill
            iconColor = 'neutral'
        }

        return {
            title,
            subtitle,
            iconName,
            iconColor,
            onClick: onStrongholdToggleClick,
            checked: isStrongholdLocked,
        }
    }
</script>

<StatusTile {statusTileProps} />
