<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { resetShowInternalVerificationPopup, showInternalVerificationPopup } from '@core/ledger'
    import { LedgerStatusIllustration, LedgerIllustrationVariant } from '@ui'
    import { formatTokenAmount } from '@core/token/utils'
    import { formatHexString } from '@core/utils'
    import { onDestroy } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { IEvmNetwork } from '@core/network/interfaces'

    export let isEvmTransaction: boolean = false
    export let useBlindSigning: boolean = false

    // Regular transaction
    export let toAddress: string | undefined = undefined
    export let toAmount: bigint | undefined = undefined
    export let network: IEvmNetwork | undefined = undefined
    export let maxGasFee: bigint | undefined = undefined

    // Blindly signed transaction
    export let hash: string | undefined = undefined
    export let bipPath: string | undefined = undefined

    // EIP-192 RPC Methods
    export let rawMessage: string | undefined = undefined

    $: showTable = (!!toAddress && toAmount !== undefined) || !!hash || !!rawMessage

    const locale = getLocale()
    function getLocale(): string {
        if (rawMessage) {
            return 'verifyMessageSigning'
        } else if ($showInternalVerificationPopup) {
            return 'verifyInternalLedgerTransaction'
        } else {
            return 'verifyLedgerTransaction'
        }
    }

    onDestroy(() => {
        resetShowInternalVerificationPopup()
    })
</script>

<PopupTemplate title={localize(`popups.${locale}.title`)} description={localize(`popups.${locale}.info`)}>
    <div class="flex flex-col gap-4">
        <div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
            <LedgerStatusIllustration variant={LedgerIllustrationVariant.Hash} />
        </div>
        <div class="flex flex-col space-y-2">
            {#if showTable}
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
                            value:
                                !useBlindSigning && isEvmTransaction
                                    ? formatTokenAmount(toAmount, network?.baseToken)
                                    : undefined,
                        },
                        {
                            key: localize('general.address'),
                            value: !useBlindSigning && isEvmTransaction ? toAddress : undefined,
                            copyable: true,
                        },
                        {
                            key: localize('general.network'),
                            value: !useBlindSigning && isEvmTransaction ? network?.chainId : undefined,
                            copyable: true,
                        },
                        {
                            key: localize('general.maxFees'),
                            value:
                                !useBlindSigning && isEvmTransaction
                                    ? formatTokenAmount(maxGasFee, network?.baseToken)
                                    : undefined,
                        },
                        {
                            key: localize('general.sendTo'),
                            value: !useBlindSigning && !isEvmTransaction ? toAddress : undefined,
                            copyable: true,
                        },
                        {
                            key: localize('general.amount'),
                            value:
                                !useBlindSigning && !isEvmTransaction
                                    ? formatTokenAmount(toAmount, network?.baseToken)
                                    : undefined,
                        },
                        {
                            key: localize('general.message'),
                            value: rawMessage,
                        },
                    ]}
                />
            {:else if $showInternalVerificationPopup}
                <Alert variant="info" text={localize('popups.verifyInternalLedgerTransaction.hint')} />
            {/if}
        </div>
    </div>
</PopupTemplate>
