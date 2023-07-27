import { ETH_COIN_TYPE, IChain } from '@core/network'
import {
    evmAddressToAgentID,
    getAgentBalanceParameters,
    getLayer2AssetAllowance,
    getSmartContractHexName,
} from '@core/layer-2/utils'
import { getSelectedAccount } from '@core/account/stores'
import { ContractType } from '@core/layer-2/enums'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { handleError } from '@core/error/handlers'
import { IError } from '@core/error/interfaces'
import { TransferredAsset } from '../types'

export function getIscpTransferSmartContractData(
    recipientAddress: string,
    transferredAsset: TransferredAsset,
    chain: IChain
): string {
    try {
        const provider = chain.getProvider()
        if (!provider) {
            throw new Error('Unable to find web3 provider.')
        }

        const evmAddress = getSelectedAccount()?.evmAddresses?.[ETH_COIN_TYPE]
        if (!evmAddress) {
            throw new Error('No EVM address generated for this account.')
        }

        const accountsCoreContract = getSmartContractHexName('accounts')
        const transferAllowanceTo = getSmartContractHexName('transferAllowanceTo')

        const agentId = evmAddressToAgentID(recipientAddress)
        const parameters = getAgentBalanceParameters(agentId)
        const allowance = getLayer2AssetAllowance(transferredAsset)

        const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const method = contract.methods.call(accountsCoreContract, transferAllowanceTo, parameters, allowance)
        return method.encodeABI() ?? ''
    } catch (err) {
        handleError(err as IError)
        return ''
    }
}
