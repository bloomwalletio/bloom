<script lang="ts">
    import { Icon, IconName, type IconSize, Tile, Text, TailwindPreset } from '@bloomwalletio/ui'

    const colors = TailwindPreset.theme.extend.colors

    export let primaryText: string = ''
    export let secondaryText: string = ''
    export let icon: IconName | undefined = undefined
    export let iconSize: IconSize = 'base'
    export let iconColor: keyof typeof colors = 'brand'
    export let iconColorShade: string = 'DEFAULT'
    export let backgroundColor: string | undefined = undefined
    export let disabled: boolean = false
    export let hidden: boolean = false
    export let selected: boolean = false

    export let onClick: () => unknown
</script>

{#if !hidden}
    <Tile width="full" variant="outlined" {onClick} {disabled} {selected} surface={1}>
        {#if icon || $$slots.icon}
            <div class="flex justify-center items-center">
                {#if $$slots.icon}
                    <slot name="icon" />
                {:else if icon}
                    <icon-container
                        class="w-12 h-12 flex justify-center items-center rounded-xl {backgroundColor
                            ? `bg-${backgroundColor}`
                            : `bg-${iconColor}/20`}"
                    >
                        <Icon name={icon} customColor={colors[iconColor][iconColorShade]} size={iconSize} />
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
