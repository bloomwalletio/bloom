<script lang="ts">
    import { Alert, Checkbox } from '@bloomwalletio/ui'
    import { appSettings, initAppSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import SettingsSection from '../SettingsSection.svelte'
</script>

<SettingsSection
    title={localize('views.settings.crashReporting.title')}
    description={localize('views.settings.crashReporting.body')}
>
    <Checkbox
        size="lg"
        textType="base"
        label={localize('views.settings.crashReporting.checkbox')}
        bind:checked={$appSettings.sendCrashReports}
    />
    {#if $appSettings.sendCrashReports !== $initAppSettings.sendCrashReports}
        <div class="mt-6">
            <Alert
                variant="info"
                text={localize('views.settings.crashReporting.advice', {
                    sendCrashReports: $appSettings.sendCrashReports,
                })}
            />
        </div>
    {/if}
</SettingsSection>
