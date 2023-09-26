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
        @apply w-full flex-none z-10 bg-white;
        border-bottom: 1px solid #f1eef9;
        border-right: 1px solid #f1eef9;

        &.ghost {
            @apply bg-transparent;
            border-bottom: none;
            border-right: none;
        }

        &.drag {
            -webkit-app-region: drag;

            :global(button) {
                -webkit-app-region: none;
            }
        }
    }
</style>
