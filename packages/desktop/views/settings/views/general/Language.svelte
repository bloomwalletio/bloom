<script lang="ts">
    import { IOption, SelectInput, Text } from '@bloomwalletio/ui'
    import { appSettings, updateAppSettings } from '@core/app/stores'
    import { SUPPORTED_LOCALES, localize, setLanguage } from '@core/i18n'
    import features from '@features/features'

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

<Text type="body2" class="mb-6">{localize('views.settings.language.title')}</Text>
<SelectInput bind:selected {options} label={localize('views.settings.language.title')} hideValue />
