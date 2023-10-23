<script lang="ts">
    import { Alert, IOption, RadioGroup, Text } from '@bloomwalletio/ui'
    import { AppTheme, shouldBeDarkMode } from '@core/app'
    import { appSettings, updateAppSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import features from '@features/features'

    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)

    const options: IOption[] = [
        { value: AppTheme.Light, label: localize('general.lightTheme') },
        { value: AppTheme.Dark, label: localize('general.darkTheme') },
        ...(features.app.themes.system.enabled
            ? [{ value: AppTheme.System, label: localize('general.systemTheme') }]
            : []),
    ]

    const selected: IOption = options.find((option) => option.value === $appSettings.theme)
    $: if (selected && selected.value !== $appSettings.theme) {
        updateAppSettings({ theme: selected.value as AppTheme })
    }
</script>

<Text type="body2" class="mb-6">{localize('views.settings.theme.title')}</Text>
<RadioGroup selected={selected.value} {options} />
{#if selected.value === AppTheme.System}
    <div class="mt-6">
        <Alert text={localize('views.settings.theme.advice')} />
    </div>
{/if}
