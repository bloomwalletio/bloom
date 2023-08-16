import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { getNetworkHrp } from '@core/profile/actions'
import { getUnitFromTokenMetadata, validateTokenId } from '@core/token'
import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'
import { getByteLengthOfString, isStringTrue, isValidBech32AddressAndPrefix } from '@core/utils'
import { SendFlowParameters, SendFlowType, SubjectType, TokenTransferData, setSendFlowParameters } from '@core/wallet'
import { get } from 'svelte/store'
import { PopupId, openPopup } from '../../../../../../../../desktop/lib/auxiliary/popup'
import { SendFlowRoute } from '../../../../../../../../desktop/views/dashboard/send-flow/send-flow-route.enum'
import {
    SendFlowRouter,
    sendFlowRouter,
} from '../../../../../../../../desktop/views/dashboard/send-flow/send-flow.router'
import { SendOperationParameter } from '../../../enums'
import {
    InvalidAddressError,
    MetadataLengthError,
    NoAddressSpecifiedError,
    SurplusNotANumberError,
    SurplusNotSupportedError,
    TagLengthError,
    UnknownAssetError,
} from '../../../errors'
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
    if (!networkId) {
        throw new Error('No active network')
    }

    const tokenId = searchParams.get(SendOperationParameter.TokenId)
    if (tokenId) {
        validateTokenId(tokenId)
    }

    const type = tokenId ? SendFlowType.TokenTransfer : SendFlowType.BaseCoinTransfer

    const surplus = searchParams.get(SendOperationParameter.Surplus)
    if (surplus && parseInt(surplus).toString() !== surplus) {
        throw new SurplusNotANumberError(surplus)
    } else if (surplus && type === SendFlowType.TokenTransfer) {
        throw new SurplusNotSupportedError()
    }

    let baseCoinTransfer: TokenTransferData | undefined
    let tokenTransfer: TokenTransferData | undefined
    if (type === SendFlowType.BaseCoinTransfer) {
        baseCoinTransfer = {
            token: get(selectedAccountTokens)?.[networkId]?.baseCoin,
            rawAmount: getRawAmountFromSearchParam(searchParams),
            unit: searchParams.get(SendOperationParameter.Unit) ?? 'glow',
        }
    } else if (type === SendFlowType.TokenTransfer && tokenId) {
        const token = getTokenFromSelectedAccountTokens(tokenId, networkId)
        if (token?.metadata) {
            tokenTransfer = {
                token,
                rawAmount: getRawAmountFromSearchParam(searchParams),
                unit: searchParams.get(SendOperationParameter.Unit) ?? getUnitFromTokenMetadata(token.metadata),
            }
            if (surplus) {
                baseCoinTransfer = {
                    token: get(selectedAccountTokens)?.[networkId]?.baseCoin,
                    rawAmount: surplus,
                    unit: 'glow',
                }
            }
        } else {
            throw new UnknownAssetError()
        }
    }

    // Check address exists and is valid this is not optional.
    const address = searchParams.get(SendOperationParameter.Address)
    if (!address) {
        throw new NoAddressSpecifiedError()
    }
    if (!isValidBech32AddressAndPrefix(address, getNetworkHrp())) {
        throw new InvalidAddressError()
    }

    const metadata = searchParams.get(SendOperationParameter.Metadata)
    if (metadata && getByteLengthOfString(metadata) > 8192) {
        throw new MetadataLengthError()
    }

    const tag = searchParams.get(SendOperationParameter.Tag)
    if (tag && getByteLengthOfString(tag) > 64) {
        throw new TagLengthError()
    }

    const giftStorageDeposit = isStringTrue(searchParams.get(SendOperationParameter.GiftStorageDeposit) ?? '')
    const disableToggleGift = isStringTrue(searchParams.get(SendOperationParameter.DisableToggleGift) ?? '')
    const disableChangeExpiration = isStringTrue(searchParams.get(SendOperationParameter.DisableChangeExpiration) ?? '')

    return {
        type,
        ...(baseCoinTransfer && { baseCoinTransfer }),
        ...(tokenTransfer && { tokenTransfer }),
        ...(address && { recipient: { type: SubjectType.Address, address } }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...(giftStorageDeposit && { giftStorageDeposit }),
        ...(disableToggleGift && { disableToggleGift }),
        ...(disableChangeExpiration && { disableChangeExpiration }),
    }
}
