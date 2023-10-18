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
import { SendOperationParameter } from '../../../enums'
import { InvalidAddressError, NoAddressSpecifiedError, UnknownAssetError } from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'

export function handleDeepLinkSendConfirmationOperation(searchParams: URLSearchParams): void {
    const sendFlowParameters = parseSendConfirmationOperation(searchParams)

    if (sendFlowParameters) {
        setSendFlowParameters(sendFlowParameters)
        sendFlowRouter.set(new SendFlowRouter(undefined, SendFlowRoute.TransactionSummary))
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
 * @method parseSendConfirmationOperation
 *
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {SendFlowParameters} The formatted parameters for the send operation.
 */
function parseSendConfirmationOperation(searchParams: URLSearchParams): SendFlowParameters {
    const networkId = getActiveNetworkId()
    const baseCoin = get(selectedAccountTokens)?.[networkId]?.baseCoin
    if (!baseCoin) {
        throw new Error('No base coin')
    }

    let baseCoinTransfer: TokenTransferData | undefined
    const baseCoinAmount = getRawAmountFromSearchParam(searchParams, SendOperationParameter.BaseCoinAmount)
    if (baseCoinAmount) {
        baseCoinTransfer = {
            token: baseCoin,
            rawAmount: baseCoinAmount,
        }
    }

    const tokenId = searchParams.get(SendOperationParameter.TokenId)
    if (tokenId) {
        validateTokenId(tokenId)
    }

    let tokenTransfer: TokenTransferData | undefined
    const tokenAmount = getRawAmountFromSearchParam(searchParams, SendOperationParameter.TokenAmount)
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
    const address = searchParams.get(SendOperationParameter.Address)
    if (!address) {
        throw new NoAddressSpecifiedError()
    }

    try {
        validateBech32Address(getNetworkHrp(), address)
    } catch (error) {
        throw new InvalidAddressError()
    }

    const metadata = searchParams.get(SendOperationParameter.Metadata)
    if (metadata && getByteLengthOfString(metadata) > 8192) {
        throw new MetadataLengthError()
    }

    const tag = searchParams.get(SendOperationParameter.Tag)
    if (tag) {
        validateTag(tag)
    }

    const giftStorageDeposit = isStringTrue(searchParams.get(SendOperationParameter.GiftStorageDeposit) ?? '')
    const disableToggleGift = isStringTrue(searchParams.get(SendOperationParameter.DisableToggleGift) ?? '')
    const disableChangeExpiration = isStringTrue(searchParams.get(SendOperationParameter.DisableChangeExpiration) ?? '')
    const disableChangeTimelock = isStringTrue(searchParams.get(SendOperationParameter.DisableChangeTimelock) ?? '')

    return {
        type: tokenTransfer ? SendFlowType.TokenTransfer : SendFlowType.BaseCoinTransfer,
        destinationNetworkId: networkId,
        ...(baseCoinTransfer && { baseCoinTransfer }),
        ...(tokenTransfer && { tokenTransfer }),
        ...(address && { recipient: { type: SubjectType.Address, address } }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...(giftStorageDeposit && { giftStorageDeposit }),
        ...(disableToggleGift && { disableToggleGift }),
        ...(disableChangeExpiration && { disableChangeExpiration }),
        ...(disableChangeTimelock && { disableChangeTimelock }),
    }
}
