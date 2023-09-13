import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { PersistedEvmTransaction, TransactionActivity } from '../types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { calculateGasFeeInGlow } from '@core/layer-2/helpers'
import { IChain } from '@core/network'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'

export async function generateActivityFromEvmTransaction(
    transaction: PersistedEvmTransaction,
    networkId: NetworkId,
    chain: IChain
): Promise<TransactionActivity> {
    const provider = chain.getProvider()

    const direction = ActivityDirection.Outgoing // Currently only sent transactions are supported

    const sender = getSubjectFromAddress(transaction.from, networkId)
    const recipient = getSubjectFromAddress(transaction.to, networkId)
    const isInternal = isSubjectInternal(recipient)
    const timestamp = (await provider.eth.getBlock(transaction.blockNumber)).timestamp

    const { tokenId, rawAmount } =
        getTransferInfoFromTransactionData(transaction, recipient.address, networkId, chain) ?? {}

    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: tokenId === BASE_TOKEN_ID ? rawAmount ?? '0' : '0',
    }

    let tokenTransfer
    if (tokenId && tokenId !== BASE_TOKEN_ID) {
        const persistedToken = await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
        tokenTransfer = persistedToken
            ? {
                  tokenId: persistedToken.id,
                  rawAmount: rawAmount ?? '0',
              }
            : undefined
    }

    const transactionFee = transaction.gasPrice
        ? Number(calculateGasFeeInGlow(transaction.gasUsed, transaction.gasPrice))
        : undefined

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

        transactionFee,
    }
}
