import { IscChain } from '@core/network'
import { getSelectedAccount } from '@core/account/stores'
import { ContractType } from '@core/layer-2/enums'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { handleError } from '@core/error/handlers'
import { TransferredAsset } from '../types'
import { evmAddressToAgentId, getAgentBalanceParameters, getSmartContractHexName } from '../helpers'
import { buildAssetAllowance } from '../utils'

export function getIscTransferSmartContractData(
    recipientAddress: string,
    transferredAsset: TransferredAsset,
    iscChain: IscChain
): string {
    try {
        const coinType = iscChain.coinType
        const evmAddress = getSelectedAccount()?.evmAddresses?.[coinType]
        if (!evmAddress) {
            throw new Error('No EVM address generated for this account.')
        }

        const accountsCoreContract = getSmartContractHexName('accounts')
        const transferAllowanceTo = getSmartContractHexName('transferAllowanceTo')

        const agentId = evmAddressToAgentId(recipientAddress, iscChain.aliasAddress)
        const parameters = getAgentBalanceParameters(agentId)
        const allowance = buildAssetAllowance(transferredAsset)

        const contract = iscChain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
        const method = contract.methods.call(accountsCoreContract, transferAllowanceTo, parameters, allowance)
        return method.encodeABI() ?? ''
    } catch (err) {
        handleError(err)
        return ''
    }
}