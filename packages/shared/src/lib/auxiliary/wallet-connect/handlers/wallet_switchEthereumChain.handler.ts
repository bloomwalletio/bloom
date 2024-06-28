import { WCRequestInfo } from '@auxiliary/wallet-connect/types'
import { getEvmNetworks } from '@core/network'
import { Converter } from '@core/utils'
import { getSdkError } from '@walletconnect/utils'

type WalletSwitchEthereumChain = [
    {
        chainId: `0x${string}`
    },
]

export function handleWalletSwitchEthereumChain(params: WalletSwitchEthereumChain, requestInfo: WCRequestInfo): void {
    const { responseCallback } = requestInfo

    const hexChainId = params[0]?.chainId
    if (!hexChainId) {
        responseCallback({ error: getSdkError('INVALID_METHOD') })
        return
    }

    const chainId = Converter.hexToDecimal(hexChainId)

    const isSupportedEvmChain = getEvmNetworks().some((network) => Number(network.chainId) === chainId)
    if (isSupportedEvmChain) {
        responseCallback({ result: chainId })
    } else {
        responseCallback({ error: getSdkError('UNSUPPORTED_CHAINS') })
    }
}
