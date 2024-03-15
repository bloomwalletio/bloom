<script lang="ts">
    export let col = false
    export let row = false
    export let clearBackground = false
    export let clearPadding = false
    export let backgroundColor = 'bg-surface'
    export let darkBackgroundColor = 'dark:bg-surface-dark'
    export let classes = ''
</script>

<box
    class={`
        w-full flex rounded-lg
        ${col ? 'flex-col' : ''}
        ${row ? 'flex-row' : ''}
        ${clearPadding ? '' : 'px-4 py-4'}
        ${backgroundColor && !clearBackground ? backgroundColor : ''}  
        ${darkBackgroundColor && !clearBackground ? darkBackgroundColor : ''}
        ${classes}
    `}
>
    <slot />
</box>
