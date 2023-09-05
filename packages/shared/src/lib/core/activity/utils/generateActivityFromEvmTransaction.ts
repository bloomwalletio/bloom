import { WEI_PER_GLOW } from '@core/layer-2'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { getPersistedToken } from '@core/token/stores'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { TokenTransferData, getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import Web3 from 'web3'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { PersistedEvmTransaction, TransactionActivity } from '../types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'

export async function generateActivityFromEvmTransaction(
    transaction: PersistedEvmTransaction,
    tokenId: string,
    networkId: NetworkId,
    provider: Web3
): Promise<TransactionActivity> {
    const direction = ActivityDirection.Outgoing // Currently only sent transactions are supported

    const sender = getSubjectFromAddress(transaction.from, networkId)
    const recipient = getSubjectFromAddress(transaction.to, networkId)
    const isInternal = isSubjectInternal(recipient)
    const timestamp = (await provider.eth.getBlock(transaction.blockNumber)).timestamp

    const baseTokenTransfer: TokenTransferData | undefined = {
        token: { ...getPersistedToken(BASE_TOKEN_ID), networkId },
        rawAmount: tokenId !== BASE_TOKEN_ID ? String(Number(transaction.value) / Number(WEI_PER_GLOW)) : '0',
    }

    let tokenTransfer: TokenTransferData | undefined
    if (tokenId !== BASE_TOKEN_ID) {
        const persistedTokens = await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
        tokenTransfer = persistedTokens
            ? {
                  token: { ...persistedTokens, networkId },
                  rawAmount: String(Number(transaction.value) / Number(WEI_PER_GLOW)),
              }
            : undefined
    }

    return {
        type: ActivityType.Basic,

        // meta information
        id: transaction.transactionHash,
        action: ActivityAction.Send,
        containsValue: true, // TODO: check if why we do this

        // transaction information
        transactionId: transaction.transactionHash,
        time: new Date(Number(timestamp) * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId, // TODO: what if sending to L1 ?
        sender,
        recipient,
        subject: recipient, // TODO: currently only support sending transaction activity
        direction,
        isInternal,

        // asset information
        baseTokenTransfer,
        tokenTransfer,
    }
}
