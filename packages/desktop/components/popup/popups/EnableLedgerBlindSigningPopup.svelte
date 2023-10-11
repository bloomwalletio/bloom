<script lang="ts">
    import { onDestroy } from 'svelte'
    import { Alert, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, ledgerDeviceState } from '@core/ledger'
    import { UiEventFunction } from '@core/utils'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let appName: LedgerAppName
    export let onEnabled: UiEventFunction = () => {}
    export let onClose: UiEventFunction = () => {}

    const STEPS = [1, 2, 3, 4]

    $: if ($ledgerDeviceState && $ledgerDeviceState.settings[appName]?.blindSigningEnabled) {
        closePopup(true)
        onEnabled && onEnabled()
    }

    onDestroy(() => {
        onClose && onClose()
    })
</script>

<PopupTemplate title={localize('popups.enableLedgerBlindSigning.title')}>
    <div class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
        <Alert variant="warning" text={localize('popups.enableLedgerBlindSigning.info')} />
        {#each STEPS as step}
            <Text textColor="secondary">
                {step}. {localize(`popups.enableLedgerBlindSigning.step_${step}`, { appName })}
            </Text>
        {/each}
    </div>
</PopupTemplate>
