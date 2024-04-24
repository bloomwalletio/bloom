<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'

    export let title: string
    export let subtitle: string
    export let bold: boolean = false
    export let amount: string
    export let convertedAmount: string
    export let expandable: boolean = false
    export let expanded: boolean = false
</script>

<div class="flex flex-col justify-between flex-grow space-y-0.5">
    <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-1 items-center">
            <Text fontWeight={bold ? 'bold' : 'semibold'}>{title}</Text>
            {#if expandable}
                <Icon name={expanded ? IconName.ChevronUp : IconName.ChevronDown} size="xs" />
            {/if}
        </div>
        <Text align="right" fontWeight={bold ? 'bold' : 'semibold'}>{amount}</Text>
    </div>
    <div class="flex flex-row justify-between">
        <Text align="left" textColor="secondary">
            {subtitle}
        </Text>
        <Text align="right" textColor="secondary">
            {convertedAmount}
        </Text>
    </div>
</div>
