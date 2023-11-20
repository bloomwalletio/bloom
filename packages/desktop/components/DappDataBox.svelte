<script lang="ts">
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { Text } from '@bloomwalletio/ui'
    import { truncateString } from '@core/utils'

    export let dapp: IConnectedDapp | undefined
</script>

<dapp-data>
    <slot />
    {#if dapp?.metadata}
        <div class="absolute flex flex-row justify-between" style="top: -12px; left: 18px;">
            <div class="flex flex-row gap-2 bg-surface-0 dark:bg-surface-0-dark items-center px-2">
                <img
                    style="width: 24px; height: 24px; border-radius: 24px;"
                    src={dapp.metadata.icons?.[0]}
                    alt={dapp.metadata.name}
                />
                <Text type="xs">
                    {truncateString(dapp.metadata.name, 15)}
                </Text>
            </div>
        </div>
    {/if}
</dapp-data>

<style lang="postcss">
    dapp-data {
        @apply relative flex flex-col;
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply rounded-xl p-6;
    }
</style>
