<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, ledgerDeviceState } from '@core/ledger'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Text, TextType } from '@ui'
    import { UiEventFunction } from 'shared/src/lib/core/utils'

    export let appName: LedgerAppName
    export let onEnabled: UiEventFunction = () => {}

    const STEPS = [1, 2, 3, 4]

    $: if ($ledgerDeviceState && $ledgerDeviceState.settings[appName]?.blindSigningEnabled) {
        closePopup(true)
        onEnabled && onEnabled()
    }
</script>

<Text type={TextType.h3} classes="mb-6">{localize('popups.enableLedgerBlindSigning.title')}</Text>

<div class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
    <Alert variant="warning" text={localize('popups.enableLedgerBlindSigning.info')} />
    <div>
        {#each STEPS as step}
            <Text type={TextType.p} fontSize="15" color="gray-600" classes="my-2">
                {#if step === 2}
                    {step}. {localize(`popups.enableLedgerBlindSigning.step_${step}`, { appName })}
                {:else}
                    {step}. {localize(`popups.enableLedgerBlindSigning.step_${step}`)}
                {/if}
            </Text>
        {/each}
    </div>
</div>
