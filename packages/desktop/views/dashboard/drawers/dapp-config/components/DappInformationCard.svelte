<script lang="ts">
    import { openUrlInBrowser } from '@core/app/utils'
    import { Avatar, IconName, Link, Text } from '@bloomwalletio/ui'
    import { CoreTypes } from '@walletconnect/types'

    export let metadata: CoreTypes.Metadata
</script>

<dapp-information>
    {#if metadata?.icons?.[0]}
        <img class="dapp-image" src={metadata?.icons?.[0]} alt={metadata?.name} />
    {:else}
        <Avatar icon={IconName.Link} size="lg" surface={2} />
    {/if}
    <div class="flex flex-col">
        <Text type="body2">
            {metadata?.name}
        </Text>
        <Link text={metadata?.url} on:click={() => openUrlInBrowser(metadata.url)} />
    </div>
</dapp-information>

<style lang="scss">
    dapp-information {
        @apply w-full p-6;
        @apply flex flex-row items-center justify-center gap-3;
        @apply bg-surface-0 dark:bg-surface-0-dark;
    }

    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>
