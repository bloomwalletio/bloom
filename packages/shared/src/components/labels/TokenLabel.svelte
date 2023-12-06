<script lang="ts">
    import { IToken } from '@core/token'
    import { Text } from '@bloomwalletio/ui'
    import TokenAvatar from '@ui/avatars/TokenAvatar.svelte'

    export let token: IToken
</script>

{#if token}
    <div class="flex flex-row items-center p-2 space-x-2 text-left bg-surface-1 dark:bg-surface-1-dark rounded-md">
        <TokenAvatar {token} />
        <div class="w-full relative" style="max-width: 75px;">
            <Text type="body2" textColor="primary" truncate>
                {token.metadata?.name ?? token.id}
            </Text>
        </div>
    </div>
{/if}
