import { localize } from '@core/i18n'
import { MAX_TAG_BYTES, getByteLengthOfString } from '@core/utils'
import { RESERVED_TAG_KEYWORDS } from '../constants'
import { TagLengthError } from '../errors'

export function validateTag(tag: string): void {
    if (getByteLengthOfString(tag) > MAX_TAG_BYTES) {
        throw new TagLengthError()
    }

    if (RESERVED_TAG_KEYWORDS.includes(tag)) {
        throw new Error(localize('error.send.reservedTagKeyword'))
    }
}
