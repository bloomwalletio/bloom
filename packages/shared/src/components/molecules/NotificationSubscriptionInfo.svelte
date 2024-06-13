<script lang="ts">
    import { Avatar, IconName, Link, Text } from '@bloomwalletio/ui'
    import { NotifyClientTypes } from '@walletconnect/notify-client'

    export let metadata: NotifyClientTypes.Metadata | undefined
    export let classes: string = ''
</script>

<dapp-info class="flex flex-col bg-surface-0 dark:bg-surface-0-dark {classes}">
    <div class="flex flex-row items-center gap-3">
        {#if metadata?.icons?.[0]}
            <img class="dapp-image" src={metadata.icons[0]} alt={metadata.name} />
        {:else}
            <Avatar icon={IconName.Link} size="lg" surface={0} />
        {/if}
        <div class="flex flex-col mr-8">
            <div class="flex flex-row items-center gap-1">
                <Text type="body2">
                    {metadata?.name}
                </Text>
                {#if metadata?.appDomain}
                    <Link href={metadata.appDomain} text={metadata.appDomain} />
                {/if}
            </div>

            <Text type="sm" textColor="secondary">
                {metadata?.description}
            </Text>
        </div>
    </div>
    <slot />
</dapp-info>

<style lang="postcss">
    dapp-info {
        @apply w-full p-6 pb-2 gap-3;
    }

    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>
