<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { signEvmTransaction } from '@core/wallet/actions'
    import { Text } from '@bloomwalletio/ui'
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
        const transactionInfo = getTransferInfoFromTransactionData(transaction, chain)
        switch (transactionInfo?.asset.type) {
            case AssetType.BaseCoin: {
                const token = getTokenFromSelectedAccountTokens('0x0', id)
                baseCoinTransfer = {
                    rawAmount: transactionInfo?.asset?.rawAmount,
                    token,
                }
                break
            }
            case AssetType.Token: {
                const token = getTokenFromSelectedAccountTokens(
                    '0x080ad771d46c28f267403a4af352ab2e278e5f1fe9b7ab5579106e98f826bc14640100000000',
                    id
                )
                tokenTransfer = {
                    rawAmount: transactionInfo?.asset?.rawAmount,
                    token,
                }
                break
            }
            case AssetType.Nft: {
                nft = getNftByIdFromAllAccountNfts($selectedAccount.index, transactionInfo.asset.nftId)
                break
            }
            default: {
                const token = getTokenFromSelectedAccountTokens(
                    '0x080ad771d46c28f267403a4af352ab2e278e5f1fe9b7ab5579106e98f826bc14640100000000',
                    id
                )
                tokenTransfer = {
                    rawAmount: '12',
                    token,
                }
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
        <section class="relative flex flex-col border border-solid border-gray-200 rounded-xl p-6">
            <TransactionAssetSection {baseCoinTransfer} {tokenTransfer} {nft} />
            {#if dapp}
                <div class="absolute flex flex-row justify-between" style="top: -12px; left: 18px;">
                    <div class="flex flex-row gap-1 bg-white dark:bg-gray-800 items-center px-2">
                        <img
                            style="width: 24px; height: 24px; border-radius: 24px;"
                            src={dapp.metadata?.icons?.[0]}
                            alt={dapp.metadata?.name}
                        />
                        <Text type="xs">
                            {dapp.metadata?.name}
                        </Text>
                    </div>
                </div>
            {/if}
        </section>
        <EvmTransactionDetails
            destinationNetworkId={id}
            estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(transaction)}
            maxGasFee={calculateMaxGasFeeFromTransactionData(transaction)}
        />
    </div>
</PopupTemplate>
