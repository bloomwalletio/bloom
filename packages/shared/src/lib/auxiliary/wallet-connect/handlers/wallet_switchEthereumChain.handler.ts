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

    const supportedChainIds = getEvmNetworks().map((network) => network.chainId)
    if (supportedChainIds.find((id) => Number(id) === chainId)) {
        responseCallback({ result: chainId })
    } else {
        responseCallback({ error: getSdkError('UNSUPPORTED_CHAINS') })
    }
}
