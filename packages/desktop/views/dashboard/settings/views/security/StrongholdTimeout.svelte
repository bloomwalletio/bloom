<script lang="ts">
    import { IOption, SelectInput, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile'
    import { setStrongholdPasswordClearInterval } from '@core/profile-manager'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import { SECONDS_PER_MINUTE } from '@core/utils'

    const options: IOption[] = getStrongholdPasswordTimeoutOptions()
    let selected: IOption = options.find(
        (option) =>
            option.value === $activeProfile?.settings?.strongholdPasswordTimeoutInMinutes.toString() ??
            DEFAULT_PERSISTED_PROFILE_OBJECT.settings.strongholdPasswordTimeoutInMinutes.toString()
    )
    $: if (selected) onStrongholdPasswordTimeoutChange(selected)

    function onStrongholdPasswordTimeoutChange(option: IOption): void {
        const strongholdPasswordTimeoutInMinutes = parseInt(option.value)
        updateActiveProfileSettings({ strongholdPasswordTimeoutInMinutes })
        void setStrongholdPasswordClearInterval(strongholdPasswordTimeoutInMinutes * SECONDS_PER_MINUTE)
    }

    function assignTimeoutOptionLabel(timeInMinutes: number): string {
        if (timeInMinutes >= 60) {
            return localize('times.hour', { values: { time: timeInMinutes / 60 } })
        }

        return localize('times.minute', { values: { time: timeInMinutes } })
    }

    function getStrongholdPasswordTimeoutOptions(): IOption[] {
        return [1, 2, 5, 10, 15, 30].map((time) => ({
            value: time.toString(),
            label: assignTimeoutOptionLabel(time),
        }))
    }
</script>

<Text type="body2" class="mb-2">{localize('views.settings.strongholdTimeout.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.strongholdTimeout.description')}</Text>
<SelectInput bind:selected value={selected.value} {options} />
