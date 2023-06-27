import { getSelectedAccount } from '@core/account/stores'
import { buildBip32Path } from '@core/account/utils'
import { IChain } from '@core/network/interfaces'
import { TokenStandard } from '@core/wallet/enums'
import { IAsset } from '@core/wallet/interfaces'

import {
    getCommonEvmTransactionData,
    getErc20TransferSmartContractData,
    getIrc30TransferSmartContractData,
    signTransactionWithLedger,
} from '.'

export function signLayer2TransferTransactionData(
    chain: IChain,
    recipientAddress: string,
    asset: IAsset,
    amount: string
): Promise<string | undefined> {
    return signLayer2TransferTransactionDataHelper(chain, recipientAddress, asset, amount, () => {
        const standard = asset.metadata?.standard
        switch (standard) {
            case TokenStandard.BaseToken:
            case TokenStandard.Irc30:
                return getIrc30TransferSmartContractData(recipientAddress, asset, amount)
            case TokenStandard.Erc20:
                return getErc20TransferSmartContractData(recipientAddress, asset, amount, chain)
        }
    })
}

export async function signLayer2TransferTransactionDataHelper(
    chain: IChain,
    recipientAddress: string,
    asset: IAsset,
    amount: string,
    scDataFn: () => string
): Promise<string | undefined> {
    const provider = chain.getProvider()
    if (!provider) {
        return
    }

    const account = getSelectedAccount()
    if (!account) {
        return
    }

    const { evmAddresses, index } = account
    const originAddress = evmAddresses[chain?.getConfiguration().coinType]
    if (!originAddress) {
        return
    }

    const transaction = await getCommonEvmTransactionData(provider, originAddress, scDataFn())
    const bip32 = buildBip32Path(60, index)
    /* eslint-disable no-console */
    console.log('TRANSACTION: ', transaction)
    /* eslint-disable no-console */
    console.log('BIP PATH: ', bip32)
    return signTransactionWithLedger(transaction, bip32)
}
