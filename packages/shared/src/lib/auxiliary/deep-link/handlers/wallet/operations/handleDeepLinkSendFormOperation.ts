import { getActiveNetworkId } from '@core/network/actions/getActiveNetworkId'
import { getTokenFromSelectedAccountTokens, selectedAccountTokens } from '@core/token/stores'
import {
    SendFlowParameters,
    SendFlowType,
    Subject,
    SubjectType,
    TokenTransferData,
    setSendFlowParameters,
} from '@core/wallet'
import { get } from 'svelte/store'
import { PopupId, openPopup } from '../../../../../../../../desktop/lib/auxiliary/popup'
import {
    SendFlowRouter,
    sendFlowRouter,
} from '../../../../../../../../desktop/views/dashboard/send-flow/send-flow.router'
import { SendOperationParameter } from '../../../enums'
import { UnknownAssetError } from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'
import { getUnitFromTokenMetadata } from '@core/token/utils'

export function handleDeepLinkSendFormOperation(searchParams: URLSearchParams): void {
    const sendFlowParameters = parseSendFormOperation(searchParams)

    if (sendFlowParameters) {
        setSendFlowParameters(sendFlowParameters)
        sendFlowRouter.set(new SendFlowRouter(undefined))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
}

/**
 * Parses a deep link for the send form operation.
 *
 * @method parseSendFormOperation
 *
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {SendFlowParameters} The formatted parameters for the send operation.
 */
function parseSendFormOperation(searchParams: URLSearchParams): SendFlowParameters | undefined {
    const networkId = getActiveNetworkId()

    const tokenId = searchParams.get(SendOperationParameter.TokenId)
    const type = tokenId ? SendFlowType.TokenTransfer : SendFlowType.BaseCoinTransfer
    const baseCoin = get(selectedAccountTokens)?.[networkId]?.baseCoin
    if (!baseCoin) {
        throw new Error('No base coin')
    }

    let baseCoinTransfer: TokenTransferData | undefined
    let tokenTransfer: TokenTransferData | undefined
    if (type === SendFlowType.BaseCoinTransfer) {
        baseCoinTransfer = {
            token: baseCoin,
            rawAmount: getRawAmountFromSearchParam(searchParams, SendOperationParameter.BaseCoinAmount),
            unit: searchParams.get(SendOperationParameter.Unit) ?? 'glow',
        }
    } else if (type === SendFlowType.TokenTransfer && tokenId) {
        const token = getTokenFromSelectedAccountTokens(tokenId, networkId)
        if (token?.metadata) {
            tokenTransfer = {
                token,
                rawAmount: getRawAmountFromSearchParam(searchParams, SendOperationParameter.TokenAmount),
                unit: searchParams.get(SendOperationParameter.Unit) ?? getUnitFromTokenMetadata(token.metadata),
            }
        } else {
            throw new UnknownAssetError()
        }
    }

    const address = searchParams.get(SendOperationParameter.Address)
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    const tag = searchParams.get(SendOperationParameter.Tag)
    const recipient: Subject | undefined = address ? { type: SubjectType.Address, address } : undefined

    return {
        type,
        ...(baseCoinTransfer && { baseCoinTransfer }),
        ...(tokenTransfer && { tokenTransfer }),
        ...(address && { recipient }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
    }
}
