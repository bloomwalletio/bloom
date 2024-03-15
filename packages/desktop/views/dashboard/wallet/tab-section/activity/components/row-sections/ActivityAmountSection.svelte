<script lang="ts">
    import {
        StardustActivity,
        StardustActivityType,
        StardustGovernanceAction,
        getFormattedAmountFromActivity,
        getFormattedVotingPowerFromGovernanceActivity,
    } from '@core/activity'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { formatCurrency, localize } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { ITokenWithBalance } from '@core/token'
    import { Text } from '@bloomwalletio/ui'
    import { selectedAccountTokens } from '@core/token/stores'

    export let activity: StardustActivity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    function getAmount(_activity: StardustActivity): string {
        if (_activity.type === StardustActivityType.Basic || _activity.type === StardustActivityType.Foundry) {
            return getFormattedAmountFromActivity(_activity)
        } else if (_activity.type === StardustActivityType.Governance) {
            const isVotingPowerActivity =
                _activity.governanceAction === StardustGovernanceAction.DecreaseVotingPower ||
                _activity.governanceAction === StardustGovernanceAction.IncreaseVotingPower

            return isVotingPowerActivity ? getFormattedVotingPowerFromGovernanceActivity(_activity) : '-'
        } else if (_activity.type === StardustActivityType.Nft) {
            return '1 ' + localize('general.nft')
        } else {
            return '-'
        }
    }

    function getFormattedMarketPrice(_activity: StardustActivity): string | undefined {
        if (
            [StardustActivityType.Basic, StardustActivityType.Governance, StardustActivityType.Foundry].includes(
                _activity.type
            ) &&
            token
        ) {
            const amount = _activity.tokenTransfer?.rawAmount ?? _activity.baseTokenTransfer.rawAmount

            const marketPrice = getFiatValueFromTokenAmount(amount, token)
            return marketPrice ? formatCurrency(marketPrice) : '-'
        } else if (_activity.type === StardustActivityType.Nft) {
            return '-'
        } else {
            return undefined
        }
    }
</script>

<div class="text-end">
    <Text>{getAmount(activity)}</Text>
    {#if getFormattedMarketPrice(activity)}
        <Text textColor="secondary">{getFormattedMarketPrice(activity)}</Text>
    {/if}
</div>
