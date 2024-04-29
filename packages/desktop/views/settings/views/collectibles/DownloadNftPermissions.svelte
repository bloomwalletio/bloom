<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DownloadPermission } from '@core/nfts'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'
    import { allAccountNfts } from '@core/nfts/stores'
    import { addNftsToDownloadQueue } from '@core/nfts/actions'

    const options: IOption[] = [
        {
            value: DownloadPermission.All,
            label: localize('views.settings.downloadNftPermissions.all'),
        },
        {
            value: DownloadPermission.AllExceptDenylist,
            label: localize('views.settings.downloadNftPermissions.allExceptDenylist'),
        },
        {
            value: DownloadPermission.AllowListOnly,
            label: localize('views.settings.downloadNftPermissions.allowListOnly'),
        },
        {
            value: DownloadPermission.None,
            label: localize('views.settings.downloadNftPermissions.none'),
        },
    ]

    let selected: IOption =
        options.find((option) => option.value === $activeProfile?.settings.nfts.downloadPermissions?.toString()) ||
        options[0]

    $: selected && onNftDownloadPermissionChange(selected)
    async function onNftDownloadPermissionChange(option: IOption): Promise<void> {
        const nftDownloadPermissions = option.value
        updateActiveProfileSettings({
            nfts: {
                ...$activeProfile?.settings.nfts,
                downloadPermissions: nftDownloadPermissions as DownloadPermission,
            },
        })

        const allNfts = $allAccountNfts.flatMap((nfts) => nfts)
        await addNftsToDownloadQueue(allNfts)
    }
</script>

<SettingsSection
    title={localize('views.settings.downloadNftPermissions.title')}
    description={localize('views.settings.downloadNftPermissions.description')}
>
    <div class="w-1/2">
        <SelectInput
            label={localize('views.settings.downloadNftPermissions.input')}
            bind:selected
            value={selected?.value}
            {options}
            hideValue
        />
    </div>
</SettingsSection>
