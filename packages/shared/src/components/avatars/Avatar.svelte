<script lang="ts">
    import { onMount } from 'svelte'
    import { Text } from '@ui'
    import { AvatarSize, FontWeight } from '@ui/enums'
    import { getIconColorFromString } from '@core/account/utils'
    import { getInitials } from '@core/utils'

    export let text: string = ''
    export let size: AvatarSize = AvatarSize.Medium
    export let color: string | undefined = undefined

    $: color = color || getIconColorFromString(text, { shades: ['500'], colorsToExclude: ['gray'] })

    let height: number
    let width: number
    let fontSize: number
    let lineHeight: string

    function setAvatarUiDetails(): void {
        switch (size) {
            case AvatarSize.ExtraLarge:
                height = 36
                width = 36
                fontSize = 24
                lineHeight = '180'
                break
            case AvatarSize.Large:
                height = 20
                width = 20
                fontSize = 20
                lineHeight = '160'
                break
            case AvatarSize.Medium:
                height = 10
                width = 10
                fontSize = 13
                lineHeight = '110'
                break
            case AvatarSize.Small:
                height = 8
                width = 8
                fontSize = 11
                lineHeight = '110'
                break
            case AvatarSize.ExtraSmall:
                height = 6
                width = 6
                fontSize = 9
                lineHeight = '100'
                break
            default:
                break
        }
    }

    onMount(() => {
        setAvatarUiDetails()
    })
</script>

<avatar
    class="rounded-full font-bold text-center flex items-center justify-center overflow-hidden
        h-{height} w-{width}
        {color ? 'icon-bg' : 'bg-blue-500'}
    "
    style={color ? `--icon-bg-color: ${color}` : ''}
>
    {#if $$slots.content}
        <slot name="content" />
    {:else}
        <Text {fontSize} {lineHeight} fontWeight={FontWeight.bold} classes="text-white">{getInitials(text, 2)}</Text>
    {/if}
</avatar>

<style lang="scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>
