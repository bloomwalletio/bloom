import { IAsset } from '@core/wallet'
import { getIscpTransferMethod } from './getIscpTransferMethod'

export function getIrc30TransferSmartContractData(recipientAddress: string, asset: IAsset, amount: string): string {
    return getIscpTransferMethod(recipientAddress, asset, amount)?.encodeABI() ?? ''
}
