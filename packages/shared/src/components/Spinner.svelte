<script lang="ts">
    import { Icon } from '@ui'
    import { Icon as IconName } from '@auxiliary/icon'

    export let busy = false
    export let size = 24
</script>

{#if busy}
    <spinner-container class={'flex flex-row items-center'}>
        {#if busy}
            <Icon
                icon={IconName.Refresh}
                width={size}
                height={size}
                classes={'animate-spin-reverse text-gray-500 dark:text-white'}
            />
        {/if}
    </spinner-container>
{/if}
