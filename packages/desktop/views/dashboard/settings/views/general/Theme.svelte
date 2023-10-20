<script lang="ts">
    import { Alert, IOption, RadioGroup, Text } from '@bloomwalletio/ui'
    import { AppTheme, shouldBeDarkMode } from '@core/app'
    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import features from '@features/features'

    const appTheme: AppTheme = $appSettings.theme

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)

    const options: IOption[] = [
        { value: 'light', label: localize('general.lightTheme') },
        { value: 'dark', label: localize('general.darkTheme') },
        ...(features.app.themes.system.enabled ? [{ value: 'system', label: localize('general.systemTheme') }] : []),
    ]

    const selected: IOption = options.find((option) => option.value === $appSettings.theme)
</script>

<Text type="body2" class="mb-6">{localize('views.settings.theme.title')}</Text>
<RadioGroup selectedValue={selected.value} {options} />
{#if appTheme === 'system'}
    <div class="mt-6">
        <Alert text={localize('views.settings.theme.advice')} />
    </div>
{/if}
