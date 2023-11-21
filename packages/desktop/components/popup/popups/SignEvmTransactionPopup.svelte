<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { signEvmTransaction } from '@core/wallet/actions'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { IChain } from '@core/network'
    import { TransactionAssetSection } from '@ui'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { showNotification } from '@auxiliary/notification/actions'
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

    export let transaction: EvmTransactionData
    export let account: IAccountState
    export let chain: IChain
    export let dapp: IConnectedDapp | undefined
    export let callback: (params: CallbackParameters) => void

    const { chainId, id } = chain.getConfiguration()

    let isBusy = false

    let nft: INft | undefined
    let tokenTransfer: TokenTransferData | undefined
    let baseCoinTransfer: TokenTransferData | undefined

    setTokenTransfer()
    function setTokenTransfer(): void {
        const { asset } = getTransferInfoFromTransactionData(transaction, chain) ?? {}
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
        await checkActiveProfileAuth(sign, { stronghold: false, ledger: false }, LedgerAppName.Ethereum)
    }

    function onCancelClick(): void {
        callback({ error: 'User rejected' })
        closePopup()
    }

    async function sign(): Promise<void> {
        isBusy = true
        try {
            const result = await signEvmTransaction(transaction, chainId, account)

            showNotification({
                variant: 'success',
                text: localize('notifications.signTransaction.success'),
            })
            callback({ result })
        } catch (err) {
            callback({ error: err })
            handleError(err)
        } finally {
            isBusy = false
            closePopup()
        }
    }
</script>

<PopupTemplate
    title={localize('popups.signTransaction.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('popups.signTransaction.action'),
        onClick: onConfirmClick,
    }}
    busy={$selectedAccount?.isTransferring || isBusy}
>
    <div class="space-y-5">
        <DappDataBox {dapp}>
            <TransactionAssetSection {baseCoinTransfer} {tokenTransfer} {nft} />
        </DappDataBox>
        <EvmTransactionDetails
            destinationNetworkId={id}
            estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(transaction)}
            maxGasFee={calculateMaxGasFeeFromTransactionData(transaction)}
        />
    </div>
</PopupTemplate>
