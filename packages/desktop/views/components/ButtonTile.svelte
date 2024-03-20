<script lang="ts">
    import { getHexColorFromColor, Icon, IconName, type IconSize, Tile, Text, TailwindPreset } from '@bloomwalletio/ui'
    import { style } from '@core/utils/ui'

    const colors = TailwindPreset.theme.extend.colors

    export let primaryText: string = ''
    export let secondaryText: string = ''
    export let icon: IconName | undefined = undefined
    export let iconSize: IconSize = 'base'
    export let iconColor: keyof typeof colors = 'brand'
    export let backgroundColor: string | undefined = undefined
    export let disabled: boolean = false
    export let hidden: boolean = false
    export let selected: boolean = false

    export let onClick: () => unknown

    const background = getHexColorFromColor(backgroundColor ?? `${iconColor}/20`)
</script>

{#if !hidden}
    <Tile width="full" variant="outlined" {onClick} {disabled} {selected} surface={1}>
        {#if icon || $$slots.icon}
            <div class="flex justify-center items-center">
                {#if $$slots.icon}
                    <slot name="icon" />
                {:else if icon}
                    <icon-container
                        class="w-12 h-12 flex justify-center items-center rounded-xl"
                        use:style={{ backgroundColor: background }}
                    >
                        <Icon name={icon} customColor={iconColor} size={iconSize} />
                    </icon-container>
                {/if}
            </div>
        {/if}
        <div class="flex flex-col justify-center flex-1 ml-3">
            <Text type="body2">{primaryText}</Text>
            {#if secondaryText}
                <Text type="base" fontWeight="medium" textColor="secondary">
                    {secondaryText}
                </Text>
            {/if}
        </div>
    </Tile>
{/if}
