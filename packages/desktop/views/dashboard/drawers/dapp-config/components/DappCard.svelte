<script lang="ts">
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { ClickableTile, NetworkAvatar } from '@ui'
    import { Text } from '@bloomwalletio/ui'
    import { SupportedNetworkId } from '@core/network'

    export let dapp: IConnectedDapp
    export let onClick: (() => unknown) | undefined = undefined
</script>

<ClickableTile
    classes="bg-surface-0 dark:bg-surface-0-dark border border-solid border-stroke dark:border-stroke-dark"
    {onClick}
>
    <div class="w-full flex flex-row justify-between items-center p-2 gap-3">
        <div class="flex flex-row gap-3 items-center overflow-hidden">
            <img class="w-10 h-10 rounded-full" src={dapp.metadata?.icons?.[0]} alt={dapp.metadata?.name} />
            <div class="flex flex-col overflow-hidden">
                <Text type="body2" truncate>
                    {dapp.metadata?.name ?? 'dApp'}
                </Text>
                {#if dapp.metadata?.url}
                    <Text type="sm" textColor="secondary" truncate>
                        {dapp.metadata?.url}
                    </Text>
                {/if}
            </div>
        </div>
        <NetworkAvatar networkId={SupportedNetworkId.ShimmerEvm} />
    </div>
</ClickableTile>
