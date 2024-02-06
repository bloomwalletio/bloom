<script lang="ts">
    import { openUrlInBrowser } from '@core/app/utils'
    import { Avatar, Icon, IconName, Link, Text } from '@bloomwalletio/ui'
    import { CoreTypes } from '@walletconnect/types'
    import { localize } from '@core/i18n'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'

    export let metadata: CoreTypes.Metadata
    export let verifiedState: DappVerification | undefined = undefined
</script>

<dapp-information>
    {#if metadata?.icons?.[0]}
        <img class="dapp-image" src={metadata?.icons?.[0]} alt={metadata?.name} />
    {:else}
        <Avatar icon={IconName.Link} size="lg" surface={0} />
    {/if}
    <div class="flex flex-col">
        <Text type="body2">
            {metadata?.name ?? localize('general.unknown')}
        </Text>
        <div class="flex flex-row items-center gap-1">
            {#if verifiedState === DappVerification.Valid}
                <Icon name={IconName.ShieldOn} size="xs" textColor="success" />
            {:else if verifiedState === DappVerification.Invalid}
                <Icon name={IconName.ShieldOff} size="xs" textColor="danger" />
            {:else if verifiedState === DappVerification.Unknown}
                <Icon name={IconName.ShieldOff} size="xs" textColor="warning" />
            {/if}
            <Link text={metadata?.url} on:click={() => openUrlInBrowser(metadata.url)} />
        </div>
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
