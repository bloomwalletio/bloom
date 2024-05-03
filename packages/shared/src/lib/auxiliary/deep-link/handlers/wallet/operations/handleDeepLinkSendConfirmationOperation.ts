import { getActiveNetworkId } from '@core/network/actions'
import { getNetworkHrp } from '@core/profile/actions'
import { validateTokenId } from '@core/token'
import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'
import { getByteLengthOfString, isStringTrue, validateBech32Address } from '@core/utils'
import {
    MetadataLengthError,
    SendFlowParameters,
    SendFlowType,
    SubjectType,
    TokenTransferData,
    setSendFlowParameters,
    validateTag,
} from '@core/wallet'
import { get } from 'svelte/store'
import { PopupId, openPopup } from '../../../../../../../../desktop/lib/auxiliary/popup'
import { SendFlowRoute } from '../../../../../../../../desktop/views/dashboard/send-flow/send-flow-route.enum'
import {
    SendFlowRouter,
    sendFlowRouter,
} from '../../../../../../../../desktop/views/dashboard/send-flow/send-flow.router'
import { SendTransactionParameter } from '../../../enums'
import { InvalidAddressError, NoAddressSpecifiedError, UnknownAssetError } from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'

export function handleDeepLinkSendTransactionOperation(searchParams: URLSearchParams): void {
    const sendFlowParameters = parseSendTransactionOperation(searchParams)

    if (sendFlowParameters) {
        setSendFlowParameters(sendFlowParameters)
        sendFlowRouter.set(new SendFlowRouter(SendFlowRoute.TransactionSummary))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
            props: {
                disableBack: true,
            },
        })
    }
}

/**
 * Parses a deep link for the send operation.
 *
 * @method parseSendTransactionOperation
 *
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {SendFlowParameters} The formatted parameters for the send operation.
 */
function parseSendTransactionOperation(searchParams: URLSearchParams): SendFlowParameters {
    const networkId = getActiveNetworkId()
    const baseCoin = get(selectedAccountTokens)?.[networkId]?.baseCoin
    if (!baseCoin) {
        throw new Error('No base coin')
    }

    let baseCoinTransfer: TokenTransferData | undefined
    const baseCoinAmount = getRawAmountFromSearchParam(searchParams, SendTransactionParameter.BaseCoinAmount)
    if (baseCoinAmount) {
        baseCoinTransfer = {
            token: baseCoin,
            rawAmount: baseCoinAmount,
        }
    }

    const tokenId = searchParams.get(SendTransactionParameter.TokenId)
    if (tokenId) {
        validateTokenId(tokenId)
    }

    let tokenTransfer: TokenTransferData | undefined
    const tokenAmount = getRawAmountFromSearchParam(searchParams, SendTransactionParameter.TokenAmount)
    if (tokenId && tokenAmount) {
        const token = getTokenFromSelectedAccountTokens(tokenId, networkId)
        if (token?.metadata) {
            tokenTransfer = {
                token,
                rawAmount: tokenAmount,
            }
        } else {
            throw new UnknownAssetError()
        }
    }

    if (!baseCoinTransfer && !tokenTransfer) {
        throw new Error('No transfer')
    }

    // Check address exists and is valid this is not optional.
    const address = searchParams.get(SendTransactionParameter.Address)
    if (!address) {
        throw new NoAddressSpecifiedError()
    }

    try {
        validateBech32Address(getNetworkHrp(), address)
    } catch (error) {
        throw new InvalidAddressError()
    }

    const metadata = searchParams.get(SendTransactionParameter.Metadata)
    if (metadata && getByteLengthOfString(metadata) > 8192) {
        throw new MetadataLengthError()
    }

    const tag = searchParams.get(SendTransactionParameter.Tag)
    if (tag) {
        validateTag(tag)
    }

    const giftStorageDeposit = isStringTrue(searchParams.get(SendTransactionParameter.GiftStorageDeposit) ?? '')
    const disableToggleGift = isStringTrue(searchParams.get(SendTransactionParameter.DisableToggleGift) ?? '')
    const disableChangeExpiration = isStringTrue(
        searchParams.get(SendTransactionParameter.DisableChangeExpiration) ?? ''
    )
    const disableChangeTimelock = isStringTrue(searchParams.get(SendTransactionParameter.DisableChangeTimelock) ?? '')

    return {
        type: tokenTransfer ? SendFlowType.TokenTransfer : SendFlowType.BaseCoinTransfer,
        destinationNetworkId: networkId,
        ...(baseCoinTransfer && { baseCoinTransfer }),
        ...(tokenTransfer && { tokenTransfer }),
        sourceNetworkId: networkId,
        ...(address && { recipient: { type: SubjectType.Address, address } }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...(giftStorageDeposit && { giftStorageDeposit }),
        ...(disableToggleGift && { disableToggleGift }),
        ...(disableChangeExpiration && { disableChangeExpiration }),
        ...(disableChangeTimelock && { disableChangeTimelock }),
    }
}
