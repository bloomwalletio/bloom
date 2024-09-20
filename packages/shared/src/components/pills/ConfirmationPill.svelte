<script lang="ts">
    import { Pill } from '@bloomwalletio/ui'
    import { Activity, InclusionState } from '@core/activity'
    import { localize } from '@core/i18n'
    import { getEvmNetwork } from '@core/network/stores'
    import { getPersistedTransaction } from '@core/transactions/stores'

    export let activity: Activity

    let tooltip = ''

    function onHover(): void {
        tooltip = localize('general.loading')
        const transaction = getPersistedTransaction(activity.transactionId)
        const network = getEvmNetwork(activity?.sourceNetworkId)
        const confirmations = Math.max(
            transaction?.blockscout?.confirmations ?? 0,
            transaction?.local?.confirmations ?? 0
        )
        tooltip = `
            ${localize('general.confirmed')}: ${confirmations}\n
            ${localize('general.required')}: ${network?.blocksUntilConfirmed}
        `
    }
</script>

{#if activity.inclusionState === InclusionState.Pending}
    <div role="contentinfo" on:focus={onHover} on:mouseover={onHover}>
        <Pill color="warning" compact tooltipEvent="hover" {tooltip}>
            {localize('general.pending')}
        </Pill>
    </div>
{/if}
