<script lang="ts">
    import { FontWeight, Icon, Text, TextType } from '@ui'
    import { GridTile } from '@bloomwalletio/ui'

    export let primaryText: string = ''
    export let secondaryText: string = ''
    export let icon: string = ''
    export let iconColor: string = 'blue-500'
    export let iconHeight: string = undefined
    export let iconWidth: string = undefined
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
                    {:else}
                        <Icon height={iconHeight} width={iconWidth} {icon} classes="text-{iconColor}" />
                    {/if}
                </div>
            {/if}
        </svelte:fragment>
        <span slot="center" class="flex flex-col justify-center">
            <Text
                type={TextType.p}
                color="gray-800"
                darkColor="white"
                fontSize="14"
                fontWeight={FontWeight.semibold}
                lineHeight="5"
                >{primaryText}
            </Text>
            {#if secondaryText}
                <Text
                    type={TextType.p}
                    color="gray-600"
                    darkColor="gray-400"
                    fontSize="12"
                    fontWeight={FontWeight.normal}
                    lineHeight="3.5"
                    >{secondaryText}
                </Text>
            {/if}
        </span>
    </GridTile>
{/if}
