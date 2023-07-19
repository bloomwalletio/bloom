<script lang="ts">
    import { TokenAmountTile, IconInput } from '@ui'
    import { localize } from '@core/i18n'
    import { marketCoinPrices } from '@core/market'
    import {
        getAccountAssetsForSelectedAccount,
        AccountAssets,
        IAsset,
        sendFlowParameters,
        SendFlowType,
        TokenStandard,
        setSendFlowParameters,
        selectedAccountAssets,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { getCoinType } from '@core/profile'
    import { getNetwork } from '@core/network'

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
        if (selectedAsset.id === getCoinType()) {
            setSendFlowParameters({
                ...previousSharedParameters,
                type: SendFlowType.BaseCoinTransfer,
                baseCoinTransfer: {
                    asset: selectedAsset,
                },
            })
        } else {
            setSendFlowParameters({
                ...previousSharedParameters,
                type: SendFlowType.TokenTransfer,
                tokenTransfer: {
                    asset: selectedAsset,
                },
            })
        }
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
