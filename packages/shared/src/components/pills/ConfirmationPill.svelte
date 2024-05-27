<script lang="ts">
    import { Color, Pill } from '@bloomwalletio/ui'
    import { Activity, InclusionState } from '@core/activity'
    import { localize } from '@core/i18n'
    import { getEvmNetwork } from '@core/network/stores'
    import { getPersistedTransaction } from '@core/transactions/stores'

    export let activity: Activity

    let text = ''
    let color: Color = 'danger'
    let tooltip = ''

    $: setConfirmationPill(activity)
    function setConfirmationPill(_activity: Activity): void {
        switch (_activity.inclusionState) {
            case InclusionState.Confirmed:
                text = localize('general.confirmed')
                color = 'success'
                break
            case InclusionState.Pending:
                text = localize('general.pending')
                color = 'warning'
                break
            default:
                text = localize('general.failed')
                color = 'danger'
        }
    }

    async function onHover(): Promise<void> {
        tooltip = 'loading...'
        const transaction = getPersistedTransaction(activity.transactionId)
        const network = getEvmNetwork(activity?.sourceNetworkId)
        const blockHeight = await network?.provider.eth.getBlockNumber()
        const confirmations = BigInt(blockHeight ?? 0) - BigInt(transaction?.local?.blockNumber ?? 0)
        tooltip = `
            ${localize('general.confirmed')}: ${confirmations}\n
            ${localize('general.required')}: ${network?.blocksUntilConfirmed}
        `
    }
</script>

<div on:mouseover={onHover}>
    <Pill {color} compact tooltipEvent="hover" {tooltip}>
        {text}
    </Pill>
</div>
