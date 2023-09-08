<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Alert } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { canAccountMakeEvmTransaction, pollEvmChainGasPrice } from '@core/layer-2/actions'
    import { marketCoinPrices } from '@core/market/stores'
    import { NetworkId, getNetwork, isEvmChain } from '@core/network'
    import {
        AccountTokens,
        BASE_TOKEN_ID,
        IAccountTokensPerNetwork,
        IToken,
        ITokenWithBalance,
        TokenStandard,
    } from '@core/token'
    import { getAccountTokensForSelectedAccount, getTokenBalance } from '@core/token/actions'
    import { selectedAccountTokens } from '@core/token/stores'
    import { SendFlowType, sendFlowParameters, setSendFlowParameters } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { IconInput, TokenAmountTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let searchValue: string = ''
    let selectedToken: IToken =
        $sendFlowParameters?.type === SendFlowType.BaseCoinTransfer && $sendFlowParameters.baseCoinTransfer?.token
            ? $sendFlowParameters.baseCoinTransfer.token
            : $sendFlowParameters?.type === SendFlowType.TokenTransfer && $sendFlowParameters.tokenTransfer?.token
            ? $sendFlowParameters.tokenTransfer.token
            : $selectedAccountTokens?.[getNetwork().getMetadata().id].baseCoin

    let accountTokens: AccountTokens
    $: accountTokens = getAccountTokensForSelectedAccount($marketCoinPrices)
    $: accountTokens, searchValue, setFilteredTokenList()

    let hasTokenError: boolean = false
    $: if (isEvmChain(selectedToken?.networkId)) {
        hasTokenError = !canAccountMakeEvmTransaction(
            $selectedAccountIndex,
            selectedToken.networkId,
            $sendFlowParameters?.type
        )
    } else {
        hasTokenError = false
    }

    let tokenList: ITokenWithBalance[]
    function getTokenList(): ITokenWithBalance[] {
        const list = []
        for (const [networkId, tokensPerNetwork] of Object.entries(accountTokens) as [
            NetworkId,
            IAccountTokensPerNetwork,
        ][]) {
            if (isEvmChain(networkId)) {
                pollEvmChainGasPrice(networkId)
            }

            if (tokensPerNetwork?.baseCoin) {
                list.push(tokensPerNetwork.baseCoin)
            }
            list.push(...(tokensPerNetwork?.nativeTokens ?? []))
        }
        return list
    }

    function setFilteredTokenList(): void {
        const list = getTokenList()

        tokenList = list.filter(isVisibleToken)
        if (!tokenList.some((token) => token.id === selectedToken?.id)) {
            selectedToken = undefined
        }
    }

    function isVisibleToken(token: ITokenWithBalance): boolean {
        const _searchValue = searchValue.toLowerCase()
        const name = token?.metadata?.name
        const ticker =
            token?.metadata?.standard === TokenStandard.BaseToken ? token?.metadata.unit : token?.metadata.symbol

        return (
            (name && name.toLowerCase().includes(_searchValue)) ||
            (ticker && ticker.toLowerCase().includes(_searchValue))
        )
    }

    function onTokenClick(token: ITokenWithBalance): void {
        try {
            selectedToken = token
        } catch (err) {
            handleError(err)
        }
    }

    function onCancelClick(): void {
        $sendFlowRouter.reset()
        closePopup()
    }

    function onContinueClick(): void {
        // Store previous parameters as sometimes we enter this flow with parameters already set
        // Such as recipient when coming from address book or when we click back in the flow
        const previousSharedParameters = {
            recipient: $sendFlowParameters?.recipient,
            tag: $sendFlowParameters?.tag,
            metadata: $sendFlowParameters?.metadata,
            expirationDate: $sendFlowParameters?.expirationDate,
            timelockDate: $sendFlowParameters?.timelockDate,
            giftStorageDeposit: $sendFlowParameters?.giftStorageDeposit,
            destinationNetworkId: $sendFlowParameters?.destinationNetworkId,
            addSenderFeature: $sendFlowParameters?.addSenderFeature,
            disableChangeExpiration: $sendFlowParameters?.disableChangeExpiration,
            disableToggleGift: $sendFlowParameters?.disableToggleGift,
        }

        const sendFlowType =
            selectedToken.id === BASE_TOKEN_ID ? SendFlowType.BaseCoinTransfer : SendFlowType.TokenTransfer

        // Set called because we need to update the type, and update function only updates the properties
        // if the type is the same
        setSendFlowParameters({
            ...previousSharedParameters,
            type: sendFlowType,
            [sendFlowType]: {
                token: selectedToken,
            },
        })

        $sendFlowRouter.next()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectToken')}
    leftButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    rightButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: !selectedToken || hasTokenError,
    }}
>
    <IconInput bind:value={searchValue} icon={IconEnum.Search} placeholder={localize('general.search')} />
    <div class="-mr-3">
        <div class="token-list w-full flex flex-col -mr-1 pr-1.5 gap-2">
            {#each tokenList as token}
                <TokenAmountTile
                    {token}
                    amount={getTokenBalance(token.id, token.networkId)?.available}
                    hasError={token === selectedToken && hasTokenError}
                    onClick={() => onTokenClick(token)}
                    selected={selectedToken?.id === token.id && selectedToken?.networkId === token?.networkId}
                />
            {/each}
        </div>
    </div>
    {#if hasTokenError}
        <Alert variant="danger" text={localize('error.send.insufficientFundsGasFee')} />
    {/if}
</SendFlowTemplate>

<style lang="scss">
    .token-list {
        max-height: 400px;
        overflow-y: scroll;
    }
</style>
