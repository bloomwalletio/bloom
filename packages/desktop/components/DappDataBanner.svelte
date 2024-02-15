<script lang="ts">
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { Avatar, Icon, IconName, Text } from '@bloomwalletio/ui'

    export let dapp: IConnectedDapp | undefined
    export let verifiedState: DappVerification | undefined = undefined
</script>

<dapp-banner>
    {#if dapp?.metadata?.icons?.[0]}
        <img class="dapp-image" src={dapp.metadata.icons[0]} alt={dapp.metadata.name} />
    {:else}
        <Avatar icon={IconName.Link} size="lg" surface={0} />
    {/if}
    <div class="flex flex-col">
        <Text type="body2">
            {dapp?.metadata?.name}
        </Text>

        {#if dapp?.metadata?.url}
            <div class="flex flex-row items-center gap-1">
                {#if verifiedState === DappVerification.Valid}
                    <Icon name={IconName.ShieldOn} size="xs" textColor="success" />
                {:else if verifiedState === DappVerification.Invalid || verifiedState === DappVerification.Scam}
                    <Icon name={IconName.ShieldOff} size="xs" textColor="danger" />
                {:else if verifiedState === DappVerification.Unknown}
                    <Icon name={IconName.ShieldOff} size="xs" textColor="warning" />
                {/if}
                <Text type="sm" textColor="secondary" truncate>
                    {dapp.metadata.url}
                </Text>
            </div>
        {/if}
    </div>
</dapp-banner>

<style lang="scss">
    dapp-banner {
        @apply w-full p-6 pb-4;
        @apply flex flex-row items-center justify-center gap-3;
        @apply bg-surface-1 dark:bg-surface-1-dark;
    }

    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>
