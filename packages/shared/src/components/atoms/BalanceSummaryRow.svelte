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

<div class="flex flex-row justify-between flex-grow space-x-2">
    <div class={'flex flex-col space-y-0.5'}>
        <div class="flex flex-row gap-1 items-center">
            <Text fontWeight={bold ? 'bold' : 'semibold'}>{title}</Text>
            {#if expandable}
                <Icon name={expanded ? IconName.ChevronUp : IconName.ChevronDown} size="xs" />
            {/if}
        </div>

        {#if subtitle}
            <Text textColor="secondary">
                {subtitle}
            </Text>
        {/if}
    </div>
    <div class="flex flex-col items-end space-y-0.5 text-right">
        <Text fontWeight={bold ? 'bold' : 'semibold'}>{amount}</Text>
        <Text textColor="secondary">
            {convertedAmount}
        </Text>
    </div>
</div>
