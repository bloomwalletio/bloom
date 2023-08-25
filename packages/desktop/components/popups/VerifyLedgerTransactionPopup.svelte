<script lang="ts">
    import { type IItems, Table } from '@bloomwalletio/ui'
    import { Text, TextHint, LedgerAnimation } from '@ui'
    import { localize } from '@core/i18n'
    import { formatHexString } from '@core/utils'
    import { onDestroy } from 'svelte'
    import { showInternalVerificationPopup, resetShowInternalVerificationPopup } from '@core/ledger'
    import { formatTokenAmountBestMatch } from '@core/token/utils'
    import { getBaseToken } from '@core/profile/actions'

    export let isEvmTransaction: boolean
    export let useBlindSigning: boolean

    // Regular transaction
    export let toAddress: string
    export let toAmount: string
    export let chainId: string
    export let maxGasFee: string

    // Blindly signed transaction
    export let hash: string
    export let bipPath: string

    const hasSendConfirmationProps = (toAddress && toAmount) || hash

    const locale = $showInternalVerificationPopup
        ? 'popups.verifyInternalLedgerTransaction'
        : 'popups.verifyLedgerTransaction'

    let items: IItems[] = []
    $: hasSendConfirmationProps
        ? (items = [
              ...(useBlindSigning ? [{ key: localize('general.hash'), value: formatHexString(hash) }] : []),
              ...(useBlindSigning && bipPath ? [{ key: localize('general.bipPath'), value: bipPath }] : []),
              ...(!useBlindSigning && isEvmTransaction
                  ? [
                        { key: localize('general.amount'), value: toAmount },
                        { key: localize('general.address'), value: toAddress },
                        { key: localize('general.network'), value: chainId },
                        {
                            key: localize('general.maxFees'),
                            value: formatTokenAmountBestMatch(Number(maxGasFee), getBaseToken()),
                        },
                    ]
                  : []),
              ...(!useBlindSigning && !isEvmTransaction
                  ? [
                        { key: localize('general.sendTo'), value: toAddress },
                        { key: localize('general.amount'), value: toAmount },
                    ]
                  : []),
          ])
        : (items = [])

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
    {#if items.length > 0}
        <Table {items} />
    {:else if $showInternalVerificationPopup}
        <TextHint info text={localize('popups.verifyInternalLedgerTransaction.hint')} />
    {/if}
</div>
