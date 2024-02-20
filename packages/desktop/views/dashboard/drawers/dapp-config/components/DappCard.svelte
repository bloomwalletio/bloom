<script lang="ts">
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { ClickableTile, NetworkAvatar } from '@ui'
    import { Avatar, AvatarGroup, IconName, Text } from '@bloomwalletio/ui'
    import { NetworkId } from '@core/network'
    import { getPersistedDappNamespacesForDapp } from '@auxiliary/wallet-connect/stores'
    import { localize } from '@core/i18n'

    export let dapp: IConnectedDapp
    export let disabled: boolean = false
    export let onClick: (() => unknown) | undefined = undefined

    $: networkIds = Object.values(
        dapp.session?.namespaces ?? getPersistedDappNamespacesForDapp(dapp.metadata?.url) ?? {}
    ).flatMap((namespace) => namespace.chains as NetworkId[])
</script>

<ClickableTile
    classes="bg-surface-0 dark:bg-surface-0-dark border border-solid border-stroke dark:border-stroke-dark"
    {disabled}
    {onClick}
>
    <div class="w-full flex flex-row justify-between items-center p-2 gap-3">
        <div class="flex flex-row gap-3 items-center overflow-hidden">
            {#if dapp.metadata?.icons?.[0]}
                <img class="w-10 h-10 rounded-full" src={dapp.metadata.icons[0]} alt={dapp.metadata.name} />
            {:else}
                <Avatar icon={IconName.Link} size="lg" surface={0} />
            {/if}
            <div class="flex flex-col overflow-hidden">
                <Text type="body2" truncate>
                    {dapp.metadata?.name ?? localize('general.unknown')}
                </Text>
                {#if dapp.metadata?.url}
                    <Text type="sm" textColor="secondary" truncate>
                        {dapp.metadata?.url}
                    </Text>
                {/if}
            </div>
        </div>
        <div>
            <AvatarGroup avatarSize="base" avatarShape="circle" remainder={networkIds.length - 3}>
                {#each networkIds.slice(0, 3) as networkId}
                    <NetworkAvatar {networkId} />
                {/each}
            </AvatarGroup>
        </div>
    </div>
</ClickableTile>
