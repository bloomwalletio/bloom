<script lang="ts">
    import {
        Activity,
        StardustActivityType,
        StardustGovernanceAction,
        getFormattedAmountFromActivity,
        getFormattedVotingPowerFromGovernanceActivity,
        isEvmTokenActivity,
    } from '@core/activity'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { formatCurrency, localize } from '@core/i18n'
    import { getFiatValueFromTokenAmount } from '@core/market/actions'
    import { BASE_TOKEN_ID, ITokenWithBalance, TokenStandard } from '@core/token'
    import { Text } from '@bloomwalletio/ui'
    import { selectedAccountTokens } from '@core/token/stores'
    import { NetworkNamespace } from '@core/network'
    import { EvmActivityType } from '@core/activity/enums/evm'
    import { NftStandard } from '@core/nfts'

    export let activity: Activity

    let token: ITokenWithBalance | undefined
    $: $selectedAccountTokens, (token = getTokenFromActivity(activity))

    function getAmount(_activity: Activity): string {
        const { type, namespace, sourceNetworkId, direction, action } = _activity

        if (namespace === NetworkNamespace.Stardust) {
            if (type === StardustActivityType.Basic || type === StardustActivityType.Foundry) {
                const { rawAmount, tokenId } = _activity.tokenTransfer ?? _activity.baseTokenTransfer ?? {}

                return getFormattedAmountFromActivity(rawAmount, tokenId, sourceNetworkId, direction, action)
            } else if (type === StardustActivityType.Governance) {
                const isVotingPowerActivity =
                    _activity.governanceAction === StardustGovernanceAction.DecreaseVotingPower ||
                    _activity.governanceAction === StardustGovernanceAction.IncreaseVotingPower

                return isVotingPowerActivity ? getFormattedVotingPowerFromGovernanceActivity(_activity) : '-'
            } else if (type === StardustActivityType.Nft) {
                return '1 ' + localize('general.nft')
            } else {
                return '-'
            }
        } else if (namespace === NetworkNamespace.Evm) {
            if (type === EvmActivityType.CoinTransfer) {
                return getFormattedAmountFromActivity(
                    _activity.baseTokenTransfer.rawAmount,
                    BASE_TOKEN_ID,
                    sourceNetworkId,
                    direction,
                    action
                )
            } else if (isEvmTokenActivity(_activity)) {
                if (
                    _activity.tokenTransfer?.standard === NftStandard.Erc721 ||
                    _activity.tokenTransfer?.standard === NftStandard.Irc27
                ) {
                    return '1 ' + localize('general.nft')
                } else {
                    return getFormattedAmountFromActivity(
                        _activity.tokenTransfer.rawAmount,
                        _activity.tokenTransfer.tokenId,
                        sourceNetworkId,
                        direction,
                        action
                    )
                }
            } else {
                return '-'
            }
        } else {
            return '-'
        }
    }

    function getFormattedMarketPrice(_activity: Activity): string | undefined {
        const { type, namespace } = _activity

        if (namespace === NetworkNamespace.Stardust) {
            if (
                [StardustActivityType.Basic, StardustActivityType.Governance, StardustActivityType.Foundry].includes(
                    type
                ) &&
                token
            ) {
                const amount = _activity.tokenTransfer?.rawAmount ?? _activity.baseTokenTransfer.rawAmount

                const marketPrice = getFiatValueFromTokenAmount(amount, token)
                return marketPrice ? formatCurrency(marketPrice) : '-'
            } else if (type === StardustActivityType.Nft) {
                return '-'
            } else {
                return undefined
            }
        } else if (namespace === NetworkNamespace.Evm) {
            if (type === EvmActivityType.CoinTransfer) {
                const marketPrice = getFiatValueFromTokenAmount(_activity.baseTokenTransfer.rawAmount, token)
                return marketPrice ? formatCurrency(marketPrice) : '-'
            } else if (type === EvmActivityType.TokenTransfer) {
                if (
                    _activity.tokenTransfer?.standard === TokenStandard.Erc20 ||
                    _activity.tokenTransfer?.standard === TokenStandard.Irc30
                ) {
                    const amount = _activity.tokenTransfer.rawAmount

                    const marketPrice = getFiatValueFromTokenAmount(amount, token)
                    return marketPrice ? formatCurrency(marketPrice) : '-'
                } else {
                    return '-'
                }
            } else {
                return '-'
            }
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
