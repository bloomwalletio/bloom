import { PersistedEvmTransaction } from '@core/activity/types/persisted-evm-transaction.interface'
import { NetworkId } from '@core/network/types'
import { isTrackedTokenAddress } from '@core/wallet/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS, WEI_PER_GLOW } from '../constants'
import { ERC20_ABI, ISC_SANDBOX_ABI } from '../abis'
import { AbiDecoder, HEX_PREFIX } from '@core/utils'
import { Erc20TransferMethodInputs, IscCallMethodInputs, IscSendMethodInputs } from '../interfaces'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { IChain } from '@core/network'

export function getTransferInfoFromTransactionData(
    transaction: PersistedEvmTransaction,
    address: string,
    networkId: NetworkId,
    chain: IChain
): { tokenId: string; rawAmount: string; recipientAddress: string } | undefined {
    if (transaction.data) {
        const isErc20 = isTrackedTokenAddress(networkId, address)
        const isIscContract = address === ISC_MAGIC_CONTRACT_ADDRESS

        const abi = isErc20 ? ERC20_ABI : isIscContract ? ISC_SANDBOX_ABI : undefined

        if (!abi) {
            return undefined
        }

        const abiDecoder = new AbiDecoder(abi, chain.getProvider())
        const decoded = abiDecoder.decodeData(transaction.data as string)
        switch (decoded?.name) {
            case 'call': {
                const inputs = decoded.inputs as IscCallMethodInputs
                const nativeToken = inputs?.allowance?.nativeTokens?.[0]
                const agentId = inputs?.params.items?.find((item) => item.key === '0x61')?.value

                if (nativeToken) {
                    return {
                        tokenId: nativeToken.ID.data,
                        rawAmount: nativeToken.amount,
                        recipientAddress: HEX_PREFIX + agentId?.slice(4),
                    }
                } else {
                    return undefined
                }
            }
            case 'transfer': {
                const inputs = decoded.inputs as Erc20TransferMethodInputs

                return {
                    tokenId: address,
                    rawAmount: String(inputs._value),
                    recipientAddress: inputs._to,
                }
            }
            case 'send': {
                const inputs = decoded.inputs as IscSendMethodInputs

                if (inputs.assets.baseTokens) {
                    return {
                        tokenId: BASE_TOKEN_ID,
                        rawAmount: inputs.assets.baseTokens,
                        recipientAddress: inputs.targetAddress.data,
                    }
                } else if (inputs.assets.nativeTokens) {
                    const nativeToken = inputs.assets.nativeTokens[0]
                    return {
                        tokenId: nativeToken.ID.data,
                        rawAmount: nativeToken.amount,
                        recipientAddress: inputs.targetAddress.data,
                    }
                }

                return undefined
            }
            default:
                return undefined
        }
    } else {
        return {
            tokenId: BASE_TOKEN_ID,
            rawAmount: String(Number(transaction.value) / Number(WEI_PER_GLOW)),
            recipientAddress: address,
        }
    }
}
