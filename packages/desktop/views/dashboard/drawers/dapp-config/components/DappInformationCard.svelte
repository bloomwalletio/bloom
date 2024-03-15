<script lang="ts">
    import { Avatar, IconName, Link, Text } from '@bloomwalletio/ui'
    import { CoreTypes } from '@walletconnect/types'
    import { localize } from '@core/i18n'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { DappVerificationIcon, DappVerificationPill } from '@ui'

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
            <DappVerificationIcon {verifiedState} />
            <Link href={metadata.url} text={metadata?.url} />
        </div>
    </div>
    {#if verifiedState && verifiedState !== DappVerification.Valid}
        <div class="shrink-0">
            <DappVerificationPill {verifiedState} />
        </div>
    {/if}
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
