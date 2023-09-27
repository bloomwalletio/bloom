<script lang="ts">
    import { type IconSize, Icon, IconName, GridTile, Text } from '@bloomwalletio/ui'

    export let primaryText: string = ''
    export let secondaryText: string = ''
    export let icon: IconName | undefined = undefined
    export let iconColor: string = undefined
    export let iconSize: IconSize = 'sm'
    export let disabled: boolean = false
    export let hidden: boolean = false
    export let selected: boolean = false

    export let onClick: () => unknown
</script>

{#if !hidden}
    <GridTile width="full" variant="outlined" {onClick} {disabled} {selected}>
        <svelte:fragment slot="left">
            {#if icon || $$slots.icon}
                <div class="flex w-full h-full justify-center items-center">
                    {#if $$slots.icon}
                        <slot name="icon" />
                    {:else if icon}
                        <Icon name={icon} textColor="brand" customColor={iconColor} size={iconSize} />
                    {/if}
                </div>
            {/if}
        </svelte:fragment>
        <span slot="center" class="flex flex-col justify-center">
            <Text type="body2">{primaryText}</Text>
            {#if secondaryText}
                <Text type="base" fontWeight="medium" textColor="secondary">
                    {secondaryText}
                </Text>
            {/if}
        </span>
    </GridTile>
{/if}
