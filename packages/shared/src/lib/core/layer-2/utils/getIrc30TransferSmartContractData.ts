import { IAsset } from '@core/wallet'
import { getIscpTransferMethod } from './getIscpTransferMethod'

export function getIrc30TransferSmartContractData(
    recipientAddress: string,
    asset: IAsset,
    chainId: number,
    amount: string
): string {
    return getIscpTransferMethod(recipientAddress, asset, chainId, amount)?.encodeABI() ?? ''
}
