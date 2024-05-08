<script lang="ts">
    import { localize } from '@core/i18n'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { sendAndPersistTransactionFromEvm, signEvmTransaction } from '@core/wallet/actions'
    import { getSelectedAccount, selectedAccount } from '@core/account/stores'
    import { ExplorerEndpoint, IEvmNetwork, getDefaultExplorerUrl } from '@core/network'
    import { DappInfo, TransactionAssetSection } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { EvmTransactionData } from '@core/layer-2/types'
    import { EvmTransactionDetails } from '@views/dashboard/send-flow/views/components'
    import {
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
        getHexEncodedTransaction,
        getMethodForEvmTransaction,
    } from '@core/layer-2'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
    import { TokenTransferData } from '@core/wallet'
    import { Nft } from '@core/nfts'
    import { Alert, Link, Table, Text } from '@bloomwalletio/ui'
    import { PopupId, closePopup, modifyPopupState, openPopup } from '@desktop/auxiliary/popup'
    import { buildUrl, truncateString } from '@core/utils'
    import { openUrlInBrowser } from '@core/app'
    import { StardustActivityType } from '@core/activity'
    import { BASE_TOKEN_ID } from '@core/token/constants'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import { DappVerification, RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { LegacyTransaction } from '@ethereumjs/tx'
    import { getActiveProfileId } from '@core/profile/stores'
    import { IAccountState } from '@core/account'
    import { getNftByIdForAccount } from '@core/nfts/stores'

    export let preparedTransaction: EvmTransactionData
    export let evmNetwork: IEvmNetwork
    export let dapp: IConnectedDapp
    export let verifiedState: DappVerification
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction
    export let callback: (params: CallbackParameters) => void

    $: localeKey =
        method === RpcMethod.EthSignTransaction
            ? 'signTransaction'
            : isSmartContractCall
              ? 'smartContractCall'
              : 'sendTransaction'

    let nft: Nft | undefined
    let tokenTransfer: TokenTransferData | undefined
    let baseCoinTransfer: TokenTransferData | undefined
    let isSmartContractCall = false
    let methodName: string | undefined = undefined
    let parameters: Record<string, string> | undefined = undefined
    let busy = false

    setTokenTransfer()
    function setTokenTransfer(): void {
        const transferInfo = getTransferInfoFromTransactionData(preparedTransaction, evmNetwork)
        switch (transferInfo?.type) {
            case StardustActivityType.Basic: {
                const transfer = {
                    token: getTokenFromSelectedAccountTokens(transferInfo.tokenId, evmNetwork.id),
                    rawAmount: transferInfo.rawAmount,
                } as TokenTransferData
                if (!transfer.token) {
                    return
                }

                if (transferInfo.tokenId === BASE_TOKEN_ID) {
                    baseCoinTransfer = transfer
                } else {
                    tokenTransfer = transfer
                }
                break
            }
            case StardustActivityType.Nft: {
                nft = getNftByIdForAccount($selectedAccount.index, transferInfo.nftId)
                break
            }
            case StardustActivityType.SmartContract: {
                isSmartContractCall = true
                break
            }
            default: {
                break
            }
        }
    }

    async function getSignedTransaction(account: IAccountState): Promise<string> {
        if (preparedTransaction?.v && preparedTransaction?.s && preparedTransaction?.r) {
            const transaction = LegacyTransaction.fromTxData(preparedTransaction)
            return getHexEncodedTransaction(transaction)
        } else {
            return await signEvmTransaction(preparedTransaction, evmNetwork, account)
        }
    }

    async function signOrSend(): Promise<void> {
        const profileId = getActiveProfileId()
        const account = getSelectedAccount()
        const signedTransaction = await getSignedTransaction(account)
        if (method === RpcMethod.EthSignTransaction) {
            callback({ result: signedTransaction })
            return
        }

        const transactionHash = await sendAndPersistTransactionFromEvm(
            preparedTransaction,
            signedTransaction,
            evmNetwork,
            profileId,
            account
        )
        callback({ result: transactionHash })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch (error) {
            return
        }

        try {
            busy = true
            modifyPopupState({ preventClose: true })

            await signOrSend()

            modifyPopupState({ preventClose: false }, true)
            busy = false
            openPopup({
                id: PopupId.SuccessfulDappInteraction,
                props: {
                    successMessage: getSuccessMessage(),
                    url: dapp?.metadata?.url,
                },
            })
        } catch (err) {
            busy = false
            modifyPopupState({ preventClose: false }, true)
            handleError(err)
        }
    }

    $: void setMethodName(preparedTransaction)
    function setMethodName(preparedTransaction: EvmTransactionData): void {
        const [method, _parameters] = getMethodForEvmTransaction(String(preparedTransaction.data ?? '')) ?? []
        methodName = method
        parameters = _parameters
    }

    function getSuccessMessage(): string {
        const recipient = truncateString(String(preparedTransaction.to), 6, 6)
        const assetName =
            tokenTransfer?.token?.metadata?.name ?? baseCoinTransfer?.token?.metadata?.name ?? nft?.name ?? ''
        return localize(`popups.${localeKey}.success`, { recipient, assetName })
    }

    function onCancelClick(): void {
        closePopup({ callOnCancel: true })
    }

    function onExplorerClick(contractAddress: string): void {
        const { baseUrl, endpoint } = getDefaultExplorerUrl(evmNetwork.id, ExplorerEndpoint.Address)
        const url = buildUrl({ origin: baseUrl, pathname: `${endpoint}/${contractAddress}` })
        openUrlInBrowser(url?.href)
    }
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
        disabled: busy,
    }}
    {busy}
>
    <DappInfo
        slot="banner"
        metadata={dapp.metadata}
        {verifiedState}
        showLink={false}
        classes="bg-surface-1 dark:bg-surface-1-dark pb-4"
    />

    <div class="space-y-5">
        {#if isSmartContractCall}
            <div class="flex flex-col gap-3">
                <Alert variant="warning">
                    <Text slot="text">
                        {localize('popups.smartContractCall.unableToVerify')}
                        <Link
                            on:click={() => onExplorerClick(String(preparedTransaction.to))}
                            text={localize('popups.smartContractCall.viewSmartContract')}
                        />
                    </Text>
                    <Table
                        collapsible
                        collapsibleTitle={localize('general.details')}
                        slot="body"
                        items={[
                            {
                                key: localize('general.address'),
                                value: truncateString(String(preparedTransaction.to), 16, 16),
                                onClick: () => onExplorerClick(String(preparedTransaction.to)),
                            },
                            { key: localize('general.methodName'), value: methodName },
                            { key: localize('general.parameters'), value: parameters },
                            { key: localize('general.data'), value: String(preparedTransaction.data), copyable: true },
                        ]}
                    />
                </Alert>
            </div>
        {:else}
            <TransactionAssetSection {baseCoinTransfer} {tokenTransfer} {nft} />
        {/if}
        <EvmTransactionDetails
            sourceNetwork={evmNetwork}
            destinationNetworkId={evmNetwork.id}
            estimatedGasFee={calculateEstimatedGasFeeFromTransactionData(preparedTransaction, evmNetwork)}
            maxGasFee={calculateMaxGasFeeFromTransactionData(preparedTransaction, evmNetwork)}
        />
    </div>
</PopupTemplate>
