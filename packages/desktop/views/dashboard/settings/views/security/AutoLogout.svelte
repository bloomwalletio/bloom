<script lang="ts">
    import { IOption, SelectInput, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'

    const options: IOption[] = getLockScreenTimeoutOptions()
    let selected: IOption = options.find(
        (option) =>
            option.value === $activeProfile?.settings?.lockScreenTimeoutInMinutes.toString() ??
            DEFAULT_PERSISTED_PROFILE_OBJECT.settings.lockScreenTimeoutInMinutes.toString()
    )
    $: if (selected) onLockScreenTimeoutChange(selected)

    function onLockScreenTimeoutChange(option: IOption): void {
        updateActiveProfileSettings({ lockScreenTimeoutInMinutes: parseInt(option.value) })
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

<Text type="body2" class="mb-2">{localize('views.settings.autoLogout.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.autoLogout.description')}</Text>
<SelectInput bind:selected value={selected.value} {options} />
