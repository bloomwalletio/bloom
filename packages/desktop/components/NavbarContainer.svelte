<script lang="ts">
    export let draggable: boolean = false
    export let ghost: boolean = false
</script>

<navbar class:drag={draggable} class:ghost>
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
