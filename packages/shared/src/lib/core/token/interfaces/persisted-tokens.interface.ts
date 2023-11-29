import { IPersistedToken } from './persisted-token.interface'

export interface IPersistedTokens {
    [profileId: string]: {
        [tokenId: string]: IPersistedToken
    }
}
