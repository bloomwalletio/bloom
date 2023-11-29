<script lang="ts">
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { appSettings, updateAppSettings } from '@core/app/stores'
    import { SUPPORTED_LOCALES, localize, setLanguage } from '@core/i18n'
    import features from '@features/features'
    import SettingsSection from '../SettingsSection.svelte'

    const options: IOption[] = Object.entries(SUPPORTED_LOCALES)
        .filter(([key]) => features.app.translations.languages[key])
        .map(([key, value]) => ({ label: value, value: key }))

    let selected = options.find((item) => item.value === $appSettings.language)
    $: onLanguageChange(selected)

    function onLanguageChange(selected: IOption): void {
        if (selected && selected.value !== $appSettings.language) {
            updateAppSettings({ language: selected.value })
            setLanguage(selected.value)
        }
    }
</script>

<SettingsSection title={localize('views.settings.language.title')}>
    <div class="w-1/2">
        <SelectInput bind:selected {options} label={localize('views.settings.language.title')} hideValue />
    </div>
</SettingsSection>
