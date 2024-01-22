<script lang="ts">
    import { Activity, ActivityAction, ActivityDirection, ActivityType, getActivityTileTitle } from '@core/activity'
    import { formatDate, localize } from '@core/i18n'
    import { Avatar, IconName } from '@bloomwalletio/ui'
    import { Text } from '@bloomwalletio/ui'
    import { darkMode } from '@core/app/stores'

    export let activity: Activity

    $: shouldMagnifyIcon = [IconName.Receive, IconName.Send, IconName.ArrowDown, IconName.ArrowUp].includes(style?.icon)

    let style: { icon: IconName; color: string } | undefined
    $: activity, $darkMode, (style = getActionStyle())
    function getActionStyle(): { icon: IconName; color: string } {
        const { type, isInternal, direction, action } = activity

        if (type === ActivityType.Basic && activity.isShimmerClaiming) {
            return {
                icon: IconName.Receive,
                color: 'info',
            }
        }
        if (type === ActivityType.Governance) {
            return {
                icon: IconName.ArrowLeftRight,
                color: $darkMode ? 'neutral-1' : 'neutral-7',
            }
        } else if (type === ActivityType.Consolidation) {
            return {
                icon: IconName.ArrowLeftRight,
                color: $darkMode ? 'neutral-1' : 'neutral-7',
            }
        } else if (type === ActivityType.SmartContract) {
            return {
                icon: IconName.ArrowUp,
                color: 'brand',
            }
        } else if (action === ActivityAction.Mint) {
            return {
                icon: IconName.ArrowDown,
                color: 'success',
            }
        } else if (action === ActivityAction.Burn) {
            return {
                icon: IconName.ArrowUp,
                color: 'danger',
            }
        } else if (action === ActivityAction.InitialBalance) {
            return {
                icon: IconName.Receive,
                color: $darkMode ? 'neutral-1' : 'neutral-7',
            }
        } else if (action === ActivityAction.Send || action === ActivityAction.BalanceChange) {
            if (isInternal) {
                if (
                    direction === ActivityDirection.Incoming ||
                    direction === ActivityDirection.SelfTransaction ||
                    direction === ActivityDirection.Genesis
                ) {
                    return {
                        icon: IconName.ArrowLeftRight,
                        color: 'info',
                    }
                }
                if (direction === ActivityDirection.Outgoing) {
                    return {
                        icon: IconName.ArrowLeftRight,
                        color: 'brand',
                    }
                }
            }
            if (
                direction === ActivityDirection.Incoming ||
                direction === ActivityDirection.SelfTransaction ||
                direction === ActivityDirection.Genesis
            ) {
                return {
                    icon: IconName.Receive,
                    color: 'info',
                }
            }
            if (direction === ActivityDirection.Outgoing) {
                return {
                    icon: IconName.Send,
                    color: 'brand',
                }
            }
        } else {
            return {
                icon: IconName.HelpCircle,
                color: $darkMode ? 'neutral-1' : 'neutral-7',
            }
        }
    }
</script>

<div class="text-start">
    <div class="flex flex-row items-center gap-2">
        <Avatar
            size="xxs"
            backgroundColor={style.color}
            icon={style.icon}
            textColor="primary"
            magnify={shouldMagnifyIcon}
        />
        <Text customColor={style.color}>{localize(getActivityTileTitle(activity))}</Text>
    </div>
    <Text textColor="secondary">{formatDate(activity.time, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
</div>
