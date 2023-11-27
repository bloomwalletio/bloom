<script lang="ts">
    import { localize } from '@core/i18n'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { sendTransactionFromEvm } from '@core/wallet/actions'
    import { selectedAccount } from '@core/account/stores'
    import { IChain } from '@core/network'
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
    import DappDataBox from '@components/DappDataBox.svelte'
    import { onMount } from 'svelte'

    export let preparedTransaction: EvmTransactionData
    export let chain: IChain
    export let dapp: IConnectedDapp | undefined
    export let signAndSend: boolean
    export let callback: (params: CallbackParameters) => void

    export let _onMount: () => Promise<void> = async () => {}

    const { id } = chain.getConfiguration()
    const localeKey = signAndSend ? 'sendTransaction' : 'signTransaction'

    let nft: INft | undefined
    let tokenTransfer: TokenTransferData | undefined
    let baseCoinTransfer: TokenTransferData | undefined

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
        callback({ error: 'User rejected' })
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
    title={localize(`popups.${localeKey}.title`)}
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
    <div class="space-y-5">
        <DappDataBox {dapp}>
            <TransactionAssetSection {baseCoinTransfer} {tokenTransfer} {nft} />
        </DappDataBox>
        <EvmTransactionDetails
            destinationNetworkId={id}
            estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(preparedTransaction)}
            maxGasFee={calculateMaxGasFeeFromTransactionData(preparedTransaction)}
        />
    </div>
</PopupTemplate>
