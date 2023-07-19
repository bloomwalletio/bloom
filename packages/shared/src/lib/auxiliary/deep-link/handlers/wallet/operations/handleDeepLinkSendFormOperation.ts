import {
    SendFlowParameters,
    setSendFlowParameters,
    selectedAccountAssets,
    getAssetById,
    SendFlowType,
    getUnitFromTokenMetadata,
    TokenTransferData,
} from '@core/wallet'
import { openPopup, PopupId } from '../../../../../../../../desktop/lib/auxiliary/popup'
import {
    sendFlowRouter,
    SendFlowRouter,
} from '../../../../../../../../desktop/views/dashboard/send-flow/send-flow.router'
import { get } from 'svelte/store'

import { SendOperationParameter } from '../../../enums'
import { UnknownAssetError } from '../../../errors'
import { getRawAmountFromSearchParam } from '../../../utils'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'

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
    if (!networkId) {
        return
    }

    const assetId = searchParams.get(SendOperationParameter.AssetId)
    const type = assetId ? SendFlowType.TokenTransfer : SendFlowType.BaseCoinTransfer

    let baseCoinTransfer: TokenTransferData | undefined
    let tokenTransfer: TokenTransferData | undefined
    if (type === SendFlowType.BaseCoinTransfer) {
        baseCoinTransfer = {
            asset: networkId ? get(selectedAccountAssets)?.[networkId]?.baseCoin : undefined,
            rawAmount: getRawAmountFromSearchParam(searchParams),
            unit: searchParams.get(SendOperationParameter.Unit) ?? 'glow',
        }
    } else if (type === SendFlowType.TokenTransfer && assetId) {
        const asset = getAssetById(assetId, networkId)
        if (asset?.metadata) {
            tokenTransfer = {
                asset,
                rawAmount: getRawAmountFromSearchParam(searchParams),
                unit: searchParams.get(SendOperationParameter.Unit) ?? getUnitFromTokenMetadata(asset.metadata),
            }
        } else {
            throw new UnknownAssetError()
        }
    }

    const address = searchParams.get(SendOperationParameter.Address)
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    const tag = searchParams.get(SendOperationParameter.Tag)

    return {
        type,
        ...(baseCoinTransfer && { baseCoinTransfer }),
        ...(tokenTransfer && { tokenTransfer }),
        ...(address && { recipient: { type: 'address', address } }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
    }
}
