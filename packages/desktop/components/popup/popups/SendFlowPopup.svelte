<script lang="ts">
    import { EvmTransactionData } from '@core/layer-2/types'
    import { Output } from '@core/wallet/types'
    import { SendFlowRouterView } from '@views/dashboard/send-flow'

    export let _onMount: (..._: any[]) => Promise<void> = undefined
    export let preparedOutput: Output | undefined = undefined
    export let preparedTransaction: EvmTransactionData | undefined = undefined

    const transactionSummaryProps = { _onMount, preparedOutput, preparedTransaction }
</script>

<send-flow-popup>
    <SendFlowRouterView {transactionSummaryProps} />
</send-flow-popup>
