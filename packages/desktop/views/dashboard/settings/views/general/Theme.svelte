<script lang="ts">
    import { AppTheme, shouldBeDarkMode } from '@core/app'
    import { appSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { Icon, Radio, Text } from '@ui'

    let appTheme: AppTheme = $appSettings.theme

    $: $appSettings.theme = appTheme
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.theme.title')}</Text>
{#if features.app.themes.light.enabled}
    <Radio value={'light'} bind:group={appTheme} label={localize('general.lightTheme')} />
{/if}
{#if features.app.themes.dark.enabled}
    <Radio value={'dark'} bind:group={appTheme} label={localize('general.darkTheme')} />
{/if}
{#if features.app.themes.system.enabled}
    <Radio value={'system'} bind:group={appTheme} label={localize('general.systemTheme')} />
{/if}
{#if appTheme === 'system'}
    <div class="flex flex-row items-center mb-5">
        <Icon icon="info" classes="mr-3 fill-current text-black dark:text-white" />
        <Text fontSize="14" lineHeight="5">{localize('views.settings.theme.advice')}</Text>
    </div>
{/if}
