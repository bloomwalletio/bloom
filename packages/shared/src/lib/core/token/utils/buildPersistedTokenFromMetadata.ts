import { NotVerifiedStatus, TokenStandard } from '../enums'
import { IErc20Metadata, IIrc30Metadata, IPersistedToken } from '../interfaces'
import { TokenVerification } from '../types'

export function buildPersistedTokenFromMetadata(
    tokenId: string,
    metadata: IIrc30Metadata | IErc20Metadata,
    verification: TokenVerification = { verified: false, status: NotVerifiedStatus.New }
): IPersistedToken {
    return {
        id: tokenId,
        standard: metadata.standard,
        metadata: {
            standard: metadata.standard,
            name: metadata.name,
            symbol: metadata.symbol,
            decimals: metadata.decimals,
            ...(metadata.standard === TokenStandard.Irc30 &&
                metadata?.description && { description: metadata?.description }),
            ...(metadata.standard === TokenStandard.Irc30 && metadata?.url && { url: metadata?.url }),
            ...(metadata.standard === TokenStandard.Irc30 && metadata?.logoUrl && { logoUrl: metadata?.logoUrl }),
            ...(metadata.standard === TokenStandard.Irc30 && metadata?.logo && { logo: metadata?.logo }),
        },
        hidden: false,
        verification,
    }
}
