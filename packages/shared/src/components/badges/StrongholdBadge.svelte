<script lang="ts">
    import { Text, Tooltip } from '@ui'
    import { Position } from '@ui/enums'
    import { localize } from '@core/i18n'
    import { Avatar, IconName } from '@bloomwalletio/ui'

    export let size: 'xxs' | 'xs' | 'sm' | 'md' = 'sm'

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<stronghold-badge
    bind:this={tooltipAnchor}
    on:mouseenter={() => showTooltip(true)}
    on:mouseleave={() => showTooltip(false)}
    on:wheel={() => showTooltip(false)}
    class="block absolute -right-1 -bottom-1"
>
    <Avatar icon={IconName.WarningCircle} {size} backgroundColor="yellow" customTextColor="white" />
</stronghold-badge>
{#if isTooltipVisible}
    <Tooltip anchor={tooltipAnchor} size="small" position={Position.Right} offset={6}>
        <Text color="text-gray-600" darkColor="dark:text-gray-400" classes="text-left" smaller>
            {localize('tooltips.updateStronghold.profileBadge').replace('. ', '.\n')}
        </Text>
    </Tooltip>
{/if}
