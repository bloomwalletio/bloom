import { TransactionReceipt } from 'web3-core'
import { updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IChain } from '@core/network'
import { getIsActiveLedgerProfile } from '@core/profile/stores'

export async function sendSignedEvmTransaction(
    chain: IChain,
    signedTransaction: string
): Promise<TransactionReceipt | undefined> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const provider = chain.getProvider()
        return await provider?.eth.sendSignedTransaction(signedTransaction)
    } catch (err) {
        if (getIsActiveLedgerProfile()) {
            closePopup({ forceClose: true })
        }
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
