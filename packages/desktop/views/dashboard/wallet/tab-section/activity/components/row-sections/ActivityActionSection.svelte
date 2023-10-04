<script lang="ts">
    import { Activity, ActivityAction, ActivityDirection, ActivityType, getActivityTileTitle } from '@core/activity'
    import { formatDate, localize } from '@core/i18n'
    import { Avatar, IconName } from '@bloomwalletio/ui'
    import { Text } from '@bloomwalletio/ui'
    import { appSettings } from '@core/app/stores'

    export let activity: Activity

    $: dark = $appSettings.darkMode

    let style: { icon: IconName; color: string } | undefined
    $: dark, (style = getActionStyle())
    function getActionStyle(): { icon: IconName; color: string } {
        const { type, isInternal, direction, action } = activity

        if (type === ActivityType.Basic && activity.isShimmerClaiming) {
            return {
                icon: IconName.Receive,
                color: 'brand',
            }
        }
        if (type === ActivityType.Governance) {
            return {
                icon: IconName.Bank,
                color: dark ? 'neutral-1' : 'neutral-7',
            }
        } else if (type === ActivityType.Consolidation) {
            return {
                icon: IconName.Refresh,
                color: dark ? 'neutral-1' : 'neutral-7',
            }
        } else if (action === ActivityAction.Mint) {
            return {
                icon: IconName.Import,
                color: 'success',
            }
        } else if (action === ActivityAction.Burn) {
            return {
                icon: IconName.Refresh,
                color: 'danger',
            }
        } else if (action === ActivityAction.InitialBalance) {
            return {
                icon: IconName.Receive,
                color: dark ? 'neutral-1' : 'neutral-7',
            }
        } else if (action === ActivityAction.Send || action === ActivityAction.BalanceChange) {
            if (isInternal) {
                return {
                    icon: IconName.Refresh,
                    color: dark ? 'neutral-1' : 'neutral-7',
                }
            }
            if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
                return {
                    icon: IconName.Receive,
                    color: 'brand',
                }
            }
            if (direction === ActivityDirection.Outgoing) {
                return {
                    icon: IconName.Send,
                    color: 'info',
                }
            }
        } else {
            return {
                icon: IconName.HelpCircle,
                color: dark ? 'neutral-1' : 'neutral-7',
            }
        }
    }
</script>

<div class="text-start">
    <div class="flex flex-row items-center gap-2">
        <Avatar size="xxs" backgroundColor={style.color} icon={style.icon} textColor="primary" />
        <Text customColor={style.color}>{localize(getActivityTileTitle(activity))}</Text>
    </div>
    <Text textColor="secondary">{formatDate(activity.time, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
</div>
