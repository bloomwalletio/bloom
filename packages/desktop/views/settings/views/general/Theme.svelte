<script lang="ts">
    import { Alert, IOption, RadioGroup } from '@bloomwalletio/ui'
    import { AppTheme, shouldBeDarkMode } from '@core/app'
    import { appSettings, updateAppSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import SettingsSection from '../SettingsSection.svelte'

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
    $: updateAppTheme(selected)

    function updateAppTheme(option: string | undefined): void {
        if (option) {
            updateAppSettings({ theme: option as AppTheme })
        }
    }
</script>

<SettingsSection title={localize('views.settings.theme.title')}>
    <RadioGroup bind:selected {options} />
    {#if selected === AppTheme.System}
        <div class="mt-6">
            <Alert text={localize('views.settings.theme.advice')} />
        </div>
    {/if}
</SettingsSection>
