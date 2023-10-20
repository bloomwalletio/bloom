<script lang="ts">
    import { appSettings } from '@core/app/stores'
    import { SUPPORTED_LOCALES, localize, setLanguage } from '@core/i18n'
    import type { IDropdownItem } from '@core/utils'
    import features from '@features/features'
    import { Dropdown, Text } from '@ui'

    const items: IDropdownItem<string>[] = Object.entries(SUPPORTED_LOCALES)
        .filter(([key]) => features.app.translations.languages[key])
        .map(([key, value]) => ({ label: value, value: key }))

    function onLanguageChange(selected: IDropdownItem<string>): void {
        setLanguage(selected.value)
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.language.title')}</Text>
<Dropdown value={$appSettings.language} {items} sortItems={true} onSelect={onLanguageChange} enableTyping />
