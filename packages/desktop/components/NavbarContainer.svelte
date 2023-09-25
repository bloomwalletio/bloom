<script lang="ts">
    export let height: number = 40
    export let draggable: boolean = false
    export let ghost: boolean = false
</script>

<navbar class:drag={draggable} class:ghost style:height="{height}px">
    <slot />
</navbar>

<style lang="scss">
    navbar {
        @apply w-full flex-none z-10;
        @apply bg-surface dark:bg-surface-dark;
        @apply border-r border-b border-solid border-stroke dark:border-stroke-dark;

        &.ghost {
            @apply bg-transparent;
            border: none;
        }

        &.drag {
            -webkit-app-region: drag;

            :global(button) {
                -webkit-app-region: none;
            }
        }
    }
</style>
