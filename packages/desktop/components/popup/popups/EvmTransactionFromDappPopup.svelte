<script lang="ts">
    import { DappVerification, RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { Table } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { getSelectedAccount, selectedAccount } from '@core/account/stores'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import {
        GasSpeed,
        IGasPricesBySpeed,
        getHexEncodedTransaction,
        parseSmartContractDataFromTransactionData,
    } from '@core/layer-2'
    import { EvmTransactionData } from '@core/layer-2/types'
    import { LedgerAppName } from '@core/ledger'
    import { ExplorerEndpoint, IEvmNetwork, getExplorerUrl } from '@core/network'
    import { Nft } from '@core/nfts'
    import { getNftByIdForAccount } from '@core/nfts/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { getActiveProfileId } from '@core/profile/stores'
    import { BASE_TOKEN_ID } from '@core/token/constants'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { Converter, MILLISECONDS_PER_SECOND, truncateString } from '@core/utils'
    import { TokenTransferData } from '@core/wallet'
    import { sendAndPersistTransactionFromEvm, signEvmTransaction } from '@core/wallet/actions'
    import { PopupId, closePopup, modifyPopupState, openPopup } from '@desktop/auxiliary/popup'
    import { LegacyTransaction } from '@ethereumjs/tx'
    import { DappInfo, TransactionAssetSection } from '@ui'
    import { EvmTransactionAlert, EvmTokenApprovalAlert } from '@components'
    import { EvmTransactionDetails } from '@views/dashboard/send-flow/views/components'
    import { onDestroy, onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { ParsedSmartContractType } from '@core/layer-2/enums/parsed-smart-contract-type.enum'
    import { ParsedSmartContractData } from '@core/layer-2/types/parsed-smart-contract-data.type'

    export let preparedTransaction: EvmTransactionData
    export let evmNetwork: IEvmNetwork
    export let dapp: IConnectedDapp
    export let verifiedState: DappVerification
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction
    export let callback: (params: CallbackParameters) => void

    let nft: Nft | undefined
    let tokenTransfer: TokenTransferData | undefined
    let baseCoinTransfer: TokenTransferData | undefined
    let busy = false

    let parsedData: ParsedSmartContractData | undefined

    let selectedGasSpeed = GasSpeed.Required
    let gasPrices: IGasPricesBySpeed = {
        [GasSpeed.Required]: Converter.bigIntLikeToBigInt(preparedTransaction?.gasPrice as number),
    }
    async function setGasPrices(): Promise<void> {
        const _gasPrices = await evmNetwork?.getGasPrices()
        if (_gasPrices) {
            gasPrices = { ...gasPrices, ..._gasPrices }
        }
    }
    $: preparedTransaction.gasPrice = Converter.bigIntToHex(gasPrices?.[selectedGasSpeed] ?? gasPrices.required)

    setTransactionInformation()
    function setTransactionInformation(): void {
        if (!preparedTransaction.data) {
            baseCoinTransfer = {
                token: getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, evmNetwork.id),
                rawAmount: Converter.bigIntLikeToBigInt(preparedTransaction.value),
            } as TokenTransferData
            return
        }

        parsedData = parseSmartContractDataFromTransactionData(
            {
                to: preparedTransaction.to?.toString(),
                data: String(preparedTransaction.data),
                value: preparedTransaction.value,
            },
            evmNetwork
        )
    }

    $: localeKey = getLocalKey(parsedData?.type)
    function getLocalKey(type?: ParsedSmartContractType): string {
        if (method === RpcMethod.EthSignTransaction) {
            return 'signTransaction'
        }
        switch (type) {
            case ParsedSmartContractType.CoinTransfer:
            case ParsedSmartContractType.TokenTransfer:
            case ParsedSmartContractType.NftTransfer:
                return 'sendTransaction'
            case ParsedSmartContractType.TokenApproval:
                return 'tokenApproval'
            case ParsedSmartContractType.SmartContract:
            default:
                return 'smartContractCall'
        }
    }

    $: title = getTitle(parsedData)
    function getTitle(data?: ParsedSmartContractData): string {
        const locale = `popups.${localeKey}.title`

        if (data?.type === ParsedSmartContractType.TokenApproval) {
            const token = getTokenFromSelectedAccountTokens(data.tokenId, evmNetwork.id)
            return localize(locale, { dappName: dapp.metadata?.name, assetName: token?.metadata?.name })
        }
        return localize(locale)
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
                    dapp,
                },
            })
        } catch (err) {
            busy = false
            modifyPopupState({ preventClose: false }, true)
            handleError(err)
        }
    }

    function getSuccessMessage(): string {
        const recipient = truncateString(String(preparedTransaction.to), 6, 6)
        const assetName =
            tokenTransfer?.token?.metadata?.name ?? baseCoinTransfer?.token?.metadata?.name ?? nft?.name ?? ''
        return localize(`popups.${localeKey}}.success`, { recipient, assetName })
    }

    function onCancelClick(): void {
        closePopup({ callOnCancel: true })
    }

    function onExplorerClick(contractAddress: string): void {
        const url = getExplorerUrl(evmNetwork.id, ExplorerEndpoint.Address, contractAddress)
        openUrlInBrowser(url)
    }

    let intervalId: NodeJS.Timeout
    onMount(async () => {
        await setGasPrices()
        intervalId = setInterval(() => void setGasPrices, MILLISECONDS_PER_SECOND * 10)
    })

    onDestroy(() => {
        clearInterval(intervalId)
    })
</script>

<PopupTemplate
    {title}
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
        {#if parsedData?.type === ParsedSmartContractType.CoinTransfer}
            {@const baseCoinTransfer = {
                token: getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, evmNetwork.id),
                rawAmount: parsedData.rawAmount,
            }}
            <TransactionAssetSection {baseCoinTransfer} />
        {:else if parsedData?.type === ParsedSmartContractType.TokenTransfer}
            {@const tokenTransfer = {
                token: getTokenFromSelectedAccountTokens(parsedData.tokenId, evmNetwork.id),
                rawAmount: parsedData.rawAmount,
            }}
            <TransactionAssetSection {tokenTransfer} />
        {:else if parsedData?.type === ParsedSmartContractType.NftTransfer}
            {@const nft = getNftByIdForAccount($selectedAccount?.index, parsedData.nftId)}
            <TransactionAssetSection {nft} />
        {:else if parsedData?.type === ParsedSmartContractType.TokenApproval}
            <div class="flex flex-col gap-3">
                <EvmTokenApprovalAlert parsedTokenApproval={parsedData} networkId={evmNetwork.id} />
            </div>
        {:else if parsedData?.type === ParsedSmartContractType.SmartContract}
            <div class="flex flex-col gap-3">
                <EvmTransactionAlert
                    variant="warning"
                    message={localize('popups.smartContractCall.unableToVerify')}
                    networkId={evmNetwork.id}
                    contractAddress={String(preparedTransaction.to)}
                >
                    <Table
                        collapsible
                        collapsibleTitle={localize('general.details')}
                        items={[
                            {
                                key: localize('general.address'),
                                value: truncateString(String(preparedTransaction.to), 16, 16),
                                onClick: () => onExplorerClick(String(preparedTransaction.to)),
                            },
                            { key: localize('general.methodName'), value: parsedData.parsedMethod?.name },
                            {
                                key: localize('general.parameters'),
                                value: parsedData?.parsedMethod?.inputs.reduce((acc, input) => {
                                    acc[input.name] = input.value
                                    return acc
                                }, {}),
                            },
                            { key: localize('general.data'), value: String(preparedTransaction.data), copyable: true },
                        ]}
                    />
                </EvmTransactionAlert>
            </div>
        {/if}
        <EvmTransactionDetails
            bind:selectedGasSpeed
            sourceNetwork={evmNetwork}
            destinationNetworkId={evmNetwork.id}
            transaction={preparedTransaction}
            {gasPrices}
            {busy}
        />
    </div>
</PopupTemplate>
