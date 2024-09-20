import { updateSelectedAccount } from '@core/account/stores'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IEvmNetwork } from '@core/network'
import { getIsActiveLedgerProfile } from '@core/profile/stores'
import { DEFAULT_RETURN_FORMAT, TransactionReceipt, Web3PromiEvent } from 'web3'
import { SendSignedTransactionEvents } from 'web3/lib/commonjs/eth.exports'

export function sendSignedEvmTransaction(
    evmNetwork: IEvmNetwork,
    signedTransaction: string
): Web3PromiEvent<TransactionReceipt, SendSignedTransactionEvents<typeof DEFAULT_RETURN_FORMAT>> {
    try {
        updateSelectedAccount({ isTransferring: true })

        return evmNetwork.provider.eth.sendSignedTransaction(signedTransaction)
    } catch (err) {
        if (getIsActiveLedgerProfile()) {
            closePopup({ forceClose: true })
        }
        throw err
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
