<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile'
    import { setStrongholdPasswordClearInterval } from '@core/profile-manager'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import { SECONDS_PER_MINUTE } from '@core/utils'
    import SettingsSection from '../SettingsSection.svelte'

    const options: IOption[] = getStrongholdPasswordTimeoutOptions()
    let selected: IOption | undefined = options.find(
        (option) =>
            option.value ===
            ($activeProfile?.settings?.strongholdPasswordTimeoutInMinutes.toString() ??
                DEFAULT_PERSISTED_PROFILE_OBJECT.settings.strongholdPasswordTimeoutInMinutes.toString())
    )
    $: onStrongholdPasswordTimeoutChange(selected)

    function onStrongholdPasswordTimeoutChange(option: IOption | undefined): void {
        if (option) {
            const strongholdPasswordTimeoutInMinutes = parseInt(option.value)
            updateActiveProfileSettings({ strongholdPasswordTimeoutInMinutes })
            void setStrongholdPasswordClearInterval(strongholdPasswordTimeoutInMinutes * SECONDS_PER_MINUTE)
        }
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

<SettingsSection
    title={localize('views.settings.strongholdTimeout.title')}
    description={localize('views.settings.strongholdTimeout.description')}
>
    <div class="w-1/2">
        <SelectInput
            label={localize('views.settings.strongholdTimeout.title')}
            bind:selected
            value={selected?.value}
            {options}
            hideValue
        />
    </div>
</SettingsSection>
