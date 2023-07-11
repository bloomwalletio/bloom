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
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'

export async function signLayer2TransferTransactionData(
    chain: IChain,
    recipientAddress: string,
    asset: IAsset,
    amount: string
): Promise<string | undefined> {
    const provider = chain.getProvider()
    const account = getSelectedAccount()
    if (!provider || !account) {
        return
    }

    const { evmAddresses, index } = account
    const originAddress = evmAddresses[chain?.getConfiguration().coinType]
    if (!originAddress) {
        return
    }

    const data = getTransactionData(chain, recipientAddress, asset, amount)
    const contractAddress = getRecipientAddress(asset)
    if (!data || !contractAddress) {
        return
    }

    const transaction = await getCommonEvmTransactionData(provider, originAddress, contractAddress, data)
    const bip32 = buildBip32Path(60, index)
    /* eslint-disable no-console */
    console.log('TRANSACTION: ', transaction)
    /* eslint-disable no-console */
    console.log('BIP PATH: ', bip32)
    return signTransactionWithLedger(transaction, bip32)
}

function getTransactionData(
    chain: IChain,
    recipientAddress: string,
    asset: IAsset,
    amount: string
): string | undefined {
    const standard = asset.metadata?.standard
    switch (standard) {
        case TokenStandard.BaseToken:
        case TokenStandard.Irc30:
            return getIrc30TransferSmartContractData(recipientAddress, asset, chain.getConfiguration().chainId, amount)
        case TokenStandard.Erc20:
            return getErc20TransferSmartContractData(recipientAddress, asset, amount, chain)
    }
}

function getRecipientAddress(asset: IAsset): string | undefined {
    const standard = asset.metadata?.standard
    switch (standard) {
        case TokenStandard.BaseToken:
        case TokenStandard.Irc30:
            return ISC_MAGIC_CONTRACT_ADDRESS
        case TokenStandard.Erc20:
            return asset.id
    }
}
