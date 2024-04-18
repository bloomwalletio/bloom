<script lang="ts">
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { IpfsGatewayMenu } from './components'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    function addIpfsGateway(url: string): void {
        const ipfsGateways =
            $activeProfile?.settings.nfts.ipfsGateways?.map((ipfsGateway) => ({
                ...ipfsGateway,
                isPrimary: false,
            })) ?? []

        ipfsGateways.push({ url, isPrimary: true })
        updateActiveProfileSettings({ nfts: { ...$activeProfile?.settings.nfts, ipfsGateways } })
    }

    function onIpfsGatewayAdd(): void {
        openPopup({
            id: PopupId.Input,
            props: {
                title: localize('views.settings.ipfsGateways.addGateway.title'),
                input: { placeholder: localize('views.settings.ipfsGateways.addGateway.placeholder'), startValue: '' },
                onConfirm: (inputText: string) => {
                    addIpfsGateway(inputText)
                    closePopup()
                },
            },
        })
    }
</script>

<SettingsSection
    title={localize('views.settings.ipfsGateways.title')}
    description={localize('views.settings.ipfsGateways.description')}
>
    <div class="space-y-4">
        <ipfs-gateways-table
            class="max-h-80 flex flex-col overflow-auto w-1/2 divide-y divide-solid divide-stroke dark:divide-stroke-dark"
        >
            {#each $activeProfile?.settings.nfts.ipfsGateways ?? [] as ipfsGateway}
                <div class="flex flex-row items-center justify-between p-2">
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
        <Button variant="text" icon={IconName.Plus} text="Add IPFS gateway" on:click={() => onIpfsGatewayAdd()} />
    </div>
</SettingsSection>

<style lang="postcss">
    ipfs-gateways-table {
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply rounded-xl;
    }
</style>
