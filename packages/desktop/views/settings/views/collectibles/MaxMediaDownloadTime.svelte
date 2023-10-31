<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'

    const options: IOption[] = [30, 60, 90, 120, 150, 180].map((amount) => ({
        value: amount.toString(),
        label: assignMaxMediaDownloadTimeOptionLabel(amount),
    }))
    let selected: IOption = options.find(
        (option) => option.value === $activeProfile?.settings.maxMediaDownloadTimeInSeconds?.toString()
    )

    $: onMaxMediaDownloadTimeChange(selected)
    function onMaxMediaDownloadTimeChange(option: IOption | undefined): void {
        if (option) {
            const maxMediaDownloadTimeInSeconds = parseInt(option.value)
            updateActiveProfileSettings({ maxMediaDownloadTimeInSeconds })
        }
    }

    function assignMaxMediaDownloadTimeOptionLabel(amount: number): string {
        return amount ? localize('times.second', { values: { time: amount } }) : localize('general.none')
    }
</script>

<SettingsSection
    title={localize('views.settings.maxMediaDownloadTime.title')}
    description={localize('views.settings.maxMediaDownloadTime.description')}
>
    <div class="w-1/2">
        <SelectInput
            label={localize('views.settings.maxMediaDownloadTime.input')}
            bind:selected
            value={selected.value}
            {options}
            hideValue
        />
    </div>
</SettingsSection>
