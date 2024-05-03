import { StardustActivityType } from '@core/activity'
import { IEvmNetwork } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { LocalEvmTransaction } from '@core/transactions'
import { AbiDecoder, Converter, HEX_PREFIX } from '@core/utils'
import { isTrackedNftAddress, isTrackedTokenAddress } from '@core/wallet/actions'
import { ERC20_ABI, ERC721_ABI, ISC_SANDBOX_ABI } from '../abis'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'
import {
    Erc20TransferMethodInputs,
    Erc721SafeTransferMethodInputs,
    IscCallMethodInputs,
    IscSendMethodInputs,
} from '../interfaces'
import { getAmountForEvmTransaction } from '../helpers'

type TransferInfo =
    | {
          type: StardustActivityType.Basic
          tokenId: string
          rawAmount: bigint
          additionalBaseTokenAmount?: bigint
          recipientAddress: string
      }
    | { type: StardustActivityType.Nft; nftId: string; additionalBaseTokenAmount?: bigint; recipientAddress: string }
    | { type: StardustActivityType.SmartContract; recipientAddress: string }

export function getTransferInfoFromTransactionData(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork
): TransferInfo | undefined {
    const recipientAddress = transaction?.to?.toString()?.toLowerCase()
    if (!recipientAddress) {
        return undefined
    }

    if (transaction.data) {
        const isErc20 = isTrackedTokenAddress(evmNetwork.id, recipientAddress)
        const isErc721 = isTrackedNftAddress(evmNetwork.id, recipientAddress)
        const isIscContract = recipientAddress === ISC_MAGIC_CONTRACT_ADDRESS

        const abi = isErc721 ? ERC721_ABI : isErc20 ? ERC20_ABI : isIscContract ? ISC_SANDBOX_ABI : undefined

        if (!abi) {
            return { type: StardustActivityType.SmartContract, recipientAddress }
        }

        const abiDecoder = new AbiDecoder(abi, evmNetwork.provider)
        const decoded = abiDecoder.decodeData(transaction.data as string)
        switch (decoded?.name) {
            case 'call': {
                const inputs = decoded.inputs as IscCallMethodInputs
                const nativeToken = inputs?.allowance?.nativeTokens?.[0]
                const nftId = inputs?.allowance?.nfts?.[0]
                const agentId = inputs?.params.items?.find((item) => item.key === '0x61')?.value

                if (nativeToken) {
                    return {
                        type: StardustActivityType.Basic,
                        tokenId: nativeToken.ID.data,
                        rawAmount: BigInt(nativeToken.amount),
                        recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                    }
                } else if (nftId) {
                    return {
                        type: StardustActivityType.Nft,
                        nftId,
                        recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                    }
                } else {
                    return { type: StardustActivityType.SmartContract, recipientAddress }
                }
            }
            case 'transfer': {
                const inputs = decoded.inputs as Erc20TransferMethodInputs

                return {
                    type: StardustActivityType.Basic,
                    tokenId: recipientAddress,
                    rawAmount: BigInt(inputs._value),
                    recipientAddress: inputs._to,
                }
            }
            case 'safeTransferFrom': {
                const inputs = decoded.inputs as Erc721SafeTransferMethodInputs

                return {
                    type: StardustActivityType.Nft,
                    nftId: `${recipientAddress.toLowerCase()}:${inputs.tokenId}`,
                    recipientAddress: inputs.to,
                }
            }
            case 'send': {
                const inputs = decoded.inputs as IscSendMethodInputs
                const nativeToken = inputs?.assets?.nativeTokens?.[0]
                const nftId = inputs?.assets?.nfts?.[0]
                const baseTokenAmount = BigInt(inputs.assets.baseTokens)

                if (nativeToken) {
                    return {
                        type: StardustActivityType.Basic,
                        tokenId: nativeToken.ID.data,
                        rawAmount: BigInt(nativeToken.amount),
                        additionalBaseTokenAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                }
                if (nftId) {
                    return {
                        type: StardustActivityType.Nft,
                        nftId,
                        additionalBaseTokenAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                } else if (baseTokenAmount) {
                    return {
                        type: StardustActivityType.Basic,
                        tokenId: BASE_TOKEN_ID,
                        rawAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                }

                return { type: StardustActivityType.SmartContract, recipientAddress }
            }
            default:
                return { type: StardustActivityType.SmartContract, recipientAddress }
        }
    } else {
        return {
            type: StardustActivityType.Basic,
            tokenId: BASE_TOKEN_ID,
            rawAmount: getAmountForEvmTransaction(Converter.bigIntLikeToBigInt(transaction.value), evmNetwork.type),
            recipientAddress,
        }
    }
}
