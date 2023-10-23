<script lang="ts">
    import { Alert, IOption, RadioGroup, Text } from '@bloomwalletio/ui'
    import { AppTheme, shouldBeDarkMode } from '@core/app'
    import { appSettings, updateAppSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import features from '@features/features'

    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)

    const options: IOption[] = [
        ...(features.app.themes.light.enabled
            ? [{ value: AppTheme.Light, label: localize('general.lightTheme') }]
            : []),
        ...(features.app.themes.dark.enabled ? [{ value: AppTheme.Dark, label: localize('general.darkTheme') }] : []),
        ...(features.app.themes.system.enabled
            ? [{ value: AppTheme.System, label: localize('general.systemTheme') }]
            : []),
    ]

    let selected: string = options.find((option) => option.value === $appSettings.theme)?.value ?? AppTheme.Light
    $: if (selected && selected !== $appSettings.theme) updateAppSettings({ theme: selected as AppTheme })
</script>

<Text type="body2" class="mb-6">{localize('views.settings.theme.title')}</Text>
<RadioGroup bind:selected {options} />
{#if selected === AppTheme.System}
    <div class="mt-6">
        <Alert text={localize('views.settings.theme.advice')} />
    </div>
{/if}
