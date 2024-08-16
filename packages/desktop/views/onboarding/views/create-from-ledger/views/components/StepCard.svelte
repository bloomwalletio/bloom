<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'

    export let stepCount: number
    export let complete: boolean = false
    export let icon: IconName
    export let text: string
</script>

<step-card class:success={complete}>
    <status-icon-container>
        {#if complete}
            <Icon name={IconName.Check} size="xs" customColor="neutral-1" />
        {:else}
            <div class="w-4 h-4 rounded-full flex items-center justify-center">
                <Text customColor="neutral-1">{stepCount}</Text>
            </div>
        {/if}
    </status-icon-container>
    <icon-container>
        <Icon name={icon} textColor="current" />
    </icon-container>
    <Text align="center">{text}</Text>
</step-card>

<style lang="postcss">
    step-card {
        @apply relative flex flex-col items-center;
        @apply w-36 h-[11.25rem] px-4 pb-4 pt-10 gap-4;
        @apply rounded-xl bg-surface-1 dark:bg-surface-1-dark;

        &.success {
            @apply ring-2 ring-success/50;

            status-icon-container {
                @apply bg-success;
            }

            icon-container {
                @apply bg-success/20 text-success;
            }
        }

        &.warning {
            @apply ring-2 ring-warning/50;

            status-icon-container {
                @apply bg-warning;
            }

            icon-container {
                @apply bg-warning/20 text-warning;
            }
        }

        status-icon-container {
            @apply bg-neutral;
        }

        icon-container {
            @apply bg-neutral/20 text-neutral;
        }
    }

    status-icon-container {
        @apply absolute top-2 left-2 rounded-full p-1.5;
    }

    icon-container {
        @apply p-3 rounded-xl;
    }
</style>
