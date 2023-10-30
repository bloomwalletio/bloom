<script lang="ts">
    import { Alert, Checkbox, Text } from '@bloomwalletio/ui'
    import { appSettings, initAppSettings } from '@core/app/stores'
    import { localize } from '@core/i18n'
</script>

<Text type="body2" class="mb-2">{localize('views.settings.crashReporting.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.crashReporting.body')}</Text>
<Checkbox
    size="lg"
    textType="base"
    label={localize('views.settings.crashReporting.checkbox')}
    bind:checked={$appSettings.sendCrashReports}
/>
{#if $appSettings.sendCrashReports !== $initAppSettings.sendCrashReports}
    <div class="mt-6">
        <Alert
            text={localize('views.settings.crashReporting.advice', { sendCrashReports: $appSettings.sendCrashReports })}
        />
    </div>
{/if}
