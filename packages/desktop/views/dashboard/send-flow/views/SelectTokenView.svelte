<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market/stores'
    import { sendFlowParameters, SendFlowType, setSendFlowParameters } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { IconInput, TokenAmountTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { getCoinType } from '@core/profile/actions'
    import { getNetwork } from '@core/network'
    import { AccountTokens, IToken, TokenStandard } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { getAccountTokensForSelectedAccount } from '@core/token/actions'

    let searchValue: string = ''
    let selectedToken: IToken =
        $sendFlowParameters?.type === SendFlowType.BaseCoinTransfer
            ? $sendFlowParameters.baseCoinTransfer.token
            : $sendFlowParameters?.type === SendFlowType.TokenTransfer
            ? $sendFlowParameters.tokenTransfer.token
            : $selectedAccountTokens?.[getNetwork().getMetadata().id].baseCoin

    let accountTokens: AccountTokens
    $: accountTokens = getAccountTokensForSelectedAccount($marketCoinPrices)
    $: accountTokens, searchValue, setFilteredTokenList()

    let tokenList: IToken[]
    function getTokenList(): IToken[] {
        const list = []
        for (const tokensPerNetwork of Object.values(accountTokens)) {
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

    function isVisibleToken(token: IToken): boolean {
        const _searchValue = searchValue.toLowerCase()
        const name = token?.metadata?.name
        const ticker =
            token?.metadata?.standard === TokenStandard.BaseToken ? token?.metadata.unit : token?.metadata.symbol

        return (
            (name && name.toLowerCase().includes(_searchValue)) ||
            (ticker && ticker.toLowerCase().includes(_searchValue))
        )
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
            layer2Parameters: $sendFlowParameters?.layer2Parameters,
            addSenderFeature: $sendFlowParameters?.addSenderFeature,
            disableChangeExpiration: $sendFlowParameters?.disableChangeExpiration,
            disableToggleGift: $sendFlowParameters?.disableToggleGift,
        }

        const sendFlowType =
            selectedToken.id === getCoinType() ? SendFlowType.BaseCoinTransfer : SendFlowType.TokenTransfer

        // Set called because we need to update the type, and update function only updates the properties
        // if the type is the same
        setSendFlowParameters({
            ...previousSharedParameters,
            type: sendFlowType,
            [sendFlowType === SendFlowType.BaseCoinTransfer ? 'baseCoinTransfer' : 'tokenTransfer']: {
                token: selectedToken,
            },
        })

        $sendFlowRouter.next()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectToken')}
    leftButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    rightButton={{ text: localize('actions.continue'), onClick: onContinueClick, disabled: !selectedToken }}
>
    <IconInput bind:value={searchValue} icon={IconEnum.Search} placeholder={localize('general.search')} />
    <div class="-mr-3">
        <div class="token-list w-full flex flex-col -mr-1 pr-1.5 gap-2">
            {#each tokenList as token}
                <TokenAmountTile
                    {token}
                    amount={token.balance.available}
                    onClick={() => (selectedToken = token)}
                    selected={selectedToken?.id === token.id && selectedToken?.chainId === token?.chainId}
                />
            {/each}
        </div>
    </div>
</SendFlowTemplate>

<style lang="scss">
    .token-list {
        max-height: 400px;
        overflow-y: scroll;
    }
</style>
