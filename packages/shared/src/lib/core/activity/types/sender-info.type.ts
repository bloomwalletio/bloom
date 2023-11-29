import { Subject } from '@core/wallet/types'

export type SenderInfo = {
    sender: Subject | undefined
    recipient: Subject | undefined
    subject: Subject | undefined
    isInternal: boolean
}
