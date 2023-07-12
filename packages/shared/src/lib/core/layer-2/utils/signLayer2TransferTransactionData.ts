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

    const destinationAddress = getDestinationAddress(asset, recipientAddress)

    let value
    let data
    if (asset.metadata?.standard === TokenStandard.BaseToken) {
        value = amount
        data = undefined
    } else {
        value = '0'
        data = getTransactionData(chain, recipientAddress, asset, amount)
        if (!data) {
            return
        }
    }

    const transaction = await getCommonEvmTransactionData(provider, originAddress, destinationAddress, value, data)
    const bip32 = buildBip32Path(60, index)
    /* eslint-disable no-console */
    console.log('TRANSACTION: ', transaction)
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
            return undefined
        case TokenStandard.Irc30:
            return getIrc30TransferSmartContractData(recipientAddress, asset, chain.getConfiguration().chainId, amount)
        case TokenStandard.Erc20:
            return getErc20TransferSmartContractData(recipientAddress, asset, amount, chain)
    }
}

function getDestinationAddress(asset: IAsset, recipientAddress: string): string {
    const standard = asset.metadata?.standard
    switch (standard) {
        case TokenStandard.BaseToken:
            return recipientAddress
        case TokenStandard.Irc30:
            return ISC_MAGIC_CONTRACT_ADDRESS
        case TokenStandard.Erc20:
            return asset.id
        default:
            return recipientAddress
    }
}
