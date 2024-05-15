<script lang="ts">
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { CoreTypes } from '@walletconnect/types'
    import { Avatar, Icon, IconName, Link, Text } from '@bloomwalletio/ui'
    import { DappVerificationPill } from '@ui'
    import { VERIFICATION_ICONS } from '@auxiliary/wallet-connect/constants/verification-icons.constant'
    import { IDappMetadata } from '@auxiliary/wallet-connect/interface'

    export let metadata: CoreTypes.Metadata | IDappMetadata | undefined
    export let verifiedState: DappVerification | undefined = undefined
    export let showLink: boolean = true
    export let classes: string = ''
</script>

<dapp-info class="bg-surface-0 dark:bg-surface-0-dark {classes}">
    {#if metadata?.icons?.[0]}
        <img class="dapp-image" src={metadata.icons[0]} alt={metadata.name} />
    {:else}
        <Avatar icon={IconName.Link} size="lg" surface={0} />
    {/if}
    <div class="flex flex-col">
        <Text type="body2">
            {metadata?.name}
        </Text>

        {#if metadata?.url}
            <div class="flex flex-row items-center gap-1">
                {#if verifiedState}
                    {@const { color, icon } = VERIFICATION_ICONS[verifiedState]}
                    <Icon name={icon} size="xs" textColor={color} />
                {/if}
                {#if showLink}
                    <Link href={metadata.url} text={metadata.url} />
                {:else}
                    <Text type="sm" textColor="secondary" truncate>
                        {metadata.url}
                    </Text>
                {/if}
            </div>
        {/if}
    </div>
    {#if verifiedState && verifiedState !== DappVerification.Valid}
        <div class="shrink-0">
            <DappVerificationPill {verifiedState} />
        </div>
    {/if}
</dapp-info>

<style lang="scss">
    dapp-info {
        @apply w-full p-6;
        @apply flex flex-row items-center justify-center gap-3;
    }

    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>
