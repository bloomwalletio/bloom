<script lang="ts">
    import { Tile } from '@ui'

    export let disabled = false
    export let classes = ''
    export let onClick: (() => void) | undefined = undefined
</script>

<Tile
    classes="
        {onClick ? 'hover:bg-gray-100 dark:hover:bg-gray-1000 cursor-pointer' : 'pointer-events-none'}
        {disabled ? 'opacity-50' : ''}
        {classes}
    "
    on:click={onClick}
>
    <slot />
</Tile>
