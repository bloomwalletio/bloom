import type { Subject } from '../types'

export function getAddressFromSubject(subject: Subject | undefined): string {
    if (!subject) {
        return ''
    } else if (subject.type === 'account') {
        return subject.account.depositAddress
    } else {
        return subject.address
    }
}
