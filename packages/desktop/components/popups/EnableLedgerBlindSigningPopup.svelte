<script lang="ts">
    import { onDestroy } from 'svelte'
    import { Text, TextType } from '@ui'
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, ledgerDeviceState } from '@core/ledger'
    import { UiEventFunction } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'

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

<Text type={TextType.h3} classes="mb-6">{localize('popups.enableLedgerBlindSigning.title')}</Text>

<div class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
    <Alert variant="warning" text={localize('popups.enableLedgerBlindSigning.info')} />
    {#each STEPS as step}
        <Text type={TextType.p} fontSize="15" color="gray-600">
            {step}. {localize(`popups.enableLedgerBlindSigning.step_${step}`, { appName })}
        </Text>
    {/each}
</div>
