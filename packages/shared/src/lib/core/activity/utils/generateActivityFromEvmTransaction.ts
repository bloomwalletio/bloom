import {
    ERC20_ABI,
    ISC_MAGIC_CONTRACT_ADDRESS,
    ISC_SANDBOX_ABI,
    IscCallMethodInputs,
    WEI_PER_GLOW,
} from '@core/layer-2'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { getSubjectFromAddress, isAddressATrackedToken, isSubjectInternal } from '@core/wallet'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { PersistedEvmTransaction, TransactionActivity } from '../types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { calculateGasFeeInGlow } from '@core/layer-2/helpers'
import { AbiDecoder } from '@core/utils'
import { IChain } from '@core/network'
import { getActiveProfile } from '@core/profile/stores'

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

    let rawAmount: string | undefined
    let tokenId: string | undefined
    if (transaction.data) {
        const isErc20 = isAddressATrackedToken(networkId, recipient.address, getActiveProfile())
        const isIscContract = recipient.address === ISC_MAGIC_CONTRACT_ADDRESS

        const abi = isErc20 ? ERC20_ABI : isIscContract ? ISC_SANDBOX_ABI : undefined

        if (abi) {
            const abiDecoder = new AbiDecoder(abi, provider)
            const decoded = abiDecoder.decodeData(transaction.data as string)
            if (decoded?.name === 'call') {
                const inputs = decoded.inputs as IscCallMethodInputs

                const nativeToken = inputs?.allowance?.nativeTokens?.[0]
                if (nativeToken) {
                    tokenId = nativeToken.ID.data
                    rawAmount = nativeToken.amount
                }
            }
        }
    } else {
        tokenId = BASE_TOKEN_ID
        rawAmount = String(Number(transaction.value) / Number(WEI_PER_GLOW))
    }

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
