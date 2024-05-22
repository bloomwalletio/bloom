import { IAccountState } from '@core/account/interfaces'
import { getAddressFromAccountForNetwork } from '@core/account/utils'
import { IEvmNetwork, NetworkNamespace, calculateGasFee } from '@core/network'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { ActivityAction, ActivityDirection, InclusionState } from '../../enums'
import { BaseEvmActivity } from '../../types'
import type { BigIntLike } from '@ethereumjs/util'

export async function generateBaseEvmActivity(
    transaction: {
        transactionHash: string
        from: string
        recipient: string
        gasUsed: number
        blockNumber: number
        estimatedGas?: bigint
        gasPrice?: BigIntLike
        timestamp?: number
    },
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<BaseEvmActivity> {
    const networkId = evmNetwork.id
    const direction =
        getAddressFromAccountForNetwork(account, networkId) === transaction.recipient
            ? ActivityDirection.Incoming
            : ActivityDirection.Outgoing

    const sender = getSubjectFromAddress(transaction.from, networkId)
    const recipient = getSubjectFromAddress(transaction.recipient, networkId)

    const subject = direction === ActivityDirection.Outgoing ? recipient : sender
    const isInternal = isSubjectInternal(recipient)
    const timestamp = transaction.timestamp ?? (await getTimeStamp(transaction.blockNumber, evmNetwork))

    // For native token transfers on L2, gasUsed is 0. Therefor we fallback to the estimatedGas
    // https://discord.com/channels/397872799483428865/930642258427019354/1168854453005332490
    const gasUsed = transaction.gasUsed || transaction.estimatedGas
    const transactionFee = transaction.gasPrice ? calculateGasFee(gasUsed, transaction.gasPrice) : undefined

    return {
        namespace: NetworkNamespace.Evm,

        // meta information
        id: transaction.transactionHash,
        action: ActivityAction.Send,
        isSpam: false,

        // transaction information
        transactionId: transaction.transactionHash,
        time: new Date(timestamp),
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId, // TODO: what if sending to L1 ?
        sender,
        recipient,
        subject,
        direction,
        isInternal,

        transactionFee,
    }
}

async function getTimeStamp(blockNumber: number, evmNetwork: IEvmNetwork): Promise<number> {
    const { timestamp } = await evmNetwork.provider.eth.getBlock(blockNumber)
    return Number(timestamp) * MILLISECONDS_PER_SECOND
}
