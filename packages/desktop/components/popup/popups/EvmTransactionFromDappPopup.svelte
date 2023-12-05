<script lang="ts">
    import { localize } from '@core/i18n'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { sendTransactionFromEvm } from '@core/wallet/actions'
    import { selectedAccount } from '@core/account/stores'
    import { ExplorerEndpoint, IChain, getDefaultExplorerUrl } from '@core/network'
    import { TransactionAssetSection } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { EvmTransactionData } from '@core/layer-2/types'
    import { EvmTransactionDetails } from '@views/dashboard/send-flow/views/components'
    import {
        AssetType,
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
    } from '@core/layer-2'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
    import { TokenTransferData } from '@core/wallet'
    import { INft } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import DappDataBanner from '@components/DappDataBanner.svelte'
    import { onMount } from 'svelte'
    import { Alert, Table } from '@bloomwalletio/ui'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { truncateString } from '@core/utils'
    import { openUrlInBrowser } from '@core/app'

    export let preparedTransaction: EvmTransactionData
    export let chain: IChain
    export let dapp: IConnectedDapp | undefined
    export let onCancel: () => void
    export let signAndSend: boolean
    export let callback: (params: CallbackParameters) => void

    export let _onMount: () => Promise<void> = async () => {}

    const { id } = chain.getConfiguration()
    $: localeKey = signAndSend ? (isSmartContractCall ? 'smartContractCall' : 'sendTransaction') : 'signTransaction'

    let nft: INft | undefined
    let tokenTransfer: TokenTransferData | undefined
    let baseCoinTransfer: TokenTransferData | undefined
    let isSmartContractCall = false

    setTokenTransfer()
    function setTokenTransfer(): void {
        const { asset } = getTransferInfoFromTransactionData(preparedTransaction, chain) ?? {}
        switch (asset?.type) {
            case AssetType.BaseCoin: {
                baseCoinTransfer = {
                    token: getTokenFromSelectedAccountTokens(asset.tokenId, id),
                    rawAmount: asset.rawAmount,
                }
                break
            }
            case AssetType.Token: {
                tokenTransfer = {
                    token: getTokenFromSelectedAccountTokens(asset.tokenId, id),
                    rawAmount: asset.rawAmount,
                }
                break
            }
            case AssetType.Nft: {
                nft = getNftByIdFromAllAccountNfts($selectedAccount.index, asset.nftId)
                break
            }
            default: {
                isSmartContractCall = !!preparedTransaction.data
                break
            }
        }
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await sendTransactionFromEvm(preparedTransaction, chain, signAndSend, callback)
        } catch (err) {
            callback({ error: err })
            handleError(err)
        }
    }

    function onCancelClick(): void {
        onCancel?.()
        closePopup()
    }

    function onExplorerClick(contractAddress: string): void {
        const explorerUrl = getDefaultExplorerUrl(id, ExplorerEndpoint.Address)
        openUrlInBrowser(`${explorerUrl}/${contractAddress}`)
    }

    // Required to trigger callback after profile authentication
    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<PopupTemplate
    title={localize(`popups.${localeKey}.title`, {
        contractAddress: truncateString(String(preparedTransaction.to), 6, 6),
    })}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize(`popups.${localeKey}.action`),
        onClick: onConfirmClick,
    }}
    busy={$selectedAccount?.isTransferring}
>
    <DappDataBanner slot="banner" {dapp} />

    <div class="space-y-5">
        {#if isSmartContractCall}
            <div class="flex flex-col gap-3">
                <Alert variant="warning" text={localize(`popups.${localeKey}.unableToVerify`)} />
                <Table
                    orientation="vertical"
                    items={[
                        {
                            key: localize('general.address'),
                            value: truncateString(String(preparedTransaction.to), 16, 16),
                            onClick: () => onExplorerClick(String(preparedTransaction.to)),
                        },
                        { key: localize('general.data'), value: String(preparedTransaction.data) },
                    ]}
                />
            </div>
        {:else}
            <TransactionAssetSection {baseCoinTransfer} {tokenTransfer} {nft} />
        {/if}
        <EvmTransactionDetails
            destinationNetworkId={id}
            estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(preparedTransaction)}
            maxGasFee={calculateMaxGasFeeFromTransactionData(preparedTransaction)}
        />
    </div>
</PopupTemplate>
