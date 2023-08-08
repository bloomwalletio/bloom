import { Subject } from '@core/wallet/types'

export type SenderInfo = {
    subject: Subject | undefined
    isInternal: boolean
}
