<script lang="ts">
    import { Tile } from '@ui'

    export let disabled = false
    export let classes = ''
    export let onClick: (() => void) | undefined = undefined
</script>

<Tile
    classes="
        {onClick ? 'hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer' : 'pointer-events-none'}
        {disabled ? 'opacity-50' : ''}
        {classes}
    "
    {...$$restProps}
    on:click={onClick}
>
    <slot />
</Tile>
