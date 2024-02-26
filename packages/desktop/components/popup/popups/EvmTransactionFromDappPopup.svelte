<script lang="ts">
    import { localize } from '@core/i18n'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { sendAndPersistTransactionFromEvm, signEvmTransaction } from '@core/wallet/actions'
    import { selectedAccount } from '@core/account/stores'
    import { ExplorerEndpoint, IChain, getDefaultExplorerUrl } from '@core/network'
    import { DappInfo, TransactionAssetSection } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { EvmTransactionData } from '@core/layer-2/types'
    import { EvmTransactionDetails } from '@views/dashboard/send-flow/views/components'
    import {
        calculateEstimatedGasFeeFromTransactionData,
        calculateMaxGasFeeFromTransactionData,
        getMethodNameForEvmTransaction,
    } from '@core/layer-2'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
    import { TokenTransferData } from '@core/wallet'
    import { Nft } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { Alert, Link, Table, Text } from '@bloomwalletio/ui'
    import { PopupId, closePopup, modifyPopupState, openPopup } from '@desktop/auxiliary/popup'
    import { truncateString } from '@core/utils'
    import { openUrlInBrowser } from '@core/app'
    import { ActivityType } from '@core/activity'
    import { BASE_TOKEN_ID } from '@core/token/constants'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'

    export let preparedTransaction: EvmTransactionData
    export let rawTransaction: string
    export let chain: IChain
    export let dapp: IConnectedDapp
    export let verifiedState: DappVerification
    export let method: 'eth_sendTransaction' | 'eth_signTransaction' | 'eth_sendRawTransaction'
    export let callback: (params: CallbackParameters) => void

    const { id } = chain.getConfiguration()
    $: localeKey =
        method === 'eth_signTransaction'
            ? 'signTransaction'
            : isSmartContractCall
              ? 'smartContractCall'
              : 'sendTransaction'

    let nft: Nft | undefined
    let tokenTransfer: TokenTransferData | undefined
    let baseCoinTransfer: TokenTransferData | undefined
    let isSmartContractCall = false
    let methodName: string | undefined = undefined
    let busy = false

    setTokenTransfer()
    function setTokenTransfer(): void {
        const transferInfo = getTransferInfoFromTransactionData(preparedTransaction, chain)
        switch (transferInfo?.type) {
            case ActivityType.Basic: {
                if (transferInfo.tokenId === BASE_TOKEN_ID) {
                    baseCoinTransfer = {
                        token: getTokenFromSelectedAccountTokens(transferInfo.tokenId, id),
                        rawAmount: transferInfo.rawAmount,
                    }
                } else {
                    tokenTransfer = {
                        token: getTokenFromSelectedAccountTokens(transferInfo.tokenId, id),
                        rawAmount: transferInfo.rawAmount,
                    }
                }
                break
            }
            case ActivityType.Nft: {
                nft = getNftByIdFromAllAccountNfts($selectedAccount.index, transferInfo.nftId)
                break
            }
            case ActivityType.SmartContract: {
                isSmartContractCall = true
                break
            }
            default: {
                break
            }
        }
    }

    async function signOrSend(): Promise<void> {
        let signedTransaction: string | undefined
        if (method === 'eth_sendRawTransaction') {
            signedTransaction = rawTransaction
        } else {
            signedTransaction = await signEvmTransaction(preparedTransaction, chain, $selectedAccount)
        }

        if (!signedTransaction) {
            throw Error('No signed transaction!')
        }

        if (method === 'eth_signTransaction') {
            callback({ result: signedTransaction })
            return
        }

        const response = await sendAndPersistTransactionFromEvm(
            preparedTransaction,
            signedTransaction,
            chain,
            $selectedAccount
        )
        callback({ result: response })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuthAsync(LedgerAppName.Ethereum)
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

    $: setMethodName(preparedTransaction)
    async function setMethodName(preparedTransaction: EvmTransactionData): Promise<void> {
        const result = await getMethodNameForEvmTransaction(preparedTransaction)
        methodName = result?.startsWith('0x') ? undefined : result
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
        const explorerUrl = getDefaultExplorerUrl(id, ExplorerEndpoint.Address)
        openUrlInBrowser(`${explorerUrl}/${contractAddress}`)
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
                            { key: localize('general.data'), value: String(preparedTransaction.data), copyable: true },
                        ]}
                    />
                </Alert>
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
