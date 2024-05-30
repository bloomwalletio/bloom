<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'

    const options: IOption[] = getLockScreenTimeoutOptions()
    let selected: IOption =
        options.find(
            (option) =>
                option.value ===
                ($activeProfile?.settings?.lockScreenTimeoutInMinutes.toString() ??
                    DEFAULT_PERSISTED_PROFILE_OBJECT.settings.lockScreenTimeoutInMinutes.toString())
        ) ?? options[0]
    $: onLockScreenTimeoutChange(selected)

    function onLockScreenTimeoutChange(option: IOption): void {
        if (option) {
            updateActiveProfileSettings({ lockScreenTimeoutInMinutes: parseInt(option.value) })
        }
    }

    function assignTimeoutOptionLabel(timeInMinutes: number): string {
        if (timeInMinutes >= 60) {
            return localize('times.hour', { values: { time: timeInMinutes / 60 } })
        }

        return localize('times.minute', { values: { time: timeInMinutes } })
    }

    function getLockScreenTimeoutOptions(): IOption[] {
        return [1, 5, 10, 30, 60].map((time) => ({
            value: time.toString(),
            label: assignTimeoutOptionLabel(time),
        }))
    }
</script>

<SettingsSection
    title={localize('views.settings.autoLogout.title')}
    description={localize('views.settings.autoLogout.description')}
>
    <div class="w-1/2">
        <SelectInput
            label={localize('views.settings.autoLogout.title')}
            bind:selected
            value={selected.value}
            {options}
            hideValue
        />
    </div>
</SettingsSection>
