<script lang="ts">
    import { onDestroy } from 'svelte'
    import { LedgerAnimation, Text, TextType } from '@ui'
    import { Alert, Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { resetShowInternalVerificationPopup, showInternalVerificationPopup } from '@core/ledger'
    import { getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token/utils'
    import { formatHexString } from '@core/utils'

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

    $: hasSendConfirmationProps = (toAddress !== undefined && toAmount !== undefined) || hash !== undefined

    $: locale = $showInternalVerificationPopup
        ? 'popups.verifyInternalLedgerTransaction'
        : 'popups.verifyLedgerTransaction'

    onDestroy(() => {
        resetShowInternalVerificationPopup()
    })
</script>

<Text type={TextType.h4} classes="mb-4">{localize(`${locale}.title`)}</Text>
<Text type={TextType.p} classes="mb-4" secondary>{localize(`${locale}.info`)}</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <LedgerAnimation animation="ledger-confirm-prompt-desktop" />
</div>
<div class="flex flex-col space-y-2">
    {#if hasSendConfirmationProps}
        <Table
            items={[
                {
                    key: localize('general.hash'),
                    value: useBlindSigning ? formatHexString(hash) : undefined,
                },
                {
                    key: localize('general.bipPath'),
                    value: useBlindSigning && bipPath ? bipPath : undefined,
                },
                {
                    key: localize('general.amount'),
                    value: !useBlindSigning && isEvmTransaction ? toAmount : undefined,
                },
                {
                    key: localize('general.address'),
                    value: !useBlindSigning && isEvmTransaction ? toAddress : undefined,
                },
                {
                    key: localize('general.network'),
                    value: !useBlindSigning && isEvmTransaction ? chainId : undefined,
                },
                {
                    key: localize('general.maxFees'),
                    value:
                        !useBlindSigning && isEvmTransaction
                            ? formatTokenAmountBestMatch(Number(maxGasFee), getBaseToken())
                            : undefined,
                },
                {
                    key: localize('general.sendTo'),
                    value: !useBlindSigning && !isEvmTransaction ? toAddress : undefined,
                },
                {
                    key: localize('general.amount'),
                    value: !useBlindSigning && !isEvmTransaction ? toAmount : undefined,
                },
            ]}
        />
    {:else if $showInternalVerificationPopup}
        <Alert variant="info" text={localize('popups.verifyInternalLedgerTransaction.hint')} />
    {/if}
</div>
