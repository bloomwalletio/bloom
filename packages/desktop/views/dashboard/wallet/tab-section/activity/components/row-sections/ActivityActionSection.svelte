<script lang="ts">
    import { Activity, ActivityAction, ActivityDirection, ActivityType, getActivityTileTitle } from '@core/activity'
    import { formatDate, localize } from '@core/i18n'
    import { Avatar, IconName } from '@bloomwalletio/ui'
    import { Text } from '@bloomwalletio/ui'

    export let activity: Activity

    $: style = getActionStyle()

    function getActionStyle(): { icon: IconName; color: string } {
        const { type, isInternal, direction, action } = activity

        if (type === ActivityType.Basic && activity.isShimmerClaiming) {
            return {
                icon: IconName.Receive,
                color: 'purple',
            }
        }
        if (type === ActivityType.Governance) {
            return {
                icon: IconName.Bank,
                color: 'green',
            }
        } else if (type === ActivityType.Consolidation) {
            return {
                icon: IconName.CoinSwap,
                color: 'purple',
            }
        } else if (action === ActivityAction.Mint) {
            return {
                icon: IconName.Receive,
                color: 'purple',
            }
        } else if (action === ActivityAction.Burn) {
            return {
                icon: IconName.Send,
                color: 'red',
            }
        } else if (action === ActivityAction.InitialBalance) {
            return {
                icon: IconName.Receive,
                color: 'purple',
            }
        } else if (action === ActivityAction.Send || action === ActivityAction.BalanceChange) {
            if (isInternal) {
                return {
                    icon: IconName.Refresh,
                    color: 'purple',
                }
            }
            if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
                return {
                    icon: IconName.Receive,
                    color: 'purple',
                }
            }
            if (direction === ActivityDirection.Outgoing) {
                return {
                    icon: IconName.Send,
                    color: 'blue',
                }
            }
        } else {
            return {
                icon: IconName.HelpCircle,
                color: 'gray',
            }
        }
    }
</script>

<div class="text-start">
    <div class="flex flex-row items-center gap-2">
        <Avatar size="xxs" backgroundColor={style.color} icon={style.icon} textColor="white" />
        <Text color={style.color + '-500'} darkColor={style.color + '-500'}
            >{localize(getActivityTileTitle(activity))}</Text
        >
    </div>
    <Text color="secondary" darkColor="secondary-dark"
        >{formatDate(activity.time, { year: 'numeric', month: 'short', day: 'numeric' })}</Text
    >
</div>
