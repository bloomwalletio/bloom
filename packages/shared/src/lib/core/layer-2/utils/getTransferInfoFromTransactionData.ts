import { TxData } from '@ethereumjs/tx'
import { isTrackedTokenAddress } from '@core/wallet/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS, WEI_PER_GLOW } from '../constants'
import { ERC20_ABI, ISC_SANDBOX_ABI } from '../abis'
import { AbiDecoder, HEX_PREFIX } from '@core/utils'
import { Erc20TransferMethodInputs, IscCallMethodInputs, IscSendMethodInputs } from '../interfaces'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { IChain } from '@core/network'
import { AssetType, TransferredAssetId } from '..'

type TransferInfo =
    | { type: 'Asset'; asset: TransferredAssetId; additionalBaseTokenAmount?: string; recipientAddress: string }
    | { type: 'SmartContract' }

export function getTransferInfoFromTransactionData(transaction: TxData, chain: IChain): TransferInfo | undefined {
    const networkId = chain.getConfiguration().id

    const recipientAddress = transaction.to?.toString()
    if (!recipientAddress) {
        return undefined
    }

    if (transaction.data) {
        const isErc20 = isTrackedTokenAddress(networkId, recipientAddress)
        const isIscContract = recipientAddress === ISC_MAGIC_CONTRACT_ADDRESS

        const abi = isErc20 ? ERC20_ABI : isIscContract ? ISC_SANDBOX_ABI : undefined

        if (!abi) {
            return { type: 'SmartContract' }
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
                        type: 'Asset',
                        asset: {
                            type: AssetType.Token,
                            tokenId: nativeToken.ID.data,
                            rawAmount: nativeToken.amount,
                        },
                        recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                    }
                } else if (nftId) {
                    return {
                        type: 'Asset',
                        asset: {
                            type: AssetType.Nft,
                            nftId,
                        },
                        recipientAddress: HEX_PREFIX + agentId?.substring(agentId.length - 40),
                    }
                } else {
                    return undefined
                }
            }
            case 'transfer': {
                const inputs = decoded.inputs as Erc20TransferMethodInputs

                return {
                    type: 'Asset',
                    asset: {
                        type: AssetType.Token,
                        tokenId: recipientAddress,
                        rawAmount: String(inputs._value),
                    },
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
                        type: 'Asset',
                        asset: {
                            type: AssetType.Token,
                            tokenId: nativeToken.ID.data,
                            rawAmount: nativeToken.amount,
                        },
                        additionalBaseTokenAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                }
                if (nftId) {
                    return {
                        type: 'Asset',
                        asset: {
                            type: AssetType.Nft,
                            nftId,
                        },
                        additionalBaseTokenAmount: baseTokenAmount,
                        recipientAddress, // for now, set it to the magic contract address
                    }
                } else if (baseTokenAmount) {
                    return {
                        type: 'Asset',
                        asset: {
                            type: AssetType.BaseCoin,
                            tokenId: BASE_TOKEN_ID,
                            rawAmount: baseTokenAmount,
                        },
                        recipientAddress, // for now, set it to the magic contract address
                    }
                }

                return undefined
            }
            default:
                return undefined
        }
    } else {
        return {
            type: 'Asset',
            asset: {
                type: AssetType.BaseCoin,
                tokenId: BASE_TOKEN_ID,
                rawAmount: String(Number(transaction.value) / Number(WEI_PER_GLOW)),
            },
            recipientAddress,
        }
    }
}
