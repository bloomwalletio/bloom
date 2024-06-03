import { getSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { IscCoreContracts } from '@core/isc/classes/isc-core-contracts.class'
import { IscChain } from '@core/network'
import { TransferredAsset } from '../types'

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

        const coreContracts = new IscCoreContracts(iscChain)
        return coreContracts.accounts.encodeTransferAllowanceTo(recipientAddress, transferredAsset)
    } catch (err) {
        handleError(err)
        return ''
    }
}
