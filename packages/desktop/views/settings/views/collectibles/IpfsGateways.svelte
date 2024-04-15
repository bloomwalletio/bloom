<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'
    import { IPFS_GATEWAYS } from '@core/nfts'

    const options: IOption[] = IPFS_GATEWAYS.map((gateway) => ({ value: gateway, label: gateway }))
    let selected: IOption =
        options.find((option) => option.value === $activeProfile?.settings.nfts.ipfsGateway?.toString()) ?? options[0]

    $: selected && onIpfsGatewayChange(selected)
    function onIpfsGatewayChange(option: IOption): void {
        updateActiveProfileSettings({ nfts: { ...$activeProfile?.settings.nfts, ipfsGateway: option.value } })
    }
</script>

<SettingsSection
    title={localize('views.settings.ipfsGateways.title')}
    description={localize('views.settings.ipfsGateways.description')}
>
    <div class="w-1/2">
        <SelectInput
            label={localize('views.settings.ipfsGateways.input')}
            bind:selected
            value={selected.value}
            {options}
            hideValue
        />
    </div>
</SettingsSection>
