<script lang="ts">
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'
    import { Pill, Text } from '@bloomwalletio/ui'
    import { IpfsGatewayMenu } from './components'

    // function onIpfsGatewayChange(option: IOption): void {
    //     updateActiveProfileSettings({ nfts: { ...$activeProfile?.settings.nfts, ipfsGateway: option.value } })
    // }
</script>

<SettingsSection
    title={localize('views.settings.ipfsGateways.title')}
    description={localize('views.settings.ipfsGateways.description')}
>
    <ipfs-gateways-table class="max-h-80 flex flex-col overflow-auto">
        {#each $activeProfile?.settings.nfts.ipfsGateways ?? [] as ipfsGateway}
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row w-full items-center space-x-4 overflow-hidden">
                    <Text truncate>
                        {ipfsGateway.url}
                    </Text>
                    {#if ipfsGateway.isPrimary}
                        <Pill color="info">
                            {localize('general.primary').toLowerCase()}
                        </Pill>
                    {/if}
                </div>
                <IpfsGatewayMenu {...ipfsGateway} />
            </div>
        {/each}
    </ipfs-gateways-table>
</SettingsSection>

<style lang="postcss">
    ipfs-gateways-table {
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply rounded-xl;
        @apply p-2;
    }

    button {
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;
        @apply rounded-lg;
        @apply p-2;
    }
</style>
