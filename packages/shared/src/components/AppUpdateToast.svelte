<script lang="ts">
    import { Platform } from '@core/app'
    import { appUpdateState } from '@core/app/stores'
    import { Toast, Progress } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    $: ({ busy, error, complete, progress } = $appUpdateState)
</script>

{#if complete}
    <Toast
        variant="success"
        text={localize('notifications.updateReady')}
        action={{ text: localize('actions.restart'), callback: Platform.installAppUpdate }}
        dismissible={false}
    />
{:else if error}
    <Toast variant="danger" text={localize('notifications.updateError')} />
{:else if busy}
    <Toast variant="info" text={localize('notifications.downloadingUpdate')} dismissible={false}>
        <Progress slot="content" {progress} size="sm" />
    </Toast>
{/if}
