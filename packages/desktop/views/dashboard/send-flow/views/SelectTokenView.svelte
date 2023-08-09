<script lang="ts">
    import { TokenAmountTile, IconInput } from '@ui'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market'
    import { sendFlowParameters, SendFlowType, setSendFlowParameters } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { getCoinType } from '@core/profile'
    import { getNetwork } from '@core/network'
    import { AccountTokens, IToken, TokenStandard } from '@core/token'
    import { selectedAccountTokens } from '@core/token/stores'
    import { getAccountTokensForSelectedAccount } from '@core/token/actions'

    let searchValue: string = ''
    let selectedAsset: IToken =
        $sendFlowParameters?.type === SendFlowType.BaseCoinTransfer
            ? $sendFlowParameters.baseCoinTransfer.token
            : $sendFlowParameters?.type === SendFlowType.TokenTransfer
            ? $sendFlowParameters.tokenTransfer.token
            : $selectedAccountTokens?.[getNetwork().getMetadata().id].baseCoin

    let assets: AccountTokens
    $: assets = getAccountTokensForSelectedAccount($marketCoinPrices)
    $: assets, searchValue, setFilteredAssetList()

    let assetList: IToken[]
    function getAssetList(): IToken[] {
        const list = []
        for (const assetsPerNetwork of Object.values(assets)) {
            if (assetsPerNetwork?.baseCoin) {
                list.push(assetsPerNetwork.baseCoin)
            }
            list.push(...(assetsPerNetwork?.nativeTokens ?? []))
        }
        return list
    }

    function setFilteredAssetList(): void {
        const list = getAssetList()

        assetList = list.filter(isVisibleAsset)
        if (!assetList.some((token) => token.id === selectedAsset?.id)) {
            selectedAsset = undefined
        }
    }

    function isVisibleAsset(token: IToken): boolean {
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
            selectedAsset.id === getCoinType() ? SendFlowType.BaseCoinTransfer : SendFlowType.TokenTransfer

        // Set called because we need to update the type, and update function only updates the properties
        // if the type is the same
        setSendFlowParameters({
            ...previousSharedParameters,
            type: sendFlowType,
            [sendFlowType === SendFlowType.BaseCoinTransfer ? 'baseCoinTransfer' : 'tokenTransfer']: {
                token: selectedAsset,
            },
        })

        $sendFlowRouter.next()
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectToken')}
    leftButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    rightButton={{ text: localize('actions.continue'), onClick: onContinueClick, disabled: !selectedAsset }}
>
    <IconInput bind:value={searchValue} icon={IconEnum.Search} placeholder={localize('general.search')} />
    <div class="-mr-3">
        <div class="token-list w-full flex flex-col -mr-1 pr-1.5 gap-2">
            {#each assetList as token}
                <TokenAmountTile
                    {token}
                    amount={token.balance.available}
                    onClick={() => (selectedAsset = token)}
                    selected={selectedAsset?.id === token.id && selectedAsset?.chainId === token?.chainId}
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
