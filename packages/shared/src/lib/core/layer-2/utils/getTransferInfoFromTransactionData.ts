import { PersistedEvmTransaction } from '@core/activity/types/persisted-evm-transaction.interface'
import { NetworkId } from '@core/network/types'
import { getActiveProfile } from '@core/profile/stores'
import { isAddressATrackedToken } from '@core/wallet/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS, WEI_PER_GLOW } from '../constants'
import { ERC20_ABI, ISC_SANDBOX_ABI } from '../abis'
import { AbiDecoder } from '@core/utils'
import { Erc20TransferMethodInputs, IscCallMethodInputs } from '../interfaces'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { IChain } from '@core/network'

export function getTransferInfoFromTransactionData(
    transaction: PersistedEvmTransaction,
    address: string,
    networkId: NetworkId,
    chain: IChain
): { tokenId: string; rawAmount: string } | undefined {
    if (transaction.data) {
        const isErc20 = isAddressATrackedToken(networkId, address, getActiveProfile())
        const isIscContract = address === ISC_MAGIC_CONTRACT_ADDRESS

        const abi = isErc20 ? ERC20_ABI : isIscContract ? ISC_SANDBOX_ABI : undefined

        if (!abi) {
            return undefined
        }

        const abiDecoder = new AbiDecoder(abi, chain.getProvider())
        const decoded = abiDecoder.decodeData(transaction.data as string)
        if (decoded?.name === 'call') {
            const inputs = decoded.inputs as IscCallMethodInputs

            const nativeToken = inputs?.allowance?.nativeTokens?.[0]
            if (nativeToken) {
                return {
                    tokenId: nativeToken.ID.data,
                    rawAmount: nativeToken.amount,
                }
            } else {
                return undefined
            }
        }
        if (decoded?.name === 'transfer') {
            const inputs = decoded.inputs as Erc20TransferMethodInputs

            return {
                tokenId: address,
                rawAmount: String(inputs._value),
            }
        } else {
            return undefined
        }
    } else {
        return {
            tokenId: BASE_TOKEN_ID,
            rawAmount: String(Number(transaction.value) / Number(WEI_PER_GLOW)),
        }
    }
}
