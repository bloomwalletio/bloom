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
        if (_activity.namespace === NetworkNamespace.Stardust) {
            if (_activity.type === StardustActivityType.Basic || _activity.type === StardustActivityType.Foundry) {
                const { rawAmount, tokenId } = _activity.tokenTransfer ?? _activity.baseTokenTransfer ?? {}

                return getFormattedAmountFromActivity(rawAmount, tokenId, _activity.direction, _activity.action)
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
        } else if (_activity.namespace === NetworkNamespace.Evm) {
            if (_activity.type === EvmActivityType.CoinTransfer) {
                return getFormattedAmountFromActivity(
                    _activity.baseTokenTransfer.rawAmount,
                    BASE_TOKEN_ID,
                    _activity.direction,
                    _activity.action
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
                        _activity.direction,
                        _activity.action
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
        if (_activity.namespace === NetworkNamespace.Stardust) {
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
        } else if (_activity.namespace === NetworkNamespace.Evm) {
            if (_activity.type === EvmActivityType.CoinTransfer) {
                const marketPrice = getFiatValueFromTokenAmount(_activity.baseTokenTransfer.rawAmount, token)
                return marketPrice ? formatCurrency(marketPrice) : '-'
            } else if (_activity.type === EvmActivityType.TokenTransfer) {
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
