<script lang="ts">
    import { KeyValueBox, Text, TextHint, LedgerAnimation } from '@ui'
    import { localize } from '@core/i18n'
    import { formatHexString } from '@core/utils'
    import { onDestroy } from 'svelte'
    import { showInternalVerificationPopup, resetShowInternalVerificationPopup } from '@core/ledger'

    export let isEvmTransaction: boolean
    export let useBlindSigning: boolean

    // Regular transaction
    export let toAddress: string
    export let toAmount: string
    export let chainId: string
    export let maxFees: string

    // Blindly signed transaction
    export let hash: string
    export let bipPath: string

    const hasSendConfirmationProps = (toAddress && toAmount) || hash

    const locale = $showInternalVerificationPopup
        ? 'popups.verifyInternalLedgerTransaction'
        : 'popups.verifyLedgerTransaction'

    onDestroy(() => {
        resetShowInternalVerificationPopup()
    })
</script>

<Text type="h4" classes="mb-4">{localize(`${locale}.title`)}</Text>
<Text type="p" classes="mb-4" secondary>{localize(`${locale}.info`)}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <LedgerAnimation animation="ledger-confirm-prompt-desktop" />
</div>
<div class="flex flex-col space-y-2">
    {#if hasSendConfirmationProps}
        {#if useBlindSigning}
            <KeyValueBox keyText={localize('general.hash')} valueText={formatHexString(hash)} />
            {#if bipPath}
                <KeyValueBox keyText={localize('general.bipPath')} valueText={bipPath} />
            {/if}
        {:else if isEvmTransaction}
            <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
            <KeyValueBox keyText={localize('general.address')} valueText={toAddress} />
            <KeyValueBox keyText={localize('general.network')} valueText={chainId} />
            <KeyValueBox keyText={localize('general.maxFees')} valueText={maxFees} />
        {:else}
            <KeyValueBox keyText={localize('general.sendTo')} valueText={toAddress} />
            <KeyValueBox keyText={localize('general.amount')} valueText={toAmount} />
        {/if}
    {:else if $showInternalVerificationPopup}
        <TextHint info text={localize('popups.verifyInternalLedgerTransaction.hint')} />
    {/if}
</div>
