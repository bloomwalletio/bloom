<script lang="ts">
    import { IOption, SelectInput, Text } from '@bloomwalletio/ui'
    import { appSettings } from '@core/app/stores'
    import { SUPPORTED_LOCALES, localize, setLanguage } from '@core/i18n'
    import features from '@features/features'

    const items: IOption[] = Object.entries(SUPPORTED_LOCALES)
        .filter(([key]) => features.app.translations.languages[key])
        .map(([key, value]) => ({ label: value, value: key }))

    let selected = items.find((item) => item.value === $appSettings.language)
    $: if (selected && selected.value !== $appSettings.language) onLanguageChange(selected)

    function onLanguageChange(selected: IOption): void {
        setLanguage(selected.value)
    }
</script>

<Text type="body2" class="mb-6">{localize('views.settings.language.title')}</Text>
<SelectInput bind:selected options={items} label={localize('views.settings.language.title')} />
