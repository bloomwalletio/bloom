<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market/stores'
    import { getNetwork } from '@core/network'
    import { getCoinType } from '@core/profile/actions'
    import {
        AccountAssets,
        IAsset,
        SendFlowType,
        TokenStandard,
        getAccountAssetsForSelectedAccount,
        selectedAccountAssets,
        sendFlowParameters,
        setSendFlowParameters,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { IconInput, TokenAmountTile } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let searchValue: string = ''
    let selectedAsset: IAsset =
        $sendFlowParameters?.type === SendFlowType.BaseCoinTransfer
            ? $sendFlowParameters.baseCoinTransfer.asset
            : $sendFlowParameters?.type === SendFlowType.TokenTransfer
            ? $sendFlowParameters.tokenTransfer.asset
            : $selectedAccountAssets?.[getNetwork().getMetadata().id].baseCoin

    let assets: AccountAssets
    $: assets = getAccountAssetsForSelectedAccount($marketCoinPrices)
    $: assets, searchValue, setFilteredAssetList()

    let assetList: IAsset[]
    function getAssetList(): IAsset[] {
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
        if (!assetList.some((asset) => asset.id === selectedAsset?.id)) {
            selectedAsset = undefined
        }
    }

    function isVisibleAsset(asset: IAsset): boolean {
        const _searchValue = searchValue.toLowerCase()
        const name = asset?.metadata?.name
        const ticker =
            asset?.metadata?.standard === TokenStandard.BaseToken ? asset?.metadata.unit : asset?.metadata.symbol

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
                asset: selectedAsset,
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
        <div class="asset-list w-full flex flex-col -mr-1 pr-1.5 gap-2">
            {#each assetList as asset}
                <TokenAmountTile
                    {asset}
                    amount={asset.balance.available}
                    onClick={() => (selectedAsset = asset)}
                    selected={selectedAsset?.id === asset.id && selectedAsset?.chainId === asset?.chainId}
                />
            {/each}
        </div>
    </div>
</SendFlowTemplate>

<style lang="scss">
    .asset-list {
        max-height: 400px;
        overflow-y: scroll;
    }
</style>
