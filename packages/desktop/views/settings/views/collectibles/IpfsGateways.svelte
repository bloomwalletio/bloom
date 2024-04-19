<script lang="ts">
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { IpfsGatewayMenu } from './components'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { addNftsToDownloadQueue } from '@core/nfts/actions'
    import { selectedAccountNfts } from '@core/nfts/stores'
    import { isValidUrl } from '@core/utils'
    import { IPFS_HEALTH_CHECKER_PATH } from '@core/profile/constants'

    function addIpfsGateway(inputtedUrl: string): void {
        const url = new URL(inputtedUrl).origin
        const nftSettings = $activeProfile?.settings.nfts
        const ipfsGateways =
            nftSettings.ipfsGateways?.map((ipfsGateway) => ({
                ...ipfsGateway,
                isPrimary: ipfsGateway.url === url,
            })) ?? []

        if (!nftSettings.ipfsGateways?.some((ipfsGateway) => ipfsGateway.url === url)) {
            ipfsGateways.push({ url, isPrimary: true })
        }

        updateActiveProfileSettings({ nfts: { ...$activeProfile?.settings.nfts, ipfsGateways } })
        void addNftsToDownloadQueue($selectedAccountNfts)
    }

    async function validateIpfsGateway(url: string): Promise<void> {
        if (!url || !isValidUrl(url)) {
            return Promise.reject(localize('error.global.invalidUrl'))
        }

        try {
            const ipfsHealthCheckUrl = new URL(IPFS_HEALTH_CHECKER_PATH, url)
            const response = await fetch(ipfsHealthCheckUrl, { method: 'HEAD' })
            if (!response.ok) {
                return Promise.reject(localize('views.settings.ipfsGateways.addGateway.error.invalidGateway'))
            }
        } catch (error) {
            return Promise.reject(localize('error.global.invalidUrl'))
        }
    }

    function onIpfsGatewayAdd(): void {
        openPopup({
            id: PopupId.Input,
            props: {
                title: localize('views.settings.ipfsGateways.addGateway.title'),
                input: {
                    placeholder: localize('views.settings.ipfsGateways.addGateway.placeholder'),
                    startValue: '',
                    validate: validateIpfsGateway,
                },
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
