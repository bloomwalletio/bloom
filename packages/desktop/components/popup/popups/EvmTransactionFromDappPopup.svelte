<script lang="ts">
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { WCRequestInfo } from '@auxiliary/wallet-connect/types'
    import { EvmTokenApprovalView, EvmBaseCoinTransferView, EvmDappRequestHeader } from '@components'
    import { IAccountState } from '@core/account'
    import { getSelectedAccount, selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import {
        GasSpeed,
        IGasPricesBySpeed,
        getHexEncodedTransaction,
        parseSmartContractDataFromTransactionData,
    } from '@core/layer-2'
    import { ParsedSmartContractType } from '@core/layer-2/enums/parsed-smart-contract-type.enum'
    import { EvmTransactionData } from '@core/layer-2/types'
    import { ParsedSmartContractData } from '@core/layer-2/types/parsed-smart-contract-data.type'
    import { LedgerAppName } from '@core/ledger'
    import { getNftByIdForAccount } from '@core/nfts/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { getActiveProfileId } from '@core/profile/stores'
    import { BASE_TOKEN_ID } from '@core/token/constants'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { Converter, MILLISECONDS_PER_SECOND, truncateString } from '@core/utils'
    import { sendAndPersistTransactionFromEvm, signEvmTransaction } from '@core/wallet/actions'
    import { PopupId, closePopup, modifyPopupState, openPopup } from '@desktop/auxiliary/popup'
    import { LegacyTransaction } from '@ethereumjs/tx'
    import { EvmTransactionDetails } from '@views/dashboard/send-flow/views/components'
    import { onDestroy, onMount } from 'svelte'
    import { time } from '@core/app/stores'
    import { EvmNftTransferView, EvmSmartContractView, EvmTokenTransferView } from '@components/evm-transactions'

    export let preparedTransaction: EvmTransactionData
    export let requestInfo: WCRequestInfo
    export let method: RpcMethod.EthSendTransaction | RpcMethod.EthSignTransaction | RpcMethod.EthSendRawTransaction

    let busy = false

    const { dapp, responseCallback, evmNetwork, expiryTimestamp } = requestInfo
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
    $: baseCoinTransfer = {
        token: getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, evmNetwork.id),
        rawAmount: Converter.bigIntLikeToBigInt(preparedTransaction.value ?? 0),
    }
    $: hasExpired =
        expiryTimestamp === undefined ? false : expiryTimestamp * MILLISECONDS_PER_SECOND - $time.getTime() <= 0

    setParsedContractData()
    function setParsedContractData(): void {
        if (!preparedTransaction.data) {
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
            responseCallback && responseCallback({ result: signedTransaction })
            return
        }

        const transactionHash = await sendAndPersistTransactionFromEvm(
            preparedTransaction,
            signedTransaction,
            evmNetwork,
            profileId,
            account
        )
        responseCallback && responseCallback({ result: transactionHash })
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

            const successMessage = getSuccessMessage(parsedData)
            if (dapp) {
                openPopup({
                    id: PopupId.SuccessfulDappInteraction,
                    props: {
                        successMessage,
                        dapp,
                    },
                })
            } else {
                closePopup()
            }
        } catch (err) {
            busy = false
            modifyPopupState({ preventClose: false }, true)
            handleError(err)
        }
    }

    function getSuccessMessage(parsedData: ParsedSmartContractData | undefined): string {
        let localeKey = ''
        if (method === RpcMethod.EthSignTransaction) {
            localeKey = 'popups.signTransaction'
        } else {
            switch (parsedData?.type) {
                case ParsedSmartContractType.CoinTransfer:
                case ParsedSmartContractType.TokenTransfer:
                case ParsedSmartContractType.NftTransfer:
                    localeKey = 'popups.sendTransaction'
                    break
                case ParsedSmartContractType.TokenApproval:
                    localeKey = 'popups.tokenApproval'
                    break
                case ParsedSmartContractType.SmartContract:
                default:
                    localeKey = 'popups.smartContractCall'
                    break
            }
        }

        let assetName = ''
        switch (parsedData?.type) {
            case ParsedSmartContractType.CoinTransfer:
                assetName = getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, evmNetwork.id)?.metadata?.name ?? ''
                break
            case ParsedSmartContractType.TokenTransfer:
                assetName = getTokenFromSelectedAccountTokens(parsedData.tokenId, evmNetwork.id)?.metadata?.name ?? ''
                break
            case ParsedSmartContractType.NftTransfer:
                assetName = getNftByIdForAccount($selectedAccount?.index, parsedData.nftId)?.metadata?.name ?? ''
                break
            default:
                assetName = ''
        }

        const recipient = truncateString(String(preparedTransaction.to), 6, 6)
        return localize(`${localeKey}.success`, { recipient, assetName })
    }

    function onCancelClick(): void {
        closePopup({ callOnCancel: true })
    }

    let intervalId: NodeJS.Timeout
    onMount(async () => {
        await setGasPrices()
        intervalId = setInterval(() => void setGasPrices, MILLISECONDS_PER_SECOND * 10)
    })

    onDestroy(() => {
        clearInterval(intervalId)
    })

    const backButton = {
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }

    $: continueButton = {
        text: 'REPLACED BY CHILD',
        onClick: onConfirmClick,
        disabled: hasExpired,
    }
</script>

<!-- Base Coin Transfers -->
{#if (preparedTransaction.value && !parsedData) || parsedData?.type === ParsedSmartContractType.CoinTransfer}
    {@const potentialAdditionalRawAmount =
        parsedData?.type === ParsedSmartContractType.CoinTransfer ? parsedData?.rawAmount : BigInt(0)}
    <EvmBaseCoinTransferView
        baseCoinTransfer={{ ...baseCoinTransfer, rawAmount: baseCoinTransfer.rawAmount + potentialAdditionalRawAmount }}
        {method}
        {evmNetwork}
        {backButton}
        {continueButton}
        {busy}
    >
        <EvmDappRequestHeader slot="dappHeader" {requestInfo} />
        <EvmTransactionDetails
            slot="transactionDetails"
            bind:selectedGasSpeed
            sourceNetwork={evmNetwork}
            destinationNetworkId={evmNetwork.id}
            transaction={preparedTransaction}
            {gasPrices}
            {busy}
        />
    </EvmBaseCoinTransferView>
    <!-- Evm Token Transfer -->
{:else if parsedData?.type === ParsedSmartContractType.TokenTransfer}
    <EvmTokenTransferView
        tokenId={parsedData.tokenId}
        rawAmount={parsedData.rawAmount}
        {baseCoinTransfer}
        {method}
        {evmNetwork}
        {backButton}
        {continueButton}
        {busy}
    >
        <EvmDappRequestHeader slot="dappHeader" {requestInfo} />
        <EvmTransactionDetails
            slot="transactionDetails"
            bind:selectedGasSpeed
            sourceNetwork={evmNetwork}
            destinationNetworkId={evmNetwork.id}
            transaction={preparedTransaction}
            {gasPrices}
            {busy}
        />
    </EvmTokenTransferView>
    <!-- Evm Nft Transfer -->
{:else if parsedData?.type === ParsedSmartContractType.NftTransfer}
    <EvmNftTransferView nftId={parsedData.nftId} {baseCoinTransfer} {method} {backButton} {continueButton} {busy}>
        <EvmDappRequestHeader slot="dappHeader" {requestInfo} />
        <EvmTransactionDetails
            slot="transactionDetails"
            bind:selectedGasSpeed
            sourceNetwork={evmNetwork}
            destinationNetworkId={evmNetwork.id}
            transaction={preparedTransaction}
            {gasPrices}
            {busy}
        />
    </EvmNftTransferView>
    <!-- Evm Token Approval -->
{:else if parsedData?.type === ParsedSmartContractType.TokenApproval}
    <EvmTokenApprovalView
        {baseCoinTransfer}
        parsedTokenApproval={parsedData}
        networkId={evmNetwork.id}
        dappName={dapp?.metadata?.name}
        {backButton}
        {continueButton}
        {busy}
    >
        <EvmDappRequestHeader slot="dappHeader" {requestInfo} />
        <EvmTransactionDetails
            slot="transactionDetails"
            bind:selectedGasSpeed
            sourceNetwork={evmNetwork}
            destinationNetworkId={evmNetwork.id}
            transaction={preparedTransaction}
            {gasPrices}
            {busy}
        />
    </EvmTokenApprovalView>
    <!-- Evm SmartContract -->
{:else if parsedData?.type === ParsedSmartContractType.SmartContract}
    <EvmSmartContractView
        {baseCoinTransfer}
        {parsedData}
        networkId={evmNetwork.id}
        {backButton}
        {continueButton}
        {busy}
    >
        <EvmDappRequestHeader slot="dappHeader" {requestInfo} />
        <EvmTransactionDetails
            slot="transactionDetails"
            bind:selectedGasSpeed
            sourceNetwork={evmNetwork}
            destinationNetworkId={evmNetwork.id}
            transaction={preparedTransaction}
            {gasPrices}
            {busy}
        />
    </EvmSmartContractView>
{/if}
