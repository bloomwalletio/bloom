<script lang="ts">
    import { IS_MAC } from '@core/app'
</script>

<navbar class:drag={IS_MAC}>
    <slot />
</navbar>

<style lang="scss">
    navbar {
        @apply w-full flex-none px-4 z-10 bg-white;
        height: 40px;
        border-bottom: 1px solid #f1eef9;
        border-right: 1px solid #f1eef9;

        &.drag {
            -webkit-app-region: drag;
            @apply bg-red-200;
        }

        :global(.drag) {
            -webkit-app-region: drag;
            @apply bg-orange-200;

            :global(button) {
                -webkit-app-region: none;
                @apply bg-green-200;
            }
        }
    }
</style>
