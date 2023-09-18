<script lang="ts">
    import { FontWeight, Text } from '@ui'
    import TokenAvatar from '@ui/avatars/TokenAvatar.svelte'
    import { IToken } from '@core/token'

    export let token: IToken
</script>

{#if token}
    <div class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md">
        <TokenAvatar size="xs" {token} />
        <div class="w-full relative" style="max-width: 75px;">
            <Text
                color="gray-600"
                darkColor="white"
                fontWeight={FontWeight.semibold}
                fontSize="15"
                classes="overflow-hidden whitespace-nowrap text-ellipsis"
            >
                {token.metadata?.name ?? token.id}
            </Text>
        </div>
    </div>
{/if}
