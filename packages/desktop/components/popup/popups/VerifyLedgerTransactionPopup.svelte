<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { resetShowInternalVerificationPopup, showInternalVerificationPopup } from '@core/ledger'
    import { getBaseToken } from '@core/profile/actions'
    import { LedgerStatusIllustration, LedgerIllustrationVariant } from '@ui'
    import { formatTokenAmountBestMatch } from '@core/token/utils'
    import { formatHexString } from '@core/utils'
    import { onDestroy } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

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

<PopupTemplate title={localize(`${locale}.title`)} description={localize(`${locale}.info`)}>
    <div class="flex flex-col gap-4">
        <div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
            <LedgerStatusIllustration variant={LedgerIllustrationVariant.Hash} />
        </div>
        <div class="flex flex-col space-y-2">
            {#if hasSendConfirmationProps}
                <Table
                    orientation="vertical"
                    items={[
                        {
                            key: localize('general.hash'),
                            value: useBlindSigning ? formatHexString(hash) : undefined,
                            copyable: true,
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
                            copyable: true,
                        },
                        {
                            key: localize('general.network'),
                            value: !useBlindSigning && isEvmTransaction ? chainId : undefined,
                            copyable: true,
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
                            copyable: true,
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
    </div>
</PopupTemplate>
