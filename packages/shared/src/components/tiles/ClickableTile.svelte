<script lang="ts">
    import { Tile } from '@ui'

    export let disabled = false
    export let classes = ''
    export let onClick: (() => void) | undefined = undefined
</script>

<Tile
    classes="
        {onClick ? 'hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer' : 'pointer-events-none'}
        {disabled ? 'opacity-50 pointer-events-none' : ''}
        {classes}
    "
    {...$$restProps}
    on:click={() => !disabled && onClick?.()}
>
    <slot />
</Tile>
