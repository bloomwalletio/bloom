<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'

    export let title: string
    export let subtitle: string | undefined = undefined
    export let icon: IconName
</script>

<div class="flex flex-col items-center justify-center gap-6 px-6">
    <empty-list-icon>
        <Icon name={icon} size="md" customColor="primary-500" />
    </empty-list-icon>
    <div class="flex flex-col items-center justify-center px-10 gap-4">
        <Text type="h6" align="center">{title}</Text>
        {#if subtitle}
            <Text textColor="secondary" align="center">{subtitle}</Text>
        {/if}
    </div>
</div>

<style lang="postcss">
    empty-list-icon {
        @apply flex items-center justify-center text-center;
        @apply h-24 w-24 rounded-full shadow-elevation-4;
        @apply bg-surface dark:bg-surface-dark;
    }
</style>
