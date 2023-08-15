<script lang="ts">
    import { SendFlowRouterView } from '@routes/dashboard/send-flow'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
</script>

<send-flow-popup>
    <SendFlowRouterView onTransactionSummaryMount={_onMount} />
</send-flow-popup>
