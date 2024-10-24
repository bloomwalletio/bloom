<script lang="ts">
    import { Alert, SelectInput } from '@bloomwalletio/ui'
    import { PopupTemplate } from '@components'
    import { selectedAccountIndex } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { canAccountMakeEvmTransaction } from '@core/layer-2/actions'
    import {
        IEvmNetwork,
        canAccountMakeStardustTransaction,
        getActiveNetworkId,
        getEvmNetwork,
        isEvmNetwork,
        isStardustNetwork,
        networks,
    } from '@core/network'
    import { BASE_TOKEN_ID, IToken, ITokenWithBalance, TokenStandard } from '@core/token'
    import { getTokenBalance } from '@core/token/actions'
    import { selectedAccountTokens } from '@core/token/stores'
    import { SendFlowType, sendFlowParameters, setSendFlowParameters } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { SearchInput, TokenAmountTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'

    let searchValue: string = ''

    let selectedToken: IToken | undefined =
        $sendFlowParameters?.type === SendFlowType.BaseCoinTransfer && $sendFlowParameters.baseCoinTransfer?.token
            ? $sendFlowParameters.baseCoinTransfer.token
            : $sendFlowParameters?.type === SendFlowType.TokenTransfer && $sendFlowParameters.tokenTransfer?.token
              ? $sendFlowParameters.tokenTransfer.token
              : $selectedAccountTokens?.[getActiveNetworkId()]?.baseCoin

    $: $selectedAccountTokens, searchValue, selectedOption, setFilteredTokenList()

    let tokenError = ''
    $: selectedToken, $sendFlowParameters, void setTokenError()
    async function setTokenError(): Promise<void> {
        let hasEnoughFunds = true
        if (selectedToken && isEvmNetwork(selectedToken.networkId)) {
            const network = getEvmNetwork(selectedToken.networkId) as IEvmNetwork
            hasEnoughFunds = await canAccountMakeEvmTransaction(
                $selectedAccountIndex,
                network,
                $sendFlowParameters?.type
            )
        } else if (selectedToken && isStardustNetwork(selectedToken.networkId)) {
            hasEnoughFunds = canAccountMakeStardustTransaction($selectedAccountIndex, $sendFlowParameters?.type)
        }

        tokenError = hasEnoughFunds ? '' : localize('error.send.insufficientFundsTransaction')
    }

    const options = [
        { key: 'all', value: localize('popups.transaction.allNetworks') },
        ...($networks?.map((network) => ({ key: network.id, value: network.name })) ?? []),
    ]
    let selectedOption = options[0]

    let tokenList: ITokenWithBalance[]
    function getSortedTokenForAllNetworks(): ITokenWithBalance[] {
        const baseCoins: ITokenWithBalance[] = []
        const nativeTokens: ITokenWithBalance[] = []
        for (const networkTokens of Object.values($selectedAccountTokens)) {
            if (networkTokens?.baseCoin) {
                baseCoins.push(networkTokens.baseCoin)
            }
            nativeTokens.push(...(networkTokens?.nativeTokens ?? []))
        }
        return [
            ...baseCoins,
            ...nativeTokens.sort((a, b) => {
                const nameA = a.metadata?.name.toLowerCase() ?? ''
                const nameB = b.metadata?.name.toLowerCase() ?? ''
                return nameA.localeCompare(nameB)
            }),
        ]
    }

    function setFilteredTokenList(): void {
        const sortedTokens = getSortedTokenForAllNetworks()

        tokenList = sortedTokens.filter(isVisibleToken)
        if (!tokenList.some((token) => token.id === selectedToken?.id)) {
            selectedToken = undefined
        }
    }

    function isVisibleToken(token: ITokenWithBalance): boolean {
        const _searchValue = searchValue.toLowerCase()
        const name = token?.metadata?.name
        const ticker =
            token?.metadata?.standard === TokenStandard.BaseToken ? token?.metadata.unit : token?.metadata?.symbol

        const visibleNetwork = selectedOption.key === 'all' || selectedOption.key === token.networkId

        if (_searchValue) {
            return (
                visibleNetwork &&
                !!(
                    (name && name.toLowerCase().includes(_searchValue)) ||
                    (ticker && ticker.toLowerCase().includes(_searchValue))
                )
            )
        } else {
            return visibleNetwork
        }
    }

    function onTokenClick(token: ITokenWithBalance): void {
        try {
            if (token === selectedToken && !tokenError) {
                onContinueClick()
            } else {
                selectedToken = token
            }
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
            disableChangeTimelock: $sendFlowParameters?.disableChangeTimelock,
            disableToggleGift: $sendFlowParameters?.disableToggleGift,
        }

        const sendFlowType =
            selectedToken?.id === BASE_TOKEN_ID ? SendFlowType.BaseCoinTransfer : SendFlowType.TokenTransfer

        // Set called because we need to update the type, and update function only updates the properties
        // if the type is the same
        setSendFlowParameters({
            ...previousSharedParameters,
            type: sendFlowType,
            [sendFlowType]: {
                token: selectedToken,
            },
            sourceNetworkId: selectedToken?.networkId,
        })

        $sendFlowRouter.next()
    }
</script>

<PopupTemplate
    title={localize('popups.transaction.selectToken')}
    backButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    continueButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: !selectedToken || tokenError,
    }}
>
    <div class="flex-1 h-0 flex flex-col gap-4">
        <div class="flex-none flex flex-col gap-4">
            {#if $networks.length > 1}
                <SelectInput bind:selected={selectedOption} {options} />
            {/if}
            <SearchInput bind:value={searchValue} />
        </div>
        <div class="-mr-3 overflow-y-scroll">
            <token-list class="flex flex-col p-0.5 pr-1.5 gap-2">
                {#each tokenList as token}
                    {@const selected = selectedToken?.id === token.id && selectedToken?.networkId === token?.networkId}
                    {@const error = selected ? Boolean(tokenError) : false}
                    <TokenAmountTile
                        {token}
                        {error}
                        {selected}
                        amount={getTokenBalance(token.id, token.networkId)?.available}
                        onClick={() => onTokenClick(token)}
                    />
                {/each}
            </token-list>
        </div>
        {#if tokenError}
            <div class="flex-none">
                <Alert variant="danger" text={tokenError} />
            </div>
        {/if}
    </div>
</PopupTemplate>
