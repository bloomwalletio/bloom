import { TOKEN_ID_BYTE_LENGTH } from '@core/token/constants'
import { Converter } from '@core/utils/convert'

export function isIrcAsset(assetId: string): boolean {
    return Converter.hexToBytes(assetId).length === TOKEN_ID_BYTE_LENGTH
}
