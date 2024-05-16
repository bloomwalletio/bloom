import { IAccountState } from '@core/account/interfaces'
import { IEvmNetwork, NetworkNamespace, calculateGasFee } from '@core/network'
import {
    BaseEvmActivity,
    EvmCoinTransferActivity,
    EvmTokenMintingActivity,
    EvmTokenTransferActivity,
} from '../../types'
import { BlockscoutTransactionType, IBlockscoutTransaction } from '@auxiliary/blockscout'
import { ActivityAction, ActivityDirection, InclusionState } from '@core/activity/enums'
import { getAddressFromAccountForNetwork } from '@core/account'
import { ISmartContractSubject, SubjectType, getSubjectFromAddress, isSubjectInternal } from '@core/wallet'
import { EvmActivityType } from '@core/activity/enums/evm'
import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { NftStandard } from '@core/nfts'
import {
    BlockscoutTokenTransfer,
    isBlockscoutErc20Transfer,
    isBlockscoutErc721Transfer,
} from '@auxiliary/blockscout/types'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { isNftPersisted, persistErc721Nft } from '@core/nfts/actions'
import { BASE_TOKEN_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { getSmartContractDataFromBlockscoutTransaction } from './getSmartContractDataFromBlockscoutTransaction'

export async function generateEvmTokenTransferActivityFromBlockscoutTokenTransfer(
    blockscoutTokenTransfer: BlockscoutTokenTransfer,
    blockscoutTransaction: IBlockscoutTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmTokenTransferActivity | EvmTokenMintingActivity | EvmCoinTransferActivity | undefined> {
    const type =
        blockscoutTokenTransfer.type === BlockscoutTransactionType.TokenMinting
            ? EvmActivityType.TokenMinting
            : EvmActivityType.TokenTransfer

    const networkId = evmNetwork.id
    const direction =
        getAddressFromAccountForNetwork(account, networkId) === blockscoutTokenTransfer.to.hash.toLowerCase()
            ? ActivityDirection.Incoming
            : ActivityDirection.Outgoing

    const senderAddress =
        type === EvmActivityType.TokenMinting
            ? blockscoutTransaction?.to.hash ?? blockscoutTokenTransfer.from.hash
            : blockscoutTokenTransfer.from.hash

    const sender = getSubjectFromAddress(senderAddress.toLowerCase(), networkId)
    const recipient = getSubjectFromAddress(blockscoutTokenTransfer.to.hash.toLowerCase(), networkId)

    const subject = direction === ActivityDirection.Outgoing ? recipient : sender
    const isInternal = isSubjectInternal(recipient)

    const transactionFee = blockscoutTransaction
        ? calculateGasFee(blockscoutTransaction.gas_used, blockscoutTransaction.gas_price)
        : undefined

    let tokenId: string | undefined
    let rawAmount: bigint | undefined
    if (isBlockscoutErc721Transfer(blockscoutTokenTransfer)) {
        const address = blockscoutTokenTransfer.token.address.toLowerCase()
        const tokenIndex = blockscoutTokenTransfer.total.token_id
        tokenId = `${address}:${tokenIndex}`
        rawAmount = BigInt(1)
        if (!isNftPersisted(tokenId)) {
            await persistErc721Nft(address, tokenIndex, networkId)
        }
    } else if (isBlockscoutErc20Transfer(blockscoutTokenTransfer)) {
        tokenId = blockscoutTokenTransfer.token.address.toLowerCase()
        rawAmount = BigInt(blockscoutTokenTransfer.total.value ?? 0)
        await getOrRequestTokenFromPersistedTokens(tokenId, networkId)
    }
    const standard = blockscoutTokenTransfer.token.type.replace('-', '') as TokenStandard.Erc20 | NftStandard.Erc721

    if (!tokenId || !rawAmount) {
        return
    }

    const contract: ISmartContractSubject | undefined = blockscoutTokenTransfer.to.is_contract
        ? {
              type: SubjectType.SmartContract,
              address: blockscoutTokenTransfer.to.hash.toLowerCase(),
              name: blockscoutTokenTransfer.to.name ?? '',
              verified: blockscoutTokenTransfer.to.is_verified,
          }
        : blockscoutTransaction?.to
          ? {
                type: SubjectType.SmartContract,
                address: blockscoutTransaction?.to.hash.toLowerCase(),
                name: blockscoutTransaction?.to.name ?? undefined,
                verified: blockscoutTransaction?.to.is_contract ? blockscoutTransaction?.to.is_verified : undefined,
            }
          : undefined

    const baseActivity: BaseEvmActivity = {
        namespace: NetworkNamespace.Evm,

        // meta information
        id: blockscoutTokenTransfer.tx_hash.toLowerCase(),
        action: ActivityAction.Send,
        isSpam: false,

        transactionId: blockscoutTokenTransfer.tx_hash.toLowerCase(),
        time: new Date(blockscoutTokenTransfer.timestamp),
        inclusionState: InclusionState.Confirmed,

        // sender / recipient information
        sourceNetworkId: networkId,
        destinationNetworkId: networkId, // TODO: what if sending to L1 ?
        sender,
        recipient,
        subject,
        direction,
        isInternal,
        contract,
        transactionFee,
    }

    if (tokenId === BASE_TOKEN_CONTRACT_ADDRESS[networkId]) {
        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,

            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount,
            },
        }
    }

    const smartContractData = blockscoutTransaction
        ? getSmartContractDataFromBlockscoutTransaction(blockscoutTransaction, evmNetwork)
        : undefined

    return {
        ...baseActivity,
        type,

        tokenTransfer: {
            standard,
            tokenId,
            rawAmount,
        },

        methodId: blockscoutTransaction?.decoded_input?.method_id ?? blockscoutTransaction?.method,
        method: smartContractData?.method,
        inputs: smartContractData?.inputs,
        rawData: blockscoutTransaction?.raw_input ?? '',
        contract,
    }
}
