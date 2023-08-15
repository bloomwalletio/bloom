<script lang="ts">
    import { localize } from '@core/i18n'
    import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import type { IDropdownItem } from '@core/utils'
    import { Dropdown, Text } from '@ui'

    function onLockScreenTimeoutChange(option: IDropdownItem<number>): void {
        updateActiveProfileSettings({ lockScreenTimeoutInMinutes: option.value })
    }

    function assignTimeoutOptionLabel(timeInMinutes: number): string {
        if (timeInMinutes >= 60) {
            return localize('times.hour', { values: { time: timeInMinutes / 60 } })
        }

        return localize('times.minute', { values: { time: timeInMinutes } })
    }

    function lockScreenTimeoutOptions(): IDropdownItem<number>[] {
        return [1, 5, 10, 30, 60].map((time) => ({
            value: time,
            label: assignTimeoutOptionLabel(time),
        }))
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.appLock.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.appLock.description')}</Text>
<Dropdown
    value={$activeProfile?.settings?.lockScreenTimeoutInMinutes ??
        DEFAULT_PERSISTED_PROFILE_OBJECT.settings.lockScreenTimeoutInMinutes}
    items={lockScreenTimeoutOptions()}
    onSelect={onLockScreenTimeoutChange}
/>
