import { localize } from '@core/i18n'
import { CONTACT_NOTE_MAX_LENGTH } from '../constants'

export function validateContactNote(note: string): void {
    if (note.length > CONTACT_NOTE_MAX_LENGTH) {
        throw new Error(
            localize('error.input.tooLong', { field: localize('general.note'), numCharacters: CONTACT_NOTE_MAX_LENGTH })
        )
    }
}
