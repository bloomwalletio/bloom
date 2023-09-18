import { PersistedEvmTransaction } from '@core/activity/types/persisted-evm-transaction.interface'
import { IChain } from '@core/network'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { AbiDecoder, HEX_PREFIX } from '@core/utils'
import { isTrackedTokenAddress } from '@core/wallet/actions'
import { ERC20_ABI, ISC_SANDBOX_ABI } from '../abis'
import { ISC_MAGIC_CONTRACT_ADDRESS, WEI_PER_GLOW } from '../constants'
import { Erc20TransferMethodInputs, IscCallMethodInputs } from '../interfaces'

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
