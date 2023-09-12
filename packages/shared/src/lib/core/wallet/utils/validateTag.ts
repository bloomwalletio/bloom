import { localize } from '@core/i18n'
import { RESERVED_TAG_KEYWORDS } from '../constants'

export function validateTag(tag: string): void {
    console.log('inside validate')
    if (RESERVED_TAG_KEYWORDS.includes(tag)) {
        throw new Error(localize('error.send.reservedTagKeyword'))
    }
}
