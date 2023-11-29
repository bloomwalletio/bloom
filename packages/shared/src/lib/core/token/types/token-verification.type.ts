import { NotVerifiedStatus, VerifiedStatus } from '../enums'

export type TokenVerification =
    | { verified: true; status: VerifiedStatus }
    | { verified: false; status: NotVerifiedStatus }
