import { TxData } from '@ethereumjs/tx'
import { isTrackedNftAddress, isTrackedTokenAddress } from '@core/wallet/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS, WEI_PER_GLOW } from '../constants'
import { ERC20_ABI, ERC721_ABI, ISC_SANDBOX_ABI } from '../abis'
import { AbiDecoder, HEX_PREFIX } from '@core/utils'
import { Erc20TransferMethodInputs, IscCallMethodInputs, IscSendMethodInputs } from '../interfaces'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { IChain } from '@core/network'
import { ActivityType } from '@core/activity'

type TransferInfo =
    | {
          type: ActivityType.Basic
          tokenId: string
          rawAmount: string
          additionalBaseTokenAmount?: string
          recipientAddress: string
      }
    | { type: ActivityType.Nft; nftId: string; additionalBaseTokenAmount?: string; recipientAddress: string }
    | { type: ActivityType.SmartContract }

export function getTransferInfoFromTransactionData(transaction: TxData, chain: IChain): TransferInfo | undefined {
    const networkId = chain.getConfiguration().id

    const recipientAddress = transaction.to?.toString()
    if (!recipientAddress) {
        return undefined
    }

    if (transaction.data) {
        const isErc20 = isTrackedTokenAddress(networkId, recipientAddress)
        const isErc721 = isTrackedNftAddress(networkId, recipientAddress)
        const isIscContract = recipientAddress === ISC_MAGIC_CONTRACT_ADDRESS

        const abi = isErc20 ? ERC20_ABI : isErc721 ? ERC721_ABI : isIscContract ? ISC_SANDBOX_ABI : undefined

        if (!abi) {
            return { type: ActivityType.SmartContract }
        }

        const abiDecoder = new AbiDecoder(abi, chain.getProvider())
        const decoded = abiDecoder.decodeData(transaction.data as string)
        switch (decoded?.name) {
            case 'call': {
                const inputs = decoded.inputs as IscCallMethodInputs
                const nativeToken = inputs?.allowance?.nativeTokens?.[0]
                const nftId = inputs?.allowance?.nfts?.[0]
                const agentId = inputs?.params.items?.find((item) => item.key === '0x61')?.value

                if (nativeToken) {
                    return {
                        type: ActivityType.Basic,
                        tokenId: nativeToken.ID.data,
                        rawAmount: nativeToken.amount,
                        recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                    }
                } else if (nftId) {
                    return {
                        type: ActivityType.Nft,
                        nftId,
                        recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                    }
                } else {
                    return { type: ActivityType.SmartContract }
                }
            }
            case 'transfer': {
                const inputs = decoded.inputs as Erc20TransferMethodInputs

                return {
                    type: ActivityType.Basic,
                    tokenId: recipientAddress,
                    rawAmount: String(inputs._value),
                    recipientAddress: inputs._to,
                }
            }
            case 'send': {
                const inputs = decoded.inputs as IscSendMethodInputs
                const nativeToken = inputs?.assets?.nativeTokens?.[0]
                const nftId = inputs?.assets?.nfts?.[0]
                const baseTokenAmount = inputs.assets.baseTokens

                if (nativeToken) {
                    return {
                        type: ActivityType.Basic,
                        tokenId: nativeToken.ID.data,
                        rawAmount: nativeToken.amount,
                        additionalBaseTokenAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                }
                if (nftId) {
                    return {
                        type: ActivityType.Nft,
                        nftId,
                        additionalBaseTokenAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                } else if (baseTokenAmount) {
                    return {
                        type: ActivityType.Basic,
                        tokenId: BASE_TOKEN_ID,
                        rawAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                }

                return { type: ActivityType.SmartContract }
            }
            default:
                return { type: ActivityType.SmartContract }
        }
    } else {
        return {
            type: ActivityType.Basic,
            tokenId: BASE_TOKEN_ID,
            rawAmount: String(Number(transaction.value) / Number(WEI_PER_GLOW)),
            recipientAddress,
        }
    }
}
