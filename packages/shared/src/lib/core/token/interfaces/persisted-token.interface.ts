import { TokenVerification } from '../types'
import { TokenMetadata } from '../types/token-metadata.type'

export interface IPersistedToken {
    id: string
    standard: string
    metadata?: TokenMetadata
    hidden: boolean
    verification: TokenVerification
}
